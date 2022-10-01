import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { PlayerTypes } from "../enums/PlayerTypes";
import { evaluateCacheAstra } from "./evaluateCache/astra";
import { evaluateCacheAstraB } from "./evaluateCache/astra_b";

export function evaluateCacheInit(_: ModUpgraded, modVanilla: Mod): void {
  modVanilla.AddCallback(ModCallback.EVALUATE_CACHE, evaluateCachePlayers);
}

function evaluateCachePlayers(player: EntityPlayer, cacheFlag: CacheFlag) {
  switch (player.GetPlayerType()) {
    case PlayerTypes.ASTRA:
      evaluateCacheAstra(player, cacheFlag);
      break;
    case PlayerTypes.ASTRA_B:
      evaluateCacheAstraB(player, cacheFlag);
      break;
    default:
      break;
  }
}
