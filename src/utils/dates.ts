export const forEachYearBetween = (from: Date, to: Date, callback: (from: Date, to: Date) => void): void => {
  const current = new Date(to);
  const oneYearBefore = new Date(to);
  oneYearBefore.setMonth(oneYearBefore.getMonth() - 12);

  while (current.getTime() > from.getTime()) {
    if (oneYearBefore.getTime() < from.getTime()) oneYearBefore.setTime(from.getTime());
    callback(oneYearBefore, current);
    current.setMonth(current.getMonth() - 12);
    oneYearBefore.setMonth(oneYearBefore.getMonth() - 12);
  }
};

export const asyncForEachYearBetween = async (from: Date, to: Date, callback: (from: Date, to: Date) => Promise<void>): Promise<void> => {
  const promises = [];

  forEachYearBetween(from, to, (from, to) => {
    promises.push(callback(from, to));
  });
  await Promise.all(promises);
};
