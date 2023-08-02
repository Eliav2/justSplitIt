export const sumArray = (arr: number[]) => {
  return arr.reduce((sum, val) => sum + val, 0);
};

export const round = (num: number) => {
  return Math.round(num * 100) / 100;
};
