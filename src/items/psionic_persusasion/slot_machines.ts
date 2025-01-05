import { CollectibleType, EffectVariant, EntityType, HeartSubType, ItemPoolType, PickupVariant, SoundEffect } from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { rollRange } from "../../helpers";
import { modRNG } from "../../mod";
import { PsiPersuasionFakeAnimStart, PsiPersuasionOutcome } from "./common";

const SlotsAnimCycleKachow: string[] = ["Initiate", "Wiggle", "WiggleEnd", "Idle", "Death", "Broken"];
const SlotsAnimCycle: string[] = ["Initiate", "Wiggle", "WiggleEnd", "Idle"];
const SlotsAnimCycleWin: string[] = ["Initiate", "Wiggle", "WiggleEnd"];

export function PsiPersuasionSlotMachine(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Broken") {
    return;
  }

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, entity.Position);
      spawn(EntityType.BIG_SPIDER, 0, 0, entity.Position);
      entity.Remove();
      break;
    case PsiPersuasionOutcome.FAILURE:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, SlotsAnimCycle, (arg0: Entity) => {
        Isaac.Explode(arg0.Position, undefined, 10);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, SlotsAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, SlotsAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.CHEST_OPEN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.33) {
          arg0.GetSprite().SetFrame("Prize", 6);
          spawn(EntityType.PICKUP, PickupVariant.HEART, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.66) {
          arg0.GetSprite().SetFrame("Prize", 4);
          spawn(EntityType.PICKUP, PickupVariant.KEY, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          arg0.GetSprite().SetFrame("Prize", 2);
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, SlotsAnimCycleKachow, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_1_EXPLOSIONS, 1, 0, false, 1);
        spawn(EntityType.EFFECT, EffectVariant.BOMB_EXPLOSION, 0, entity.Position);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, CollectibleType.DOLLAR, arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

const FortuneAnimCycleKachow: string[] = ["Initiate", "Wiggle", "Prize", "Idle", "Death", "Broken"];
const FortuneAnimCycle: string[] = ["Initiate", "Wiggle", "Prize", "Idle"];

export function PsiPersuasionFortuneTellingMachine(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() !== "Idle") {
    return;
  }

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, entity.Position);
      spawn(EntityType.BIG_SPIDER, 0, 0, entity.Position);
      entity.Remove();
      break;
    case PsiPersuasionOutcome.FAILURE:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, FortuneAnimCycle, (arg0: Entity) => {
        Isaac.Explode(arg0.Position, undefined, 10);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, FortuneAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, FortuneAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.SOUL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, FortuneAnimCycleKachow, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_1_EXPLOSIONS, 1, 0, false, 1);
        spawn(EntityType.EFFECT, EffectVariant.BOMB_EXPLOSION, 0, entity.Position);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, CollectibleType.CRYSTAL_BALL, arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

const BloodAnimCycleKachow: string[] = ["Initiate", "Wiggle", "Prize", "Idle", "Death", "Broken"];
const BloodAnimCycle: string[] = ["Initiate", "Wiggle", "Prize", "Idle"];

export function PsiPersuasionBloodDonationMachine(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() !== "Idle") {
    return;
  }

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, entity.Position);
      spawn(EntityType.BIG_SPIDER, 0, 0, entity.Position);
      entity.Remove();
      break;
    case PsiPersuasionOutcome.FAILURE:
      SFXManager().Play(SoundEffect.BLOOD_BANK_TOUCHED, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, BloodAnimCycle, (arg0: Entity) => {
        Isaac.Explode(arg0.Position, undefined, 10);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      SFXManager().Play(SoundEffect.BLOOD_BANK_TOUCHED, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, BloodAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      SFXManager().Play(SoundEffect.BLOOD_BANK_TOUCHED, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, BloodAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BLOOD_BANK_SPAWN, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.COIN, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      SFXManager().Play(SoundEffect.BLOOD_BANK_TOUCHED, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, BloodAnimCycleKachow, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_1_EXPLOSIONS, 1, 0, false, 1);
        spawn(EntityType.EFFECT, EffectVariant.BOMB_EXPLOSION, 0, entity.Position);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, CollectibleType.BLOOD_BAG, arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

const CraneAnimCycleKachow: string[] = ["Initiate", "Wiggle", "WiggleEnd", "Idle", "Death", "Broken"];
const CraneAnimCycle: string[] = ["Initiate", "Wiggle"];
const CraneAnimCyclePost: string[] = ["NoPrize"];
const CraneAnimCyclePostWin: string[] = ["Prize"];
const CraneAnimCycleWin: string[] = ["Initiate", "Wiggle", "WiggleEnd"];

export function PsiPersuasionCraneGame(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() !== "Idle") {
    return;
  }

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, entity.Position);
      spawn(EntityType.BIG_SPIDER, 0, 0, entity.Position);
      entity.Remove();
      break;
    case PsiPersuasionOutcome.FAILURE:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, CraneAnimCycle, (arg0: Entity) => {
        Isaac.Explode(arg0.Position, undefined, 10);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, CraneAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, CraneAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      SFXManager().Play(SoundEffect.COIN_SLOT, 1, 0, false, 1);
      PsiPersuasionFakeAnimStart(entity, CraneAnimCycle, (_: Entity) => {});
      break;
  }
}

const ConfessionalAnimCycleWin: string[] = ["Initiate", "Wiggle"];
const ConfessionalAnimCycle: string[] = ["Initiate", "Wiggle", "NoPrize"];

export function PsiPersuasionConfessional(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() !== "Idle") {
    return;
  }

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      spawn(EntityType.EFFECT, EffectVariant.POOF_1, 0, entity.Position);
      spawn(EntityType.BIG_SPIDER, 0, 0, entity.Position);
      entity.Remove();
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, ConfessionalAnimCycle, (arg0: Entity) => {
        Isaac.Explode(arg0.Position, undefined, 10);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, ConfessionalAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ConfessionalAnimCycleWin, (arg0: Entity) => {
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.86) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.SOUL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.ETERNAL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
        entity.GetSprite().Play("Prize", true);
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ConfessionalAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.ANGEL), arg0.Position.add(Vector(0, 20)), Vector(0, 0.1));
        entity.GetSprite().Play("Prize", true);
      });
      break;
  }
}
