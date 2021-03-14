export const toDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const data = reader.result as string;
        resolve(data);
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
