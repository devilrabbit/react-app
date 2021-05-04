import React, { useRef, useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as d3 from 'd3';
import { AreaResult } from '@src/models/Result';
import DataManager from '@src/services/DataManager';

interface AreaResultProps {
  result?: AreaResult;
}

const allKinds = [
  {
    label: 'R',
    type: 'r',
  },
  {
    label: 'G',
    type: 'g',
  },
  {
    label: 'B',
    type: 'b',
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      paddingBottom: theme.spacing(1),
    },
    canvas: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxHeight: 200,
    },
  }),
);

const AreaResultPanel: React.FC<AreaResultProps> = (props: AreaResultProps) => {
  const classes = useStyles();

  const canvas = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [selectedType, setSelectedType] = useState(allKinds[0].type);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedType(event.target.value as string);
  };

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const canvasContext = canvas.current.getContext('2d');
    setContext(canvasContext);
  }, [canvas.current]);

  useEffect(() => {
    if (!props.result || !canvas.current || !context) {
      return;
    }

    context.clearRect(0, 0, 10000, 10000);

    const result = props.result;
    const width = result.width;
    const height = result.height;
    canvas.current.width = width;
    canvas.current.height = height;

    const dataId = result.datum.find((d) => d.label === selectedType)?.dataId;
    if (!dataId) {
      return;
    }
    const data = DataManager.get(dataId);
    if (!data) {
      return;
    }

    const color = d3
      .scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain([d3.min(data, (r) => d3.min(r) || 0) || 0, d3.max(data, (r) => d3.max(r) || 0) || 0]);

    const imageData = context.createImageData(width, height);
    const rawData = imageData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = d3.color(color(data[y][x]))?.rgb() as d3.RGBColor;
        rawData[(y * width + x) * 4] = value.r;
        rawData[(y * width + x) * 4 + 1] = value.g;
        rawData[(y * width + x) * 4 + 2] = value.b;
        rawData[(y * width + x) * 4 + 3] = 255;
      }
    }

    context.putImageData(imageData, 0, 0);
  }, [props.result, canvas.current, context, selectedType]);

  return (
    <Box width="100%">
      <Box className={classes.heading}>
        <Select value={selectedType} onChange={handleChange}>
          {allKinds.map((kind) => (
            <MenuItem key={`kind-${kind.type}`} value={kind.type}>
              {kind.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box width="100%">
        <canvas className={classes.canvas} ref={canvas}></canvas>
      </Box>
    </Box>
  );
};

export default AreaResultPanel;
