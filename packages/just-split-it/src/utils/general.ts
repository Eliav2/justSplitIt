export const splitByCondition = <T>(arr: T[], condition: (arg: T) => boolean): [T[], T[]] => {
  return [arr.filter(condition), arr.filter((item) => !condition(item))];
};
