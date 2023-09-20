export const splitByCondition = <T>(arr: T[], condition: (arg: T) => boolean): [T[], T[]] => {
  return [arr.filter(condition), arr.filter((item) => !condition(item))];
};

export const removeUndefined = <T extends {}>(obj: T) => {
  const _obj = { ...obj };
  //remove undefined props
  Object.keys(_obj).forEach((key) => (obj as any)[key] === undefined && delete (obj as any)[key]);
  return _obj;
};
