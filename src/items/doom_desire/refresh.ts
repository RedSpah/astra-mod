import { getPlayers } from "isaacscript-common";

import { CollectibleCustom } from "../../enums/Collectibles";
import { PlayerTypeCustom } from "../../enums/PlayerTypes";
import { getOrDefault } from "../../helpers";
import { DoomDesireData, saved } from "./variables";

export function DoomDesireRefresh(): void {
  for (const player of getPlayers()) {
    if (player.HasCollectible(CollectibleCustom.DOOM_DESIRE) || player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
      const playerHash = GetPtrHash(player);
      const dd = getOrDefault(saved.run.conf, playerHash, DoomDesireData);
      dd.CD = 0;
      dd.CoolingDown = false;
      dd.InUse = false;
      dd.CrackDuration = 0;
    }
  }
}
