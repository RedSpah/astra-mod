export function getOrDefault<T, K>(map: Map<K, T>, key: K, __type: new () => T): T {
  let ret = map.get(key);
  if (ret === undefined) {
    ret = new __type();
    map.set(key, ret);
  }
  return ret;
}
