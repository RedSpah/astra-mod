import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded, saveDataManager, saveDataManagerRegisterClass } from "isaacscript-common";

import { DoomDesireProcess } from "./doom_desire/process";
import { DoomDesire60FPSProcess } from "./doom_desire/process60";
import { DoomDesireRefresh } from "./doom_desire/refresh";
import { DoomDesireRender } from "./doom_desire/render";
import { DoomDesireData, saved } from "./doom_desire/variables";

export function doomDesireInit(_: ModUpgraded, modVanilla: Mod): void {
  saveDataManager("astra.doom_desire", saved);
  saveDataManagerRegisterClass(DoomDesireData);
  modVanilla.AddCallback(ModCallback.POST_PEFFECT_UPDATE, DoomDesireProcess);
  modVanilla.AddCallback(ModCallback.POST_RENDER, DoomDesire60FPSProcess);
  modVanilla.AddCallback(ModCallback.POST_PLAYER_RENDER, DoomDesireRender);
  modVanilla.AddCallback(ModCallback.POST_NEW_ROOM, DoomDesireRefresh);
}
