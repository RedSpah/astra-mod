import { CollectibleType, EffectVariant, EntityType, ModCallback, PickupVariant, RoomType } from "isaac-typescript-definitions";
import { getPlayers, spawn } from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/PlayerTypes";
import { mod } from "../mod";

export function impurityInit(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, ImpurityRoom);
}

function ImpurityRoom() {
  if (Game().GetLevel().GetCurrentRoom().GetType() === RoomType.ANGEL) {
    for (const player of getPlayers()) {
      if (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
        if (!player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
          const Angels = Isaac.FindByType(EntityType.EFFECT, EffectVariant.ANGEL);

          for (const Angel of Angels) {
            Isaac.Explode(Angel.Position, player, 1);
          }

          const Items = Isaac.FindByType(EntityType.PICKUP);

          for (const Item of Items) {
            if (!(Item.Variant === (PickupVariant.COLLECTIBLE as number) && (Item.SubType === (CollectibleType.KEY_PIECE_1 as number) || Item.SubType === (CollectibleType.KEY_PIECE_2 as number)))) {
              spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, Item.Position);
              Item.Remove();
            }
          }
        }
      }
    }
  }
}
