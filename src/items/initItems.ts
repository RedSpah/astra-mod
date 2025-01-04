import { blinkInit } from "./blink";
import { confusionInit } from "./confusion";
import { doomDesireInit } from "./doom_desire";
import { frustrationInit } from "./frustration";
import { psiPersuasionInit } from "./psionic_persuation";

export function initItems(): void {
  confusionInit();
  blinkInit();
  frustrationInit();
  doomDesireInit();
  psiPersuasionInit();
}
