import { evaluateCacheInit } from "./callbacks/evaluateCache";
import { initPlayerInit } from "./callbacks/initPlayer";
import { initItems } from "./items/initItems";

export function main(): void {
  registerCallbacks();
}

function registerCallbacks() {
  initPlayerInit();
  evaluateCacheInit();
  initItems();
}
