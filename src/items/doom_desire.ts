import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";

import { DoomDesireProcess } from "./doom_desire/process";
import { DoomDesire60FPSProcess } from "./doom_desire/process60";
import { DoomDesireRefresh } from "./doom_desire/refresh";
import { DoomDesireRender } from "./doom_desire/render";
import { DoomDesireData, saved } from "./doom_desire/variables";

export function doomDesireInit(): void {
  mod.saveDataManager("astra.doom_desire", saved);
  mod.saveDataManagerRegisterClass(DoomDesireData);
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, DoomDesireProcess);
  mod.AddCallback(ModCallback.POST_RENDER, DoomDesire60FPSProcess);
  mod.AddCallback(ModCallback.POST_PLAYER_RENDER, DoomDesireRender);
  mod.AddCallback(ModCallback.POST_NEW_ROOM, DoomDesireRefresh);
}
