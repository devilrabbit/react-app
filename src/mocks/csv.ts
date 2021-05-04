import { MockMethods, MockResponse } from 'axios-mock-server';

const methods: MockMethods = {
  get({ params }) {
    console.log('/csv');
    const width = 0 + params['w'];
    const height = 0 + params['h'];
    const csvString = new Array(height)
      .fill(null)
      .map(() => {
        return new Array(width)
          .fill(null)
          .map(() => Math.random())
          .join(',');
      })
      .join('\n');
    return [200, csvString] as MockResponse;
  },
};

export default methods;
