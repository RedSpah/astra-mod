import { CacheFlag } from "isaac-typescript-definitions";
import { addFlag } from "isaacscript-common";
import { AstraBStats } from "../../enums/AstraBStats";

export function evaluateCacheAstraB(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
): void {
  switch (cacheFlag) {
    case CacheFlag.DAMAGE:
      player.Damage *= AstraBStats.DAMAGE;
      break;
    case CacheFlag.SHOT_SPEED:
      player.ShotSpeed *= AstraBStats.SHOT_SPEED;
      break;
    case CacheFlag.RANGE:
      player.TearHeight -= AstraBStats.TEAR_HEIGHT;
      player.TearFallingSpeed += AstraBStats.TEAR_FALLING_SPEED;
      break;
    case CacheFlag.SPEED:
      player.MoveSpeed += AstraBStats.SPEED;
      break;
    case CacheFlag.LUCK:
      player.Luck += AstraBStats.LUCK;
      break;
    case CacheFlag.FLYING:
      player.CanFly ||= AstraBStats.FLYING;
      break;
    case CacheFlag.TEAR_FLAG:
      player.TearFlags = addFlag(player.TearFlags, AstraBStats.TEAR_FLAG);
      break;
    case CacheFlag.TEAR_COLOR:
      player.TearColor = AstraBStats.TEAR_COLOR;
      break;
    case CacheFlag.FIRE_DELAY:
      player.MaxFireDelay *= AstraBStats.FIRE_DELAY;
      break;
  }
}
