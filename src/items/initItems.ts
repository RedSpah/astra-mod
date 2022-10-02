import { ModUpgraded } from "isaacscript-common";
import { confusionInit } from "./confusion";

export function initItems(mod: ModUpgraded, modVanilla: Mod): void {
  confusionInit(mod, modVanilla);
}
