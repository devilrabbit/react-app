export const toBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const data = reader.result as string;
        const index = data.indexOf('base64,');
        if (index < 0) {
          reject(new Error('failed to read.'));
        } else {
          resolve(data.substring(index + 7));
        }
      },
      false,
    );
    reader.addEventListener(
      'error',
      (error) => {
        reject(error);
      },
      false,
    );
    reader.readAsDataURL(file);
  });
};
