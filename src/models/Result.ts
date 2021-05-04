export interface Result {
  id: string;
  type: string;
  updatedAt: number;
}

export interface DataDefined {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
}

export type Data = Partial<DataDefined>;

export interface PointResult extends Result {
  point: Data;
}

export interface LineResult extends Result {
  points: DataDefined[];
}

export interface AreaResult extends Result {
  width: number;
  height: number;
  datum: { label: string; dataId?: string; data?: number[][] }[];
}

export interface ResultSet {
  id: string;
  updatedAt: number;
  points: PointResult[];
  lines: LineResult[];
  areas: AreaResult[];
}

export function createResultSet(id: string): ResultSet {
  return {
    id,
    updatedAt: Date.now(),
    points: [],
    lines: [],
    areas: [],
  };
}
