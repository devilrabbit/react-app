import { OperationSet } from './Operation';
import { ResultSet } from './Result';

export type Job = {
  id: string;
  name: string;
  image: string;
  operations: OperationSet;
  results: ResultSet;
};
