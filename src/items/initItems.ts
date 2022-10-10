import { ModUpgraded } from "isaacscript-common";
import { blinkInit } from "./blink";
import { confusionInit } from "./confusion";
import { doomDesireInit } from "./doom_desire";
import { frustrationInit } from "./frustration";

export function initItems(mod: ModUpgraded): void {
  confusionInit(mod);
  blinkInit(mod);
  frustrationInit(mod);
  doomDesireInit(mod);
}
