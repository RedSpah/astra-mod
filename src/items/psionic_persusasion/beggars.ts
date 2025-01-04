import {
  ActiveSlot,
  BatterySubType,
  BlueFlySubType,
  BombSubType,
  CollectibleType,
  EntityType,
  FamiliarVariant,
  HeartSubType,
  ItemPoolType,
  PickupVariant,
  SlothVariant,
  SoundEffect,
  TrinketType
} from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { rollRange } from "../../helpers";
import { modRNG } from "../../mod";
import { PsiPersuasionFakeAnimStart, PsiPersuasionOutcome } from "./common";

const BeggarAnimCycleBombed: string[] = ["Bombed", "Idle"];
const BeggarAnimCycle: string[] = ["PayNothing", "Idle"];
const BeggarAnimCycleWin: string[] = ["PayPrize", "Prize", "Idle"];
// onst BeggarAnimCycleKachow: string[] = ["PayPrize", "Teleport"];
const BeggarAnimCycleLeave: string[] = ["PayPrize"];
const ShellGameAnimCycle: string[] = ["PayShuffle"];
const ShellGameAnimCyclePost: string[] = ["Shell2Prize", "Idle"];

export function PsiPersuasionBeggar(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        spawn(EntityType.PICKUP, PickupVariant.BOMB, BombSubType.MEGA_TROLL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        spawn(EntityType.PICKUP, PickupVariant.BOMB, BombSubType.TROLL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.25) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.KEY, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.75) {
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.TAROT_CARD, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.BEGGAR), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionDevilBeggar(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.TEAR_IMPACTS, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.BIG_SPIDER, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.SPIDER, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.33) {
          spawn(EntityType.PICKUP, PickupVariant.PILL, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.66) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.TAROT_CARD, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.DEMON_BEGGAR), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionBombBeggar(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleBombed, (arg0: Entity) => {
        for (let i = 0; i < 6; i++) {
          const attPos = arg0.Position.add(Vector(rollRange(-300, 300, modRNG), rollRange(-150, 150, modRNG)));
          spawn(EntityType.BOMB, BombSubType.MEGA_TROLL, 0, Game().GetRoom().FindFreePickupSpawnPosition(attPos), Vector(0, 0), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleBombed, (arg0: Entity) => {
        for (let i = 0; i < 6; i++) {
          const attPos = arg0.Position.add(Vector(rollRange(-300, 300, modRNG), rollRange(-150, 150, modRNG)));
          spawn(EntityType.BOMB, BombSubType.TROLL, 0, Game().GetRoom().FindFreePickupSpawnPosition(attPos), Vector(0, 0), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.COIN, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.BOMB_BUM), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionKeyBeggar(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.KEY_DROP, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        for (let i = 0; i < 10; i++) {
          spawn(EntityType.SWARM_SPIDER, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.SPIDER, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.CHEST, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);

        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.33) {
          spawn(EntityType.PICKUP, PickupVariant.PILL, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.66) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.TAROT_CARD, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        arg0.GetSprite().Play("Teleport", true);
        entity.RenderZOffset = -10;
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.25) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.PAPER_CLIP, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.KEY_MASTER), arg0.Position, Vector(0, 0.1));
        }
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionBatteryBeggar(entity: Entity, outcome: PsiPersuasionOutcome, player: EntityPlayer): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.BOMB, BombSubType.GOLDEN_TROLL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (_: Entity) => {
        SFXManager().Play(SoundEffect.BATTERY_DISCHARGE, 1, 0, false, 1);
        player.DischargeActiveItem(ActiveSlot.POCKET);
        player.DischargeActiveItem(ActiveSlot.SECONDARY);
        player.DischargeActiveItem(ActiveSlot.PRIMARY);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (_: Entity) => {
        SFXManager().Play(SoundEffect.BATTERY_CHARGE, 1, 0, false, 1);
        player.SetActiveCharge(player.GetActiveCharge() + 1);
      });
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.25) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.WATCH_BATTERY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.AAA_BATTERY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.75) {
          spawn(EntityType.PICKUP, PickupVariant.LIL_BATTERY, BatterySubType.NORMAL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.LIL_BATTERY, BatterySubType.MICRO, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.BATTERY_BUM), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionRottenBeggar(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        spawn(EntityType.SLOTH, SlothVariant.SUPER_SLOTH, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        Game().Fart(arg0.Position);
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycle, (_: Entity) => {});
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleWin, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.125) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.FISH_TAIL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.25) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.FISH_HEAD, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.375) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.BOBS_BLADDER, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.TRINKET, TrinketType.ROTTEN_PENNY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.625) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.BONE, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.75) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.ROTTEN, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.875) {
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY, BlueFlySubType.BLUE_FLY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY, BlueFlySubType.BLUE_FLY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY, BlueFlySubType.BLUE_FLY, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, BeggarAnimCycleLeave, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.ROTTEN_BEGGAR), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionShellGame(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  // entity.GetSprite().SetOverlayAnimation("Prizes");
  entity.GetSprite().RemoveOverlay();
  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 23, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 35, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 45, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 51, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 56, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 61, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 66, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 70, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.BOMB, BombSubType.MEGA_TROLL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ, 1, 0, false, 1);
        spawn(EntityType.FLY, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);
        PsiPersuasionFakeAnimStart(arg0, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.25) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.5) {
          spawn(EntityType.PICKUP, PickupVariant.KEY, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.75) {
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.COIN, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
        PsiPersuasionFakeAnimStart(arg0, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, CollectibleType.SKATOLE, arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}

export function PsiPersuasionDemonShellGame(entity: Entity, outcome: PsiPersuasionOutcome): void {
  if (entity.GetSprite().GetAnimation() === "Teleport") {
    return;
  }

  SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 23, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 35, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 45, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 51, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 56, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 61, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 66, false, 1);
  SFXManager().Play(SoundEffect.SHELL_GAME, 1, 70, false, 1);

  switch (outcome) {
    case PsiPersuasionOutcome.CRIT_FAILURE:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ, 1, 0, false, 1);
        spawn(EntityType.PICKUP, PickupVariant.BOMB, BombSubType.MEGA_TROLL, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.FAILURE:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ, 1, 0, false, 1);
        spawn(EntityType.SPIDER, 0, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.NOTHING:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (_: Entity) => {
        SFXManager().Play(SoundEffect.SCAMPER, 1, 0, false, 1);
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (__: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        const slotRoll = modRNG.RandomFloat();
        if (slotRoll < 0.2) {
          spawn(EntityType.PICKUP, PickupVariant.HEART, HeartSubType.BLACK, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.4) {
          spawn(EntityType.PICKUP, PickupVariant.KEY, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.PICKUP, PickupVariant.KEY, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.6) {
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else if (slotRoll < 0.8) {
          spawn(EntityType.PICKUP, PickupVariant.COIN, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.PICKUP, PickupVariant.COIN, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        } else {
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
          spawn(EntityType.PICKUP, PickupVariant.BOMB, 0, arg0.Position, Vector(rollRange(-2, 2, modRNG), rollRange(0, 2, modRNG)), arg0);
        }
        PsiPersuasionFakeAnimStart(entity, ShellGameAnimCyclePost, (_: Entity) => {});
      });
      break;
    case PsiPersuasionOutcome.CRIT_SUCCESS:
      PsiPersuasionFakeAnimStart(entity, ShellGameAnimCycle, (arg0: Entity) => {
        arg0.GetSprite().Play("Teleport", true);
        SFXManager().Play(SoundEffect.SLOT_SPAWN, 1, 0, false, 1);
        entity.RenderZOffset = -10;
        spawn(EntityType.PICKUP, PickupVariant.COLLECTIBLE, Game().GetItemPool().GetCollectible(ItemPoolType.DEVIL), arg0.Position, Vector(0, 0.1));
        arg0.Die();
      });
      break;
  }
}
