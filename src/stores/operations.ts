import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UUID } from '@src/utils/uuid';
import {
  OperationType,
  Point,
  PointOperation,
  LineOperation,
  AreaOperation,
  OperationConfig,
  OperationSet,
  Operation,
  createOperationSet,
} from '@src/models/Operation';

export interface UpdateOperationArgs {
  indices: number[];
  point: Point;
}

export interface RemoveOperationArgs {
  index: number;
}

interface OperationsState {
  operations?: OperationSet;
  selectedOperation?: Operation;
}

const initialState: OperationsState = {};

const distance = (p0: Point, p1: Point) => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const addToLines = (lines: LineOperation[], pt: Point) => {
  const updatedAt = Date.now();
  const count = lines.length;
  if (count === 0) {
    return [{ id: UUID.generate(), updatedAt, points: [pt], length: 0 }];
  }
  const line = lines[count - 1];
  if (line.points.length === 1) {
    const newLine = {
      ...line,
      updatedAt,
      points: [...line.points, pt],
      length: distance(line.points[0], pt),
    };
    return count === 1 ? [newLine] : [...lines.slice(0, count - 1), newLine];
  }
  return [...lines, { id: UUID.generate(), updatedAt, points: [pt], length: 0 }];
};

const addToAreas = (areas: AreaOperation[], pt: Point) => {
  const updatedAt = Date.now();
  const count = areas.length;
  if (count === 0) {
    return [
      { id: UUID.generate(), updatedAt, points: [pt], x: pt.x, y: pt.y, width: 0, height: 0 },
    ];
  }
  const area = areas[count - 1];
  if (area.points.length === 1) {
    const newArea = {
      ...area,
      updatedAt,
      points: [...area.points, pt],
    };
    newArea.x = Math.min(newArea.points[0].x, newArea.points[1].x);
    newArea.y = Math.min(newArea.points[0].y, newArea.points[1].y);
    newArea.width = Math.abs(newArea.points[1].x - newArea.points[0].x);
    newArea.height = Math.abs(newArea.points[1].y - newArea.points[0].y);
    return count === 1 ? [newArea] : [...areas.slice(0, count - 1), newArea];
  }
  return [
    ...areas,
    { id: UUID.generate(), updatedAt, points: [pt], x: pt.x, y: pt.y, width: 0, height: 0 },
  ];
};

const updatePoints = (points: PointOperation[], idxs: number[], point: Point) => {
  const updatedAt = Date.now();
  return points.map((p, i) => {
    return i === idxs[0] ? { ...p, ...point, updatedAt } : p;
  });
};

const updateLines = (lines: LineOperation[], idxs: number[], point: Point) => {
  const updatedAt = Date.now();
  return lines.map((line, i) => {
    if (i !== idxs[0]) {
      return line;
    }
    const newLine = {
      ...line,
      updatedAt,
      points: line.points.map((p, j) => (j === idxs[1] ? point : p)),
    };
    newLine.length = distance(newLine.points[0], newLine.points[1]);
    return newLine;
  });
};

const updateAreas = (areas: AreaOperation[], idxs: number[], point: Point) => {
  const updatedAt = Date.now();
  return areas.map((area, i) => {
    if (i !== idxs[0]) {
      return area;
    }
    const newArea = {
      ...area,
      updatedAt,
      points: area.points.map((p, j) => (j === idxs[1] ? point : p)),
    };

    if (newArea.points.length > 1) {
      newArea.x = Math.min(newArea.points[0].x, newArea.points[1].x);
      newArea.y = Math.min(newArea.points[0].y, newArea.points[1].y);
      newArea.width = Math.abs(newArea.points[1].x - newArea.points[0].x);
      newArea.height = Math.abs(newArea.points[1].y - newArea.points[0].y);
    } else if (newArea.points.length === 1) {
      newArea.x = point.x;
      newArea.y = point.y;
    }

    return newArea;
  });
};

const updateState = (
  state: OperationsState,
  operations: OperationSet,
  patch: Partial<OperationSet>,
) => {
  const updatedAt = Date.now();
  return {
    ...state,
    operations: { ...operations, ...patch, updatedAt },
  };
};

const slice = createSlice({
  name: 'operation',
  initialState,
  reducers: {
    setOperations: (state, action: PayloadAction<OperationSet | undefined>) => {
      const operations = action.payload;
      return {
        ...state,
        operations: operations,
      };
    },
    selectOperation: (state, action: PayloadAction<string>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }

      const id = action.payload;
      let selected: Operation | undefined;

      selected = operations.points.find((o) => o.id === id);
      if (!selected) {
        selected = operations.lines.find((o) => o.id === id);
      }
      if (!selected) {
        selected = operations.areas.find((o) => o.id === id);
      }

      if (!selected) {
        return state;
      }

      return {
        ...state,
        selectedOperation: selected,
      };
    },
    clearOperations: (state) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, createOperationSet(operations.id));
    },
    setOperationType: (state, action: PayloadAction<OperationType>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, { operationType: action.payload });
    },
    setConfig: (state, action: PayloadAction<OperationConfig>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, { config: action.payload });
    },
    addPoint: (state, action: PayloadAction<Point>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      const id = UUID.generate();
      const updatedAt = Date.now();
      return updateState(state, operations, {
        points: [...operations.points, { ...action.payload, id, updatedAt }],
      });
    },
    addLinePoint: (state, action: PayloadAction<Point>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        lines: addToLines(operations.lines, action.payload),
      });
    },
    addAreaPoint: (state, action: PayloadAction<Point>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        areas: addToAreas(operations.areas, action.payload),
      });
    },
    updatePoint: (state, action: PayloadAction<UpdateOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        points: updatePoints(operations.points, action.payload.indices, action.payload.point),
      });
    },
    updateLinePoint: (state, action: PayloadAction<UpdateOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        lines: updateLines(operations.lines, action.payload.indices, action.payload.point),
      });
    },
    updateAreaPoint: (state, action: PayloadAction<UpdateOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        areas: updateAreas(operations.areas, action.payload.indices, action.payload.point),
      });
    },
    removePoint: (state, action: PayloadAction<RemoveOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        points: operations.points.filter((_, i) => i !== action.payload.index),
      });
    },
    removeLine: (state, action: PayloadAction<RemoveOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        lines: operations.lines.filter((_, i) => i !== action.payload.index),
      });
    },
    removeArea: (state, action: PayloadAction<RemoveOperationArgs>) => {
      const operations = state.operations;
      if (!operations) {
        return state;
      }
      return updateState(state, operations, {
        areas: operations.areas.filter((_, i) => i !== action.payload.index),
      });
    },
  },
});

export default slice.reducer;
export const {
  setOperations,
  selectOperation,
  clearOperations,
  setOperationType,
  setConfig,
  addPoint,
  addLinePoint,
  addAreaPoint,
  updatePoint,
  updateLinePoint,
  updateAreaPoint,
  removePoint,
  removeLine,
  removeArea,
} = slice.actions;
