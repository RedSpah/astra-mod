import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { addFlag } from "isaacscript-common";
import { AstraBStats, AstraStats } from "../enums/AstraStats";
import { DanielBStats, DanielStats } from "../enums/DanielStats";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
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
    case PlayerTypeCustom.DANIEL:
      evaluateCacheDaniel(player, cacheFlag);
      break;
    case PlayerTypeCustom.DANIEL_B:
      evaluateCacheDanielB(player, cacheFlag);
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

function evaluateCacheDaniel(player: EntityPlayer, cacheFlag: CacheFlag) {
  // onst shinySave = getOrDefault(saved.run.shiny, playerHash, ShinyData); if (shinySave.Shiny) {
  // layer.GetSprite().ReplaceSpritesheet(0, Costumes.DANIEL_SHINY_SKIN_PATH);
  // player.GetSprite().LoadGraphics(); }
  switch (cacheFlag) {
    case CacheFlag.DAMAGE:
      player.Damage *= DanielStats.DAMAGE;
      break;
    case CacheFlag.SHOT_SPEED:
      player.ShotSpeed *= DanielStats.SHOT_SPEED;
      break;
    case CacheFlag.RANGE:
      player.TearHeight -= DanielStats.TEAR_HEIGHT;
      player.TearFallingSpeed += DanielStats.TEAR_FALLING_SPEED;
      break;
    case CacheFlag.SPEED:
      player.MoveSpeed += DanielStats.SPEED;
      break;
    case CacheFlag.LUCK:
      player.Luck += DanielStats.LUCK;
      break;
    case CacheFlag.FLYING:
      player.CanFly ||= DanielStats.FLYING;
      break;
    case CacheFlag.TEAR_FLAG:
      player.TearFlags = addFlag(player.TearFlags, DanielStats.TEAR_FLAG);
      break;
    case CacheFlag.TEAR_COLOR:
      player.TearColor = DanielStats.TEAR_COLOR;
      break;
    case CacheFlag.FIRE_DELAY:
      player.MaxFireDelay *= DanielStats.FIRE_DELAY;
      break;
  }
}

function evaluateCacheDanielB(player: EntityPlayer, cacheFlag: CacheFlag) {
  switch (cacheFlag) {
    case CacheFlag.DAMAGE:
      player.Damage *= DanielBStats.DAMAGE;
      break;
    case CacheFlag.SHOT_SPEED:
      player.ShotSpeed *= DanielBStats.SHOT_SPEED;
      break;
    case CacheFlag.RANGE:
      player.TearHeight -= DanielBStats.TEAR_HEIGHT;
      player.TearFallingSpeed += DanielBStats.TEAR_FALLING_SPEED;
      break;
    case CacheFlag.SPEED:
      player.MoveSpeed += DanielBStats.SPEED;
      break;
    case CacheFlag.LUCK:
      player.Luck += DanielBStats.LUCK;
      break;
    case CacheFlag.FLYING:
      player.CanFly ||= DanielBStats.FLYING;
      break;
    case CacheFlag.TEAR_FLAG:
      player.TearFlags = addFlag(player.TearFlags, DanielBStats.TEAR_FLAG);
      break;
    case CacheFlag.TEAR_COLOR:
      player.TearColor = DanielBStats.TEAR_COLOR;
      break;
    case CacheFlag.FIRE_DELAY:
      player.MaxFireDelay *= DanielBStats.FIRE_DELAY;
      break;
  }
}
