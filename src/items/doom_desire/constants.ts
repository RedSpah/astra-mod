import { CollectibleType } from "isaac-typescript-definitions";

export const DoomDesireConstants = {
  // Charge
  MaxTimerBase: 50,
  MaxTimerRangeMul: -0.5,
  CDBase: 50,
  CDFireDelayMul: 5,
  StillExtraTimer: 3,

  // Reticule
  ReticuleStillSlowMul: 0.55,
  ReticuleSpeedShotSpeedMul: 8,
  ReticuleColor: Color(1, 0, 0, 1, 1, 0, 0),
  SteerFactor: 0.75,
  ReticuleRotationMulti: 1000,
  ReticuleShrinkCutoff: 0.5,

  // Crack
  CrackDuration: 20,
  CrackTearsPerFrame: 3,
  ApproxTearsFactor: 0.5,
  BaseTearSpeedFactor: 20,
  CrackSoulsPerFrame: 0,
  TAstraSouls: 0.12,
  BoomyItemMul: 0.33,
  CrackKnifesMul: 0.6,
  CrackLasersMul: 1,
  CrackBrimMul: 0.3,
  CrackTechXMul: 0.4,

  // Fire
  FireShotSpeedMul: 7.5,
  SizeSpreadMin: 0.8,
  SizeSpreadMax: 2.3,
  BrimTimeoutMin: 9,
  BrimTimeoutMax: 18,
  KnifeTimeoutMin: 30,
  KnifeTimeoutMax: 50,
  TearFallingSpeed: -18,
  TearFallingAcceleration: 2,
  ShotBaseColor: Color(0, 0, 0, 1, 0.2, 0, 0),
  TearColorRedMin: 0.4,
  TearColorRedMax: 1,
  DamageSpreadMin: 0.5,
  DamageSpreadMax: 1.5,
  ShotSpeedSpreadMin: 0.5,
  ShotSpeedSpreadMax: 1.5,

  // VFX
  ChargeIconOffset: Vector(28, -35)
} as const;

export const DoomDesireBoomyItemList = [CollectibleType.DR_FETUS, CollectibleType.EPIC_FETUS, CollectibleType.PURGATORY];
