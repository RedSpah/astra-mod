export function getOrDefault<T, K, P>(map: Map<K, T>, key: K, proxy: new (_: any | undefined) => T, param: P | undefined = undefined): T {
  let ret = map.get(key);
  if (ret === undefined) {
    ret = new proxy(param);
    map.set(key, ret);
  }
  return ret;
}
