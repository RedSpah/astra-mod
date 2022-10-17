import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { addFlag } from "isaacscript-common";
import { AstraBStats, AstraStats } from "../enums/AstraStats";
import { PlayerTypeCustom } from "../enums/PlayerTypes";
import { mod } from "../mod";

export function evaluateCacheInit(): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, evaluateCachePlayers);
}

function evaluateCachePlayers(player: EntityPlayer, cacheFlag: CacheFlag) {
  switch (player.GetPlayerType()) {
    case PlayerTypeCustom.ASTRA:
      evaluateCacheAstra(player, cacheFlag);
      break;
    case PlayerTypeCustom.ASTRA_B:
      evaluateCacheAstraB(player, cacheFlag);
      break;
    default:
      break;
  }
}

function evaluateCacheAstra(player: EntityPlayer, cacheFlag: CacheFlag) {
  switch (cacheFlag) {
    case CacheFlag.DAMAGE:
      player.Damage *= AstraStats.DAMAGE;
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
      player.TearColor = AstraStats.TEAR_COLOR;
      break;
    case CacheFlag.FIRE_DELAY:
      player.MaxFireDelay *= AstraStats.FIRE_DELAY;
      break;
  }
}

function evaluateCacheAstraB(player: EntityPlayer, cacheFlag: CacheFlag) {
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
