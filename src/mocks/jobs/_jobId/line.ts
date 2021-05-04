import { MockMethods, MockResponse } from 'axios-mock-server';

const lerp_x = (x0: number, y0: number, x1: number, y1: number, x: number) => {
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
};

const lerp_y = (x0: number, y0: number, x1: number, y1: number, y: number) => {
  return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
};

const methods: MockMethods = {
  post({ data }) {
    console.log('/line');
    const start = data.start;
    const end = data.end;
    const points = [];
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    if (w > h) {
      const sign = Math.sign(end.x - start.x);
      for (let i = 0; i < w; i++) {
        const x = start.x + sign * i;
        const y = lerp_x(start.x, start.y, end.x, end.y, x);
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        points.push({ x, y, r, g, b });
      }
    } else {
      const sign = Math.sign(end.y - start.y);
      for (let i = 0; i < h; i++) {
        const y = start.y + sign * i;
        const x = lerp_y(start.x, start.y, end.x, end.y, y);
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        points.push({ x, y, r, g, b });
      }
    }

    return [200, { points }] as MockResponse;
  },
};

export default methods;
