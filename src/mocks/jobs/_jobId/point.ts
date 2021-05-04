import { MockMethods, MockResponse } from 'axios-mock-server';

const methods: MockMethods = {
  post({ data }) {
    console.log('/point');
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return [
      200,
      {
        point: { ...data, r, g, b },
      },
    ] as MockResponse;
  },
};

export default methods;
