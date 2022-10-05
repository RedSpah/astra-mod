import { ModUpgraded } from "isaacscript-common";
import { blinkInit } from "./blink";
import { confusionInit } from "./confusion";
import { frustrationInit } from "./frustration";

export function initItems(mod: ModUpgraded, modVanilla: Mod): void {
  confusionInit(mod, modVanilla);
  blinkInit(mod, modVanilla);
  frustrationInit(mod, modVanilla);
}
