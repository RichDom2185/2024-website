const keys = <T extends string | number | symbol>(obj: Record<T, any>): T[] => {
  return Object.keys(obj) as T[];
};

const values = <T>(obj: Record<any, T>) => {
  return Object.values(obj) as T[];
};

const entries = <K extends string | number | symbol, V>(
  obj: Record<K, V>
): [K, V][] => {
  return Object.entries(obj) as [K, V][];
};

/**
 * Type-safe wrappers around some `Object` methods
 */
export const _Object = {
  /** Type-safe `Object.keys` */
  keys,
  /** Type-safe `Object.values` */
  values,
  /** Type-safe `Object.entries` */
  entries,
};
