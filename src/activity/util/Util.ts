export const wait = (time: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, time);
    });
  };