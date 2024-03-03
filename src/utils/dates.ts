export const forEachYearBetween = (
  from: Date,
  to: Date,
  callback: (from: Date, to: Date) => void,
): void => {
  const current = new Date(to);
  const oneYearBefore = new Date(to);
  oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);

  while (current.getTime() > from.getTime()) {
    if (oneYearBefore.getTime() < from.getTime())
      oneYearBefore.setTime(from.getTime());
    callback(oneYearBefore, current);
    current.setFullYear(current.getFullYear() - 1);
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);
  }
};

export const asyncForEachYearBetween = async (
  from: Date,
  to: Date,
  callback: (from: Date, to: Date) => Promise<void>,
): Promise<void> => {
  const promises = [];

  forEachYearBetween(from, to, (from, to) => {
    promises.push(callback(from, to));
  });
  await Promise.all(promises);
};
