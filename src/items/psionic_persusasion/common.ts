import { ActiveSlot, CollectibleType, EntityType, UseFlag } from "isaac-typescript-definitions";
import { printConsole } from "isaacscript-common";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import { getAnimLen, getOrDefault } from "../../helpers";

export enum PsiPersuasionOutcome {
  CRIT_FAILURE,
  FAILURE,
  NOTHING,
  SUCCESS,
  CRIT_SUCCESS
}

export const Outcomes: PsiPersuasionOutcome[] = [
  PsiPersuasionOutcome.CRIT_FAILURE,
  PsiPersuasionOutcome.FAILURE,
  PsiPersuasionOutcome.NOTHING,
  PsiPersuasionOutcome.SUCCESS,
  PsiPersuasionOutcome.CRIT_SUCCESS
];

const Odds: number[] = [0.03, 0.2, 0.6, 0.97, Infinity];
const Odds_: number[] = [-6, -6, -6, -6, Infinity];
const OddsBirthright: number[] = [0, 0.05, 0.4, 0.9, Infinity];

export const Constants = {
  LuckMul: 0.02,
  LuckConstMul: 0.01
} as const;

export class PsiPersuasionTemplate {
  ID: EntityType;
  Variant: number;
  Func: (arg0: Entity, arg1: PsiPersuasionOutcome, arg2: EntityPlayer) => void;

  constructor(id: EntityType, v: number, func: (arg0: Entity, arg1: PsiPersuasionOutcome, arg2: EntityPlayer) => void) {
    this.ID = id;
    this.Variant = v;
    this.Func = func;
  }
}

export class EntityFakeAnimData {
  Step = 0;
  FrameCtr = 0;
  AnimLen = 0;
  StepList: string[];
  Then: ((arg0: Entity) => void) | undefined;

  constructor() {
    this.StepList = [];
  }
}

export const templates: PsiPersuasionTemplate[] = [];
export const fakeAnim: Map<EntityPtr, EntityFakeAnimData> = new Map<EntityPtr, EntityFakeAnimData>();

export function PsiPersuasionAddCallback(id: EntityType, variant: number, func: (arg0: Entity, arg1: PsiPersuasionOutcome, arg2: EntityPlayer) => void): void {
  const template = new PsiPersuasionTemplate(id, variant, func);
  templates.push(template);
}

export function PsiPersuasionReset(): void {
  fakeAnim.clear();
}

export function PsiPersuasionUse(_: CollectibleType, rng: RNG, player: EntityPlayer, __: BitFlags<UseFlag>, ___: ActiveSlot): boolean {
  for (const entity of Isaac.GetRoomEntities()) {
    for (const template of templates) {
      if (entity.Type === template.ID && entity.Variant === template.Variant && !entity.IsDead() && entity.Exists()) {
        let odds = Odds;
        if (player.GetPlayerType() === PlayerTypeCustom.DANIEL && player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
          odds = OddsBirthright;
        }

        const roll = rng.RandomFloat();
        const fate = roll * (1 + player.Luck * Constants.LuckMul) + (player.Luck * Constants.LuckConstMul) / 2;

        printConsole(`roll: ${roll} fate: ${fate}`);

        for (let i = 0; i < odds.length; i++) {
          const possibility = odds[i];
          if (possibility !== undefined) {
            if (fate <= possibility) {
              const outcome = Outcomes[i];
              if (outcome !== undefined) {
                template.Func(entity, outcome, player);
                break;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export function PsiPersuasionProcess(): void {
  for (const key of fakeAnim.keys()) {
    const entity = key.Ref;
    if (entity !== undefined) {
      const animData = getOrDefault(fakeAnim, key, EntityFakeAnimData);
      const curStep = animData.StepList[animData.Step];
      if (curStep !== undefined) {
        animData.FrameCtr++;
        if (entity.GetSprite().IsFinished(curStep) || animData.FrameCtr > animData.AnimLen) {
          animData.Step++;
          if (animData.Step === animData.StepList.length) {
            if (animData.Then !== undefined) {
              animData.Then(entity);
            }
            fakeAnim.delete(key);
          } else {
            const newStep = animData.StepList[animData.Step];
            if (newStep !== undefined) {
              animData.FrameCtr = 0;
              animData.AnimLen = getAnimLen(entity.GetSprite(), newStep) * 2;
              entity.GetSprite().Play(newStep, false);
              entity.GetSprite().RemoveOverlay();
            }
          }
        }
      }
    }
  }
}

export function PsiPersuasionFakeAnimStart(entity: Entity, stepList: string[], then: ((arg0: Entity) => void) | undefined): void {
  const entityHash = EntityPtr(entity);
  const animData = getOrDefault(fakeAnim, entityHash, EntityFakeAnimData);
  animData.Step = 0;
  animData.FrameCtr = 0;
  animData.StepList = stepList;
  animData.Then = then;
  const newStep = animData.StepList[animData.Step];
  if (newStep !== undefined) {
    animData.AnimLen = getAnimLen(entity.GetSprite(), newStep) * 2;
    entity.GetSprite().Play(newStep, true);
    entity.GetSprite().RemoveOverlay();
  }
}
