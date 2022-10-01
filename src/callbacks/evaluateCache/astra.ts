import { CacheFlag } from "isaac-typescript-definitions";
import { addFlag } from "isaacscript-common";
import { AstraStats } from "../../enums/AstraStats";

export function evaluateCacheAstra(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
): void {
  switch (cacheFlag) {
    case CacheFlag.DAMAGE:
      player.Damage *= AstraStats.DAMAGE;
      // TODO: PURITY
      break;
    case CacheFlag.SHOT_SPEED:
      player.ShotSpeed *= AstraStats.SHOT_SPEED;
      break;
    case CacheFlag.RANGE:
      player.TearHeight -= AstraStats.TEAR_HEIGHT;
      player.TearFallingSpeed += AstraStats.TEAR_FALLING_SPEED;
      break;
    case CacheFlag.SPEED:
      player.MoveSpeed += AstraStats.SPEED;
      break;
    case CacheFlag.LUCK:
      player.Luck += AstraStats.LUCK;
      break;
    case CacheFlag.FLYING:
      player.CanFly ||= AstraStats.FLYING;
      break;
    case CacheFlag.TEAR_FLAG:
      player.TearFlags = addFlag(player.TearFlags, AstraStats.TEAR_FLAG);
      break;
    case CacheFlag.TEAR_COLOR:
      // TODO: PURITY
      player.TearColor = AstraStats.TEAR_COLOR;
      break;
    case CacheFlag.FIRE_DELAY:
      player.MaxFireDelay *= AstraStats.FIRE_DELAY;
      break;
  }
}

// function AstraPurityGetDamage
