import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";

import { ConfusionCharge } from "./confusion/charge";
import { ConfusionRender } from "./confusion/render";
import { ConfusionTearSlowdown } from "./confusion/tearSlowdown";
import { ConfusionData, saved } from "./confusion/variables";

export function confusionInit(): void {
  mod.saveDataManager("astra.confusion", saved);
  mod.saveDataManagerRegisterClass(ConfusionData);
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, ConfusionCharge);
  mod.AddCallback(ModCallback.POST_PLAYER_RENDER, ConfusionRender);
  mod.AddCallback(ModCallback.EVALUATE_CACHE, ConfusionTearSlowdown, CacheFlag.FIRE_DELAY);
}
