import { HeartSubType, ModCallback, PickupVariant, PlayerVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/PlayerTypes";
import { getOrDefault } from "../helpers";
import { mod } from "../mod";

const HeartsToProcess = [HeartSubType.FULL, HeartSubType.BLACK, HeartSubType.BLENDED, HeartSubType.SCARED, HeartSubType.SOUL, HeartSubType.HALF_SOUL, HeartSubType.HALF, HeartSubType.DOUBLE_PACK];

export class HeartbrokenData {
  OldPrevRedHearts = 0;
  OldPrevSoulHearts = 0;
  PrevRedHearts = 0;
  PrevSoulHearts = 0;
  PrevBrokenHearts = 0;
  ArtificialBrokenHearts = 0;
  Clear = true;
}

export const saved = {
  run: {
    heartbroken: new Map<PtrHash, HeartbrokenData>()
  }
};

export function heartbrokenInit(): void {
  mod.saveDataManager("astra.heartbroken", saved);
  mod.saveDataManagerRegisterClass(HeartbrokenData);
  mod.AddCallback(ModCallback.POST_PLAYER_RENDER, HeartbrokenProcess, PlayerVariant.PLAYER);
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, HeartbrokenRunInit, PlayerVariant.PLAYER);
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, HeartbrokenPickup, PickupVariant.HEART);
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, HeartbrokenPrePickup, PickupVariant.HEART);
}

function HeartbrokenRunInit(player: EntityPlayer) {
  if (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
    const playerHash = GetPtrHash(player);
    const hb = getOrDefault(saved.run.heartbroken, playerHash, HeartbrokenData);
    hb.PrevRedHearts = player.GetHearts();
    hb.PrevSoulHearts = player.GetSoulHearts();
    hb.OldPrevRedHearts = player.GetHearts();
    hb.OldPrevSoulHearts = player.GetSoulHearts();
    hb.ArtificialBrokenHearts = math.floor(player.GetMaxHearts() / 2);
    hb.PrevBrokenHearts = player.GetBrokenHearts();
    hb.Clear = true;
    if (hb.PrevBrokenHearts < hb.ArtificialBrokenHearts) {
      player.AddBrokenHearts(hb.ArtificialBrokenHearts - hb.PrevBrokenHearts);
      hb.PrevBrokenHearts = hb.ArtificialBrokenHearts;
    }
  }
}

function HeartbrokenProcess(player: EntityPlayer, _: Vector) {
  if (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
    const playerHash = GetPtrHash(player);
    const hb = getOrDefault(saved.run.heartbroken, playerHash, HeartbrokenData);
    if (hb.Clear) {
      const CurRedHearts = player.GetHearts();
      const CurSoulHearts = player.GetSoulHearts();
      const CurBrokenHearts = player.GetBrokenHearts();

      const PrevExtBrokenHearts = hb.PrevBrokenHearts - hb.ArtificialBrokenHearts;
      const NewExtBrokenHearts = PrevExtBrokenHearts + (CurBrokenHearts - hb.PrevBrokenHearts);

      if (hb.PrevRedHearts < CurRedHearts) {
        player.AddHearts(-math.ceil((CurRedHearts - hb.PrevRedHearts) / 2));
      }

      if (hb.PrevSoulHearts < CurSoulHearts) {
        player.AddSoulHearts(-math.ceil((CurSoulHearts - hb.PrevSoulHearts) / 2));
      }

      const NewArtificialBrokenHearts = math.floor(player.GetMaxHearts() / 2);

      player.AddBrokenHearts(NewExtBrokenHearts + NewArtificialBrokenHearts - CurBrokenHearts);

      hb.OldPrevRedHearts = hb.PrevRedHearts;
      hb.OldPrevSoulHearts = hb.PrevSoulHearts;
      hb.PrevRedHearts = player.GetHearts();
      hb.PrevSoulHearts = player.GetSoulHearts();
      hb.PrevBrokenHearts = player.GetBrokenHearts();
      hb.ArtificialBrokenHearts = NewArtificialBrokenHearts;
    }
  }
}

function HeartbrokenPickup(pickup: EntityPickup, player: EntityPlayer) {
  if (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
    const playerHash = GetPtrHash(player);
    const hb = getOrDefault(saved.run.heartbroken, playerHash, HeartbrokenData);

    const HPCapacity = player.GetMaxHearts() + player.GetBoneHearts() * 2;
    const HPLeft = HPCapacity - hb.PrevRedHearts;
    const SoulSpace = (HPCapacity % 2 === 0 ? HPCapacity : HPCapacity + 1) + player.GetBrokenHearts() * 2;
    const SoulSpaceLeft = 24 - (SoulSpace + hb.PrevSoulHearts);

    switch (pickup.SubType as HeartSubType) {
      case HeartSubType.FULL:
      case HeartSubType.SCARED:
      case HeartSubType.BLENDED:
        if (HPLeft > 1) {
          player.AddHearts(-1);
        }
        break;
      case HeartSubType.DOUBLE_PACK:
        if (HPLeft > 2) {
          if (HPLeft === 3) {
            player.AddHearts(-1);
          } else {
            player.AddHearts(-2);
          }
        }
        break;
      case HeartSubType.SOUL:
      case HeartSubType.BLACK:
        if (SoulSpaceLeft > 1) {
          player.AddSoulHearts(-1);
        }
        break;
      case HeartSubType.HALF:
        if (HPLeft > 0) {
          player.AddHearts(-1);
        }
        break;
      case HeartSubType.HALF_SOUL:
        if (SoulSpaceLeft > 0) {
          player.AddSoulHearts(-1);
        }
        break;
      default:
        break;
    }

    hb.OldPrevRedHearts = hb.PrevRedHearts;
    hb.OldPrevSoulHearts = hb.PrevSoulHearts;
    hb.PrevRedHearts = player.GetHearts();
    hb.PrevSoulHearts = player.GetSoulHearts();
    hb.Clear = true;
  }
}

function HeartbrokenPrePickup(pickup: EntityPickup, collider: Entity, _: boolean): boolean | undefined {
  const player = collider.ToPlayer();
  if (player !== undefined && player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
    if (HeartsToProcess.includes(pickup.SubType as HeartSubType)) {
      const playerHash = GetPtrHash(player);
      const hb = getOrDefault(saved.run.heartbroken, playerHash, HeartbrokenData);
      hb.Clear = false;
    }
  }
  return undefined;
}
