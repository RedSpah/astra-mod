export const ConfusionConstants = {
  // Charge
  ExplosionDamageMul: 16,
  ChargeTimeBase: 30,
  ChargeTimeFireDelayMul: 3,
  OuterRangeMul: -5,
  InnerRangeMul: 0.6,
  SlowingFactor: 0.9,
  ExplosionMinCharge: 0.5,
  ExplosionPushForce: 70,
  ConstantPushForce: 2.75,
  StatusMaxLength: 80,
  MaxFireDelaySlowdown: 2.5,
  NormalChargeDecay: 0.75,
  ExplosionChargeDecay: 0.6,

  // VFX
  ShotSpeedSpinMul: 0.1,
  WispsNum: 120,
  EffectColorPriority: 999,
  WispRenderDistMul: 0.66,
  WispRenderVertOffset: Vector(0, 12),
  ChargeSpriteOffset: Vector(20, -35),
  RepelRenderMul: 0.025,
  RepelRenderVerticalStretch: 1.8,
  OuterWispColor: Color(0.1, 0.5, 0.5, 0.75, 0.04, 0.2, 0.2),
  RepelColor: Color(0.25, 1, 1, 1, 0.25, 1, 1),
  // Misc
  Infinity: 2137 * 2137 * 2137
} as const;
