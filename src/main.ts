import { getRandomSeed, printConsole } from "isaacscript-common";
import { initCallbacks } from "./callbacks/initPlayer";
import { initItems } from "./items/initItems";
import { modRNG, MOD_VER } from "./mod";
import { initOtherMods } from "./other_mods";

export function main(): void {
  modRNG.SetSeed(getRandomSeed(), 35);
  initOtherMods();
  initCallbacks();
  initItems();

  printConsole(`Astra Mod v${MOD_VER} Loaded.`);
}
