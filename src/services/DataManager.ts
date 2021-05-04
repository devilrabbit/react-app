const datum: { [name: string]: number[][] } = {};

const get = (id: string): number[][] => {
  return datum[id];
};

const put = (id: string, data: number[][]): void => {
  datum[id] = data;
};

const remove = (id: string): void => {
  if (id in datum) {
    delete datum[id];
  }
};

const removeWith = (prefix: string): void => {
  for (const key in datum) {
    if (key.startsWith(prefix)) {
      delete datum[key];
    }
  }
};

export default {
  get,
  put,
  remove,
  removeWith,
};
