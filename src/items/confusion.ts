import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded, saveDataManager } from "isaacscript-common";

import { ConfusionCharge } from "./confusion/charge";
import { ConfusionRender } from "./confusion/render";
import { ConfusionTearSlowdown } from "./confusion/tearSlowdown";
import { saved } from "./confusion/variables";

export function confusionInit(_: ModUpgraded, modVanilla: Mod): void {
  saveDataManager("astra.confusion", saved);
  modVanilla.AddCallback(ModCallback.POST_PEFFECT_UPDATE, ConfusionCharge);
  modVanilla.AddCallback(ModCallback.POST_PLAYER_RENDER, ConfusionRender);
  modVanilla.AddCallback(
    ModCallback.EVALUATE_CACHE,
    ConfusionTearSlowdown,
    CacheFlag.FIRE_DELAY,
  );
}
