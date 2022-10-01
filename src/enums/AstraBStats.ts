import { TearFlag } from "isaac-typescript-definitions";

export const AstraBStats = {
  DAMAGE: 1.25,
  FIRE_DELAY: 1,
  SPEED: -0.25,
  SHOT_SPEED: 0.8,
  TEAR_HEIGHT: 0,
  TEAR_FALLING_SPEED: 0,
  LUCK: -1,
  FLYING: false,
  TEAR_FLAG: TearFlag.NORMAL,
  TEAR_COLOR: Color(1.0, 0.75, 0.75, 1.0, 0.25, 0.05, 0.05),
} as const;
