import { AxiosResponse } from 'axios';
import { Job } from '@src/models/Job';
import { PointOperation, LineOperation, AreaOperation } from '@src/models/Operation';
import { PointResult, LineResult, AreaResult } from '@src/models/Result';
import { client } from './client';

const calcPoint = (job: Job, operation: PointOperation): Promise<PointResult> => {
  const params = {
    x: Math.round(operation.x),
    y: Math.round(operation.y),
    radius: Math.round(operation.radius),
  };
  return client.post(`/jobs/${job.id}/point`, params).then((res: AxiosResponse) => ({
    id: operation.id,
    type: 'point',
    updatedAt: Date.now(),
    point: res.data.point,
  }));
};

const calcLine = (job: Job, operation: LineOperation): Promise<LineResult> => {
  const start = operation.points[0];
  const end = operation.points[1];
  const params = {
    start: { x: Math.round(start.x), y: Math.round(start.y) },
    end: { x: Math.round(end.x), y: Math.round(end.y) },
  };
  return client.post(`/jobs/${job.id}/line`, params).then((res: AxiosResponse) => ({
    id: operation.id,
    type: 'line',
    updatedAt: Date.now(),
    points: res.data.points,
  }));
};

const allTypes = ['r', 'g', 'b'];

const calcArea = (job: Job, operation: AreaOperation): Promise<AreaResult> => {
  const params = {
    x: Math.round(operation.x),
    y: Math.round(operation.y),
    width: Math.round(operation.width),
    height: Math.round(operation.height),
  };
  const requests = allTypes.map((type) => {
    return client
      .post(`/jobs/${job.id}/area`, { ...params, type })
      .then((res) => client.get(res.data.data_url))
      .then((res) => res.data.split('\n').map((line: string) => line.split(',').map((d) => 0 + d)));
  });

  return Promise.all(requests).then((data: number[][][]) => ({
    id: operation.id,
    type: 'area',
    updatedAt: Date.now(),
    ...params,
    datum: data.map((d, i) => ({
      label: allTypes[i],
      data: d,
    })),
  }));
};

export default {
  calcPoint,
  calcLine,
  calcArea,
};
