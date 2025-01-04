import { TearFlag } from "isaac-typescript-definitions";

export const DanielStats = {
  DAMAGE: 0.6,
  FIRE_DELAY: 1,
  SPEED: -0.1,
  SHOT_SPEED: 0.8,
  TEAR_HEIGHT: 0,
  TEAR_FALLING_SPEED: 0,
  LUCK: 3,
  FLYING: false,
  TEAR_FLAG: TearFlag.NORMAL,
  TEAR_COLOR: Color(1.0, 1.0, 1.0, 1.0, 0, 0, 0)
} as const;

export const DanielBStats = {
  DAMAGE: 0.8,
  FIRE_DELAY: 1,
  SPEED: -0.1,
  SHOT_SPEED: 0.8,
  TEAR_HEIGHT: 0,
  TEAR_FALLING_SPEED: 0,
  LUCK: 0,
  FLYING: false,
  TEAR_FLAG: TearFlag.NORMAL,
  TEAR_COLOR: Color(1.0, 1.0, 1.0, 1.0, -0.1, -0.1, -0.1)
} as const;
