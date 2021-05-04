import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import OpenSeaDragon from 'openseadragon';
import * as d3 from 'd3';
import {
  OperationType,
  Point,
  Operation,
  PointOperation,
  OperationSet,
  LineOperation,
  AreaOperation,
} from '@src/models/Operation';
import {
  selectOperation,
  setOperationType,
  addPoint,
  addLinePoint,
  addAreaPoint,
  updatePoint,
  updateLinePoint,
  updateAreaPoint,
  removePoint,
  removeLine,
  removeArea,
} from '@src/stores/operations';
import '@src/styles/operations.scss';

interface OperationsLayerProps {
  viewer?: OpenSeaDragon.Viewer;
  children?: ReactNode;
  operations?: OperationSet;
}

interface NodeData {
  id: string;
  operationId?: string;
}

interface CircleData extends NodeData {
  type: OperationType;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  vr: number;
  indices: number[];
  lineId?: string;
  areaId?: string;
}

interface PolylineData extends NodeData {
  circles: CircleData[];
}

interface RectData extends NodeData {
  vx: number;
  vy: number;
  vw: number;
  vh: number;
  circles: CircleData[];
}

const svgNS = 'http://www.w3.org/2000/svg';

const useStyles = makeStyles(() =>
  createStyles({
    circle: {
      strokeWidth: '3px',
      vectorEffect: 'non-scaling-stroke',
      fill: '#00000001',
    },
    line: {
      fill: 'transparent',
      pointerEvents: 'none',
    },
    area: {
      fill: 'transparent',
      pointerEvents: 'none',
    },
  }),
);

const OperationsLayer: React.FC<OperationsLayerProps> = (props: OperationsLayerProps) => {
  const [svg] = useState<SVGSVGElement>(document.createElementNS(svgNS, 'svg'));
  const [root] = useState<SVGGElement>(document.createElementNS(svgNS, 'g'));
  const [points] = useState<SVGGElement>(document.createElementNS(svgNS, 'g'));
  const [lines] = useState<SVGGElement>(document.createElementNS(svgNS, 'g'));
  const [areas] = useState<SVGGElement>(document.createElementNS(svgNS, 'g'));

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [selectedCircle, setSelectedCircle] = useState<CircleData>();

  const selectedOperation = useSelector<RootStateOrAny, Operation>(
    (state) => state.operations.selectedOperation,
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    window.onkeydown = ({ key }: KeyboardEvent) => {
      const data = selectedCircle;
      if (!data) {
        return;
      }
      const index = data.indices[0];
      if (key === 'backspace' || key === 'delete') {
        switch (data.type) {
          case OperationType.Point:
            dispatch(removePoint({ index }));
            break;
          case OperationType.Line:
            dispatch(removeLine({ index }));
            break;
          case OperationType.Area:
            dispatch(removeArea({ index }));
            break;
          default:
            break;
        }
      }
    };
  }, [selectedCircle, dispatch]);

  useEffect(() => {
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';

    root.classList.add('operation');
    svg.appendChild(root);

    points.classList.add('points');
    root.appendChild(points);

    lines.classList.add('lines');
    root.appendChild(lines);

    areas.classList.add('areas');
    root.appendChild(areas);
  }, [svg, root, points, lines, areas]);

  useEffect(() => {
    const viewer = props.viewer;
    if (!viewer) {
      return;
    }

    const handleResize = () => {
      const width = viewer.container.clientWidth;
      if (containerWidth !== width) {
        setContainerWidth(width);
        svg.setAttribute('width', `${width}`);
      }

      const height = viewer.container.clientHeight;
      if (containerHeight !== height) {
        setContainerHeight(height);
        svg.setAttribute('height', `${height}`);
      }

      const p = viewer.viewport.pixelFromPoint(new OpenSeaDragon.Point(0, 0), true);
      const zoom = viewer.viewport.getZoom(true);
      const rotation = viewer.viewport.getRotation();

      const viewport = viewer.viewport as any;
      const scale = viewport._containerInnerSize.x * zoom;
      root.setAttribute(
        'transform',
        `translate(${p.x},${p.y}) scale(${scale}) rotate(${rotation})`,
      );
    };

    if (!viewer) {
      return () => {
        // dare to do nothing.
      };
    }

    viewer.addHandler('animation', handleResize);
    viewer.addHandler('open', handleResize);
    viewer.addHandler('rotate', handleResize);
    viewer.addHandler('resize', handleResize);

    const exists = viewer.canvas.querySelector('svg');
    if (!exists) {
      viewer.canvas.appendChild(svg);
    }
    handleResize();

    return () => {
      viewer.removeHandler('animation', handleResize);
      viewer.removeHandler('open', handleResize);
      viewer.removeHandler('rotate', handleResize);
      viewer.removeHandler('resize', handleResize);
    };
  }, [props.viewer, svg, root, containerWidth, containerHeight, dispatch]);

  useEffect(() => {
    const viewer = props.viewer;
    const op = props.operations;
    if (!viewer || !op) {
      return;
    }

    const type = op.operationType;
    const cfg = op.config;

    const handleClick = (e: OpenSeaDragon.ViewerEvent) => {
      if (!e.position) {
        return;
      }
      const pt = viewer.viewport.pointFromPixel(e.position);
      const px = viewer.viewport.viewportToImageCoordinates(pt);
      const x = px.x;
      const y = px.y;
      const radius = cfg.pointSize;

      switch (type) {
        case OperationType.Point:
          dispatch(addPoint({ x, y, radius }));
          break;
        case OperationType.Line:
          dispatch(addLinePoint({ x, y, radius }));
          break;
        case OperationType.Area:
          dispatch(addAreaPoint({ x, y, radius }));
          break;
        default:
          break;
      }
    };

    if (!viewer) {
      return;
    }

    viewer.addHandler('canvas-click', handleClick);

    return () => {
      viewer.removeAllHandlers('canvas-click');
    };
  }, [props.viewer, props.operations, dispatch]);

  useEffect(() => {
    const viewer = props.viewer;
    if (!viewer) {
      return;
    }

    const imageToViewportCircle = (p: Point) => {
      const rect = viewer.viewport.imageToViewportRectangle(p.x, p.y, p.radius, p.radius);
      return { vx: rect.x, vy: rect.y, vr: rect.width / 2 };
    };

    const imageToViewportRect = (a: AreaOperation) => {
      const rect = viewer.viewport.imageToViewportRectangle(a.x, a.y, a.width, a.height);
      return { vx: rect.x, vy: rect.y, vw: rect.width, vh: rect.height };
    };

    const handleFocus = (el: SVGCircleElement) => {
      const circle = d3.select<SVGCircleElement, CircleData>(el);
      const data = circle.datum();
      setSelectedCircle(data);
      dispatch(setOperationType(data.type));
      dispatch(selectOperation(data.areaId || data.lineId || data.id));
    };

    const handleDrag = (el: SVGCircleElement, e: any) => {
      const circle = d3.select<SVGCircleElement, CircleData>(el);
      const data = circle.datum();

      setSelectedCircle(data);

      const delta = viewer.viewport.deltaPointsFromPixels(e.delta);
      data.vx += delta.x;
      data.vy += delta.y;

      circle.attr('cx', (d) => d.vx).attr('cy', (d) => d.vy);

      if (data.lineId) {
        const polyline = d3.select<SVGPolylineElement, PolylineData>(`#${data.lineId}`);
        polyline.attr('points', (d) =>
          d.circles.flatMap((c: CircleData) => [c.vx, c.vy]).join(','),
        );
      }

      if (data.areaId) {
        const rect = d3.select<SVGRectElement, RectData>(`#${data.areaId}`);
        const rectData = rect.datum();
        rectData.vx = Math.min(rectData.circles[0].vx, rectData.circles[1].vx);
        rectData.vy = Math.min(rectData.circles[0].vy, rectData.circles[1].vy);
        rectData.vw = Math.abs(rectData.circles[1].vx - rectData.circles[0].vx);
        rectData.vh = Math.abs(rectData.circles[1].vy - rectData.circles[0].vy);

        rect
          .attr('x', (d) => d.vx)
          .attr('y', (d) => d.vy)
          .attr('width', (d) => d.vw)
          .attr('height', (d) => d.vh);
      }
    };

    const handleDragEnd = (el: SVGCircleElement) => {
      const data = d3.select<SVGCircleElement, CircleData>(el).datum();
      const px = viewer.viewport.viewportToImageCoordinates(data.vx, data.vy);
      const x = px.x;
      const y = px.y;
      const point = { x, y, radius: data.radius };
      const { indices } = data;

      switch (data.type) {
        case OperationType.Point:
          dispatch(updatePoint({ indices, point }));
          break;
        case OperationType.Line:
          dispatch(updateLinePoint({ indices, point }));
          break;
        case OperationType.Area:
          dispatch(updateAreaPoint({ indices, point }));
          break;
        default:
          break;
      }
    };

    const strokeWidth = (d: NodeData) => {
      return d.operationId === selectedOperation?.id ? '5px' : '3px';
    };

    const renderPoints = (
      type: OperationType,
      group: SVGGElement,
      operations: PointOperation[],
    ) => {
      const g = d3.select(group);
      const data = operations.map<CircleData>((o, i) => ({
        ...o,
        ...imageToViewportCircle(o),
        id: `point-${o.id || ''}`,
        operationId: o.id,
        type,
        indices: [i, i],
      }));
      const circles = g.selectAll<SVGCircleElement, CircleData[]>('circle').data(data);
      circles
        .enter()
        .append('circle')
        .attr('style', classes.circle)
        .each((d, i, n) => {
          const element = n[i];
          new OpenSeaDragon.MouseTracker({
            element,
            pressHandler: () => handleFocus(element),
            dragHandler: (e) => handleDrag(element, e),
            dragEndHandler: () => handleDragEnd(element),
          }).setTracking(true);
        })
        .merge(circles)
        .attr('id', (d) => d.id)
        .attr('cx', (d) => d.vx)
        .attr('cy', (d) => d.vy)
        .attr('r', (d) => d.vr)
        .style('stroke-width', strokeWidth);
      circles.exit().remove();
    };

    const renderLines = (type: OperationType, group: SVGGElement, operations: LineOperation[]) => {
      const g = d3.select(group);
      const data = operations.map<PolylineData>((o, i) => ({
        ...o,
        id: `line-${o.id}`,
        operationId: o.id,
        circles: o.points.map((p, j) => ({
          ...p,
          ...imageToViewportCircle(p),
          lineId: `line-${o.id}`,
          id: `point-${o.id}-${j}`,
          type,
          indices: [i, j],
        })),
      }));

      const circles = g
        .selectAll<SVGCircleElement, CircleData[]>('circle')
        .data(data.flatMap((d: PolylineData) => d.circles));
      circles
        .enter()
        .append('circle')
        .each((d, i, n) => {
          const element = n[i];
          new OpenSeaDragon.MouseTracker({
            element,
            pressHandler: () => handleFocus(element),
            dragHandler: (e) => handleDrag(element, e),
            dragEndHandler: () => handleDragEnd(element),
          }).setTracking(true);
        })
        .merge(circles)
        .attr('id', (d) => d.id)
        .attr('cx', (d) => d.vx)
        .attr('cy', (d) => d.vy)
        .attr('r', (d) => d.vr)
        .attr('style', classes.circle)
        .attr('style', classes.line)
        .style('stroke-width', strokeWidth);
      circles.exit().remove();

      const polylines = g.selectAll<SVGPolylineElement, PolylineData[]>('polyline').data(data);
      polylines
        .enter()
        .append('polyline')
        .merge(polylines)
        .attr('id', (d) => d.id)
        .attr('points', (d) => d.circles.map((c) => [c.vx, c.vy]).join(','))
        .style('stroke-width', strokeWidth);
      polylines.exit().remove();
    };

    const renderAreas = (type: OperationType, group: SVGGElement, operations: AreaOperation[]) => {
      const g = d3.select(group);
      const data = operations.map<RectData>((o, i) => ({
        ...o,
        ...imageToViewportRect(o),
        id: `area-${o.id}`,
        operationId: o.id,
        circles: o.points.map((p, j) => ({
          ...p,
          ...imageToViewportCircle(p),
          areaId: `area-${o.id}`,
          id: `point-${o.id}-${j}`,
          type,
          indices: [i, j],
        })),
      }));
      const circles = g
        .selectAll<SVGCircleElement, CircleData[]>('circle')
        .data(data.flatMap((d: RectData) => d.circles));
      circles
        .enter()
        .append('circle')
        .each((d, i, n) => {
          const element = n[i];
          new OpenSeaDragon.MouseTracker({
            element,
            pressHandler: () => handleFocus(element),
            dragHandler: (e) => handleDrag(element, e),
            dragEndHandler: () => handleDragEnd(element),
          }).setTracking(true);
        })
        .merge(circles)
        .attr('id', (d) => d.id)
        .attr('cx', (d) => d.vx)
        .attr('cy', (d) => d.vy)
        .attr('r', (d) => d.vr)
        .attr('style', classes.circle)
        .attr('style', classes.area)
        .style('stroke-width', strokeWidth);
      circles.exit().remove();

      const rects = g.selectAll<SVGRectElement, RectData[]>('rect').data(data);
      rects
        .enter()
        .append('rect')
        .merge(rects)
        .attr('id', (d) => d.id)
        .attr('x', (d) => d.vx)
        .attr('y', (d) => d.vy)
        .attr('width', (d) => d.vw)
        .attr('height', (d) => d.vh)
        .style('stroke-width', strokeWidth);
      rects.exit().remove();
    };

    const render = (operations: OperationSet | undefined) => {
      if (operations?.points) {
        renderPoints(OperationType.Point, points, operations.points);
      }

      if (operations?.lines) {
        renderLines(OperationType.Line, lines, operations.lines);
      }

      if (operations?.areas) {
        renderAreas(OperationType.Area, areas, operations.areas);
      }
    };

    const handleRender = () => {
      render(props.operations);
    };

    render(props.operations);
    viewer.addHandler('open', handleRender);
    return () => {
      viewer.removeHandler('open', handleRender);
    };
  }, [props.viewer, points, lines, areas, props.operations, selectedOperation, dispatch]);

  return ReactDOM.createPortal(props.children, svg);
};

export default OperationsLayer;
