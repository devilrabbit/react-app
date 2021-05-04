import { MockMethods, MockResponse } from 'axios-mock-server';

const methods: MockMethods = {
  post({ data }) {
    console.log('/area');
    const url = `/csv?w=${data.width}&h=${data.height}`;
    return [
      200,
      {
        data_url: url,
      },
    ] as MockResponse;
  },
};

export default methods;
