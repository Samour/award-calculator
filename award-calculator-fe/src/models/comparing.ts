export const comparingField = <T>(comparator: (a: T, b: T) => number) =>
  <S>(selector: (source: S) => T): ((a: S, b: S) => number) => {
    return (a, b) => comparator(selector(a), selector(b));
  };
