import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { CollectibleCustom } from "../enums/CollectibleCustom";
import { mod } from "../mod";
import {
  PsiPersuasionBatteryBeggar,
  PsiPersuasionBeggar,
  PsiPersuasionBombBeggar,
  PsiPersuasionDemonShellGame,
  PsiPersuasionDevilBeggar,
  PsiPersuasionKeyBeggar,
  PsiPersuasionRottenBeggar,
  PsiPersuasionShellGame
} from "./psionic_persusasion/beggars";
import { PsiPersuasionAddCallback, PsiPersuasionProcess, PsiPersuasionReset, PsiPersuasionUse } from "./psionic_persusasion/common";
import {
  PsiPersuasionBloodDonationMachine,
  PsiPersuasionConfessional,
  PsiPersuasionCraneGame,
  PsiPersuasionFortuneTellingMachine,
  PsiPersuasionSlotMachine
} from "./psionic_persusasion/slot_machines";

export function psiPersuasionInit(): void {
  mod.AddCallback(ModCallback.POST_USE_ITEM, PsiPersuasionUse, CollectibleCustom.PSIONIC_PERSUASION);
  mod.AddCallback(ModCallback.POST_RENDER, PsiPersuasionProcess);
  mod.AddCallback(ModCallback.POST_NEW_ROOM, PsiPersuasionReset);

  PsiPersuasionAddCallback(EntityType.SLOT, 1, PsiPersuasionSlotMachine);
  PsiPersuasionAddCallback(EntityType.SLOT, 2, PsiPersuasionBloodDonationMachine);
  PsiPersuasionAddCallback(EntityType.SLOT, 3, PsiPersuasionFortuneTellingMachine);
  PsiPersuasionAddCallback(EntityType.SLOT, 16, PsiPersuasionCraneGame);
  PsiPersuasionAddCallback(EntityType.SLOT, 17, PsiPersuasionConfessional);

  PsiPersuasionAddCallback(EntityType.SLOT, 4, PsiPersuasionBeggar);
  PsiPersuasionAddCallback(EntityType.SLOT, 5, PsiPersuasionDevilBeggar);
  PsiPersuasionAddCallback(EntityType.SLOT, 7, PsiPersuasionKeyBeggar);
  PsiPersuasionAddCallback(EntityType.SLOT, 13, PsiPersuasionBatteryBeggar);
  PsiPersuasionAddCallback(EntityType.SLOT, 9, PsiPersuasionBombBeggar);
  PsiPersuasionAddCallback(EntityType.SLOT, 18, PsiPersuasionRottenBeggar);

  PsiPersuasionAddCallback(EntityType.SLOT, 6, PsiPersuasionShellGame);
  PsiPersuasionAddCallback(EntityType.SLOT, 15, PsiPersuasionDemonShellGame);
}
