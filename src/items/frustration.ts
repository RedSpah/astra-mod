import { ActiveSlot, CollectibleType, ModCallback, SoundEffect, UseFlag } from "isaac-typescript-definitions";
import { hasFlag } from "isaacscript-common";
import { CollectibleCustom } from "../enums/Collectibles";
import { getOrDefault } from "../helpers";
import { mod } from "../mod";

const Constants = {
  TPUpDelay: 40,
  TPControlCD: 75,
  TPPostControlCD: 19
} as const;

export class FrustrationData {
  TPDelay = -1;
}

export const saved = {
  run: {
    conf: new Map<PtrHash, FrustrationData>()
  }
};

export function frustrationInit(): void {
  mod.saveDataManager("astra.frustration", saved);
  mod.saveDataManagerRegisterClass(FrustrationData);
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, FrustrationProcess);
  mod.AddCallback(ModCallback.PRE_USE_ITEM, FrustrationUse, CollectibleCustom.FRUSTRATION);
}

function FrustrationProcess(player: EntityPlayer) {
  const playerHash = GetPtrHash(player);

  const frust = getOrDefault(saved.run.conf, playerHash, FrustrationData);

  if (frust.TPDelay === 19) {
    SFXManager().Play(SoundEffect.HELL_PORTAL_1);
  }

  if (frust.TPDelay === 0) {
    player.Position = Isaac.GetFreeNearPosition(Isaac.GetRandomPosition(), 5);
    player.GetSprite().Play("TeleportDown", true);
    SFXManager().Play(SoundEffect.HELL_PORTAL_2);
    player.AddControlsCooldown(Constants.TPPostControlCD);
    frust.TPDelay = -1;
  } else if (frust.TPDelay > 0) {
    frust.TPDelay = math.max(0, frust.TPDelay - 1);
  }
}

// Code for activating the initial item
function FrustrationUse(_: CollectibleType, __: RNG, player: EntityPlayer, useFlags: BitFlags<UseFlag>, ___: ActiveSlot) {
  if (!hasFlag(useFlags, UseFlag.MIMIC, UseFlag.CAR_BATTERY, UseFlag.VOID)) {
    const playerHash = GetPtrHash(player);
    const frust = getOrDefault(saved.run.conf, playerHash, FrustrationData);

    player.AddControlsCooldown(Constants.TPControlCD);
    player.PlayExtraAnimation("Sad");
    player.QueueExtraAnimation("TeleportUp");
    SFXManager().Play(SoundEffect.THUMBS_DOWN);
    frust.TPDelay = Constants.TPUpDelay;
  }
  return false;
}
