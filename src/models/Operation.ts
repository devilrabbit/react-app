export enum OperationType {
  None,
  Point,
  Line,
  Area,
}

export interface Operation {
  id: string;
  updatedAt: number;
}

export interface Point {
  x: number;
  y: number;
  radius: number;
}

export interface PointOperation extends Point, Operation {}

export interface LineOperation extends Operation {
  points: Point[];
  length: number;
}

export interface AreaOperation extends Operation {
  points: Point[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OperationConfig {
  pointSize: number;
}

export interface OperationSet {
  id: string;
  updatedAt: number;
  operationType: OperationType;
  points: PointOperation[];
  lines: LineOperation[];
  areas: AreaOperation[];
  config: OperationConfig;
}

export function createOperationSet(id: string): OperationSet {
  return {
    id,
    updatedAt: Date.now(),
    operationType: OperationType.None,
    points: [],
    lines: [],
    areas: [],
    config: {
      pointSize: 10,
    },
  };
}
