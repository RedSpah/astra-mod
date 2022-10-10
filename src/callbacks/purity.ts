import { ActiveSlot, CacheFlag, CollectibleType, EntityType, ModCallback, RoomType, SoundEffect } from "isaac-typescript-definitions";
import { addFlag, getPlayerCollectibleCount, getPlayers, ModCallbackCustom, ModUpgraded, PickingUpItem, saveDataManager, saveDataManagerRegisterClass } from "isaacscript-common";
import { AstraStats } from "../enums/AstraStats";
import { Collectibles } from "../enums/Collectibles";
import { Costumes } from "../enums/Costumes";
import { PlayerTypes } from "../enums/PlayerTypes";
import { getOrDefault } from "../helpers";

const Constants = {
  EvilItemDamageMul: 0.9,
  PurityBrokenDamageMul: 0.6666,
  EvilItemColorDecrement: Color(0.1, 0.1, 0.1, 0, 0.01, 0.01, 0.01)
} as const;

const EvilItemsList = [
  CollectibleType.ABADDON,
  CollectibleType.BLACK_CANDLE,
  CollectibleType.CEREMONIAL_ROBES,
  CollectibleType.GOAT_HEAD,
  CollectibleType.FALSE_PHD,
  CollectibleType.MATCH_BOOK,
  CollectibleType.MISSING_PAGE_2,
  CollectibleType.SAFETY_PIN
];

export class PurityData {
  EvilItems = 0;
  PurityBroken = false;
  PurityBrokenQueued = false;
  DevilRoom = false;
  AngelRoom = false;
  Planetarium = false;
}

export const saved = {
  run: {
    purity: new Map<PtrHash, PurityData>()
  }
};

export function purityInit(mod: ModUpgraded): void {
  saveDataManager("astra.purity", saved);
  saveDataManagerRegisterClass(PurityData);
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_EARLY, PurityNewRoom);
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, PurityNewItem);
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, PurityDevilDeal);
  mod.AddCallback(ModCallback.EVALUATE_CACHE, PurityEvaluateCache, addFlag(CacheFlag.DAMAGE, CacheFlag.TEAR_COLOR));
}

function PurityEvaluateCache(player: EntityPlayer, cacheFlag: CacheFlag) {
  if (player.GetPlayerType() === PlayerTypes.ASTRA) {
    const playerHash = GetPtrHash(player);

    const purity = getOrDefault(saved.run.purity, playerHash, PurityData);

    const C = AstraStats.TEAR_COLOR;
    const E = Constants.EvilItemColorDecrement;

    switch (cacheFlag) {
      case CacheFlag.DAMAGE:
        player.Damage *= Constants.EvilItemDamageMul ** purity.EvilItems;
        if (purity.PurityBroken) {
          player.Damage *= Constants.PurityBrokenDamageMul;
        }
        break;
      case CacheFlag.TEAR_COLOR:
        if (!purity.PurityBroken) {
          player.TearColor = Color(
            math.max(0, C.R - E.R * purity.EvilItems),
            math.max(0, C.G - E.G * purity.EvilItems),
            math.max(0, C.B - E.B * purity.EvilItems),
            math.max(0, C.A - E.A * purity.EvilItems),
            math.max(0, C.RO - E.RO * purity.EvilItems),
            math.max(0, C.GO - E.GO * purity.EvilItems),
            math.max(0, C.BO - E.BO * purity.EvilItems)
          );
        } else {
          player.TearColor = AstraStats.DEVIL_TEAR_COLOR;
        }

        break;
    }
  }
}

function PurityNewItem(player: EntityPlayer, _: PickingUpItem) {
  if (player.GetPlayerType() === PlayerTypes.ASTRA) {
    const playerHash = GetPtrHash(player);

    const purity = getOrDefault(saved.run.purity, playerHash, PurityData);

    purity.EvilItems = getPlayerCollectibleCount(player, ...EvilItemsList);

    if (purity.PurityBrokenQueued) {
      purity.PurityBrokenQueued = false;
      player.RemoveCollectible(Collectibles.CONFUSION);
      player.SetPocketActiveItem(Collectibles.FRUSTRATION, ActiveSlot.POCKET, false);
      player.AddNullCostume(Costumes.ASTRA_DEVIL);
      player.TryRemoveNullCostume(Costumes.ASTRA_CRY);
    }

    player.AddCacheFlags(CacheFlag.DAMAGE);
    player.EvaluateItems();
    player.AddCacheFlags(CacheFlag.TEAR_COLOR);
    player.EvaluateItems();
  }
}

function PurityNewRoom() {
  for (const player of getPlayers()) {
    if (player.GetPlayerType() === PlayerTypes.ASTRA) {
      const playerHash = GetPtrHash(player);

      const purity = getOrDefault(saved.run.purity, playerHash, PurityData);

      if (!purity.PurityBroken) {
        const DevilRoomNow = Game().GetLevel().GetCurrentRoom().GetType() === RoomType.DEVIL;
        const AngelRoomNow = Game().GetLevel().GetCurrentRoom().GetType() === RoomType.ANGEL;
        const PlanetariumNow = Game().GetLevel().GetCurrentRoom().GetType() === RoomType.PLANETARIUM;

        if (DevilRoomNow && !purity.DevilRoom) {
          player.AddNullCostume(Costumes.ASTRA_CRY);
        }

        if (!DevilRoomNow && purity.DevilRoom) {
          player.TryRemoveNullCostume(Costumes.ASTRA_CRY);
        }

        if (AngelRoomNow && !purity.AngelRoom) {
          player.AddNullCostume(Costumes.ASTRA_HAPPY);
        }

        if (!AngelRoomNow && purity.AngelRoom) {
          player.TryRemoveNullCostume(Costumes.ASTRA_HAPPY);
        }

        if (PlanetariumNow && !purity.Planetarium) {
          player.AddNullCostume(Costumes.ASTRA_PLANETARIUM);
        }

        if (!PlanetariumNow && purity.Planetarium) {
          player.TryRemoveNullCostume(Costumes.ASTRA_PLANETARIUM);
        }

        purity.DevilRoom = DevilRoomNow;
        purity.AngelRoom = AngelRoomNow;
        purity.Planetarium = PlanetariumNow;
      }
    }
  }
}

function PurityDevilDeal(pickup: EntityPickup, collider: Entity, _: boolean) {
  if (collider.Type === EntityType.PLAYER && collider.ToPlayer()?.GetPlayerType() === PlayerTypes.ASTRA && pickup.IsShopItem()) {
    const player = collider.ToPlayer();
    if (player !== undefined) {
      const playerHash = GetPtrHash(player);

      const purity = getOrDefault(saved.run.purity, playerHash, PurityData);

      if (!purity.PurityBroken) {
        purity.PurityBroken = true;
        purity.PurityBrokenQueued = true;

        SFXManager().Play(SoundEffect.DEVIL_CARD);
      }
    }
  }

  return undefined;
}
