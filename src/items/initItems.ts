import { blinkInit } from "./blink";
import { confusionInit } from "./confusion";
import { doomDesireInit } from "./doom_desire";
import { frustrationInit } from "./frustration";

export function initItems(): void {
  confusionInit();
  blinkInit();
  frustrationInit();
  doomDesireInit();
}
