import { TearFlag } from "isaac-typescript-definitions";

export const AstraStats = {
  DAMAGE: 0.75,
  FIRE_DELAY: 1,
  SPEED: 0.0,
  SHOT_SPEED: 1,
  TEAR_HEIGHT: 0,
  TEAR_FALLING_SPEED: 0,
  LUCK: 2,
  FLYING: false,
  TEAR_FLAG: TearFlag.NORMAL,
  TEAR_COLOR: Color(1.0, 1.0, 1.0, 1.0, 0, 0.2, 0.2),
  PURITY_LOST_TEAR_COLOR: Color(0.5, 0.5, 0.5, 1, 0, 0, 0),
  DEVIL_TEAR_COLOR: Color(1.0, 1.0, 1.0, 1.0, 0.2, 0, 0)
} as const;
