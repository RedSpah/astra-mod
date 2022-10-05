import { CacheFlag } from "isaac-typescript-definitions";
import { Collectibles } from "../../enums/Collectibles";
import { getOrDefault } from "../../helpers";
import { ConfusionConstants as Constants } from "./Constants";
import { ConfusionData, saved } from "./variables";

export function ConfusionTearSlowdown(player: EntityPlayer, cacheFlag: CacheFlag): void {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    // Variable setup
    const conf = getOrDefault(saved.run.conf, playerHash, ConfusionData);

    // Slowdown
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay *= math.max(1, conf.ChargeProgress * Constants.MaxFireDelaySlowdown);
    }
  }
}
