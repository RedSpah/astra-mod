import { CollectibleType, EffectVariant, EntityType, LaserOffset, LaserVariant, SoundEffect, WeaponType } from "isaac-typescript-definitions";
import { getPlayerCollectibleCount, playerHasCollectible, spawn, spawnKnife, spawnLaser } from "isaacscript-common";

import { CollectibleCustom } from "../../enums/Collectibles";
import { Globals } from "../../enums/Globals";
import { PlayerTypeCustom } from "../../enums/PlayerTypes";
import { getApproxNumTears, getFireVector, getOrDefault, rollRange } from "../../helpers";
import { DoomDesireBoomyItemList, DoomDesireConstants as Constants } from "./constants";

import { DoomDesireData, DoomDesireVolatileData, locals, ManualKnifeData, saved } from "./variables";

export function DoomDesireProcess(player: EntityPlayer): void {
  const playerHash = GetPtrHash(player);
  if (player.HasCollectible(CollectibleCustom.DOOM_DESIRE)) {
    // Variable setup
    const dd = getOrDefault(saved.run.conf, playerHash, DoomDesireData);
    const local = getOrDefault(locals, playerHash, DoomDesireVolatileData);

    dd.JustExploded = false;
    dd.MaxTimer = Constants.MaxTimerBase + player.TearHeight * Constants.MaxTimerRangeMul;

    // Freeze the max CD while it's in the process of cooling down
    if (!dd.CoolingDown) {
      dd.MaxCD = Constants.CDBase + Constants.CDFireDelayMul * player.MaxFireDelay;
    }

    // Can't get normal firing direction since T.Astra is blindfolded
    const FireVector = getFireVector(player);

    if ((FireVector.X !== 0 || FireVector.Y !== 0) && !dd.InUse && !dd.CoolingDown) {
      dd.AimReticulePos = player.Position;
      dd.InUse = true;
      dd.Timer = dd.MaxTimer;
      dd.MaxCD = math.max(dd.MaxCD, dd.MaxTimer + 1); // Just in case
      dd.CD = dd.MaxCD;
      dd.CoolingDown = true;
    }

    // Moving target around and counting down
    if (dd.InUse) {
      dd.Timer--;

      if (FireVector.X === 0 && FireVector.Y === 0) {
        dd.AimReticuleVelocity = dd.AimReticuleVelocity.mul(Constants.ReticuleStillSlowMul);
        dd.Timer -= Constants.StillExtraTimer;
      } else {
        dd.AimReticuleVelocity = dd.AimReticuleVelocity.Normalized()
          .mul(1 - Constants.SteerFactor)
          .add(FireVector.mul(Constants.SteerFactor))
          .Normalized()
          .mul(player.ShotSpeed * Constants.ReticuleSpeedShotSpeedMul);
      }

      if (dd.Timer <= 0) {
        dd.JustExploded = true;
        dd.ExplosionPos = dd.AimReticulePos;
        dd.InUse = false;
        dd.Timer = 0;
        SFXManager().Play(SoundEffect.GROUND_TREMOR);
      }
    }

    // Cooldown code
    if (dd.CoolingDown) {
      dd.CD--;
      if (dd.CD <= 0) {
        dd.CD = 0;
        dd.CoolingDown = false;
      }
    }

    if (dd.CrackDuration > 0) {
      dd.CrackSoulCounter +=
        Constants.CrackSoulsPerFrame +
        (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B ? Constants.TAstraSouls : 0) +
        getPlayerCollectibleCount(player, ...DoomDesireBoomyItemList) * Constants.BoomyItemMul;

      const BaseShotSpeed = player.ShotSpeed * Constants.FireShotSpeedMul;
      dd.TearsPerFrame = Constants.CrackTearsPerFrame + getApproxNumTears(player) * Constants.ApproxTearsFactor * (Constants.BaseTearSpeedFactor / player.MaxFireDelay);

      if (player.HasWeaponType(WeaponType.LASER)) {
        dd.CrackLaserCounter += dd.TearsPerFrame * Constants.CrackLasersMul;

        while (dd.CrackLaserCounter > 1) {
          dd.CrackLaserCounter--;

          const Direction = Vector.FromAngle(local.RNG.RandomFloat() * 360);
          const DamageMul = rollRange(Constants.DamageSpreadMin, Constants.DamageSpreadMax, local.RNG);

          const Laser = player.FireTechLaser(dd.ExplosionPos, LaserOffset.TECH_5, Direction, false, true, player, DamageMul);
          Laser.SetColor(GetTearColor(local.RNG), Globals.INFINITY, Globals.COLOR_PRIORITY);
        }
      } else if (player.HasWeaponType(WeaponType.TECH_X)) {
        dd.CrackTechXCounter += dd.TearsPerFrame * Constants.CrackTechXMul;

        while (dd.CrackTechXCounter > 1) {
          dd.CrackTechXCounter--;

          const Direction = Vector.FromAngle(local.RNG.RandomFloat() * 360);
          const DamageMul = rollRange(Constants.DamageSpreadMin, Constants.DamageSpreadMax, local.RNG);
          const ShotSpeedMul = rollRange(Constants.ShotSpeedSpreadMin, Constants.ShotSpeedSpreadMax, local.RNG);
          const Size = rollRange(Constants.SizeSpreadMin, Constants.SizeSpreadMax, local.RNG);

          const Laser = player.FireTechXLaser(dd.ExplosionPos, Direction.mul(BaseShotSpeed * ShotSpeedMul), BaseShotSpeed * Size, player, DamageMul);
          Laser.SetColor(GetTearColor(local.RNG), Globals.INFINITY, Globals.COLOR_PRIORITY);
        }
      } else if (player.HasWeaponType(WeaponType.BRIMSTONE)) {
        dd.CrackBrimCounter += dd.TearsPerFrame * Constants.CrackBrimMul;

        let Variant = LaserVariant.THICK_RED;

        if (playerHasCollectible(player, CollectibleType.TECHNOLOGY, CollectibleType.TECHNOLOGY_2, CollectibleType.TECHNOLOGY_ZERO, CollectibleType.TECH_5, CollectibleType.TECH_X)) {
          Variant = LaserVariant.BRIMSTONE_TECHNOLOGY;
        }

        while (dd.CrackBrimCounter > 1) {
          dd.CrackBrimCounter--;

          const Brim = spawnLaser(Variant, 0, dd.ExplosionPos, Vector(0, 0), player);
          Brim.CollisionDamage = player.Damage * rollRange(Constants.DamageSpreadMin, Constants.DamageSpreadMax, local.RNG);
          Brim.AddTearFlags(player.TearFlags);
          Brim.Angle = local.RNG.RandomFloat() * 360;
          Brim.SetTimeout(math.floor(rollRange(Constants.BrimTimeoutMin, Constants.BrimTimeoutMax, local.RNG)));
          Brim.SetColor(GetTearColor(local.RNG), Globals.INFINITY, Globals.COLOR_PRIORITY);
          Brim.DepthOffset = 200;
        }
      } else if (player.HasWeaponType(WeaponType.KNIFE) || player.HasWeaponType(WeaponType.SPIRIT_SWORD)) {
        dd.CrackKnifeCounter += dd.TearsPerFrame * Constants.CrackKnifesMul;

        while (dd.CrackKnifeCounter > 1) {
          dd.CrackKnifeCounter--;

          const Angle = local.RNG.RandomFloat() * 360;
          const Direction = Vector.FromAngle(Angle);
          // eslint-disable-next-line isaacscript/strict-enums
          const Knife = spawnKnife(0, 2, dd.ExplosionPos, Direction.mul(BaseShotSpeed * 2), player);

          Knife.Parent = player;
          Knife.Rotation = Angle - 90;
          Knife.SpriteRotation = Angle - 90;
          Knife.AddTearFlags(player.TearFlags);
          Knife.SetColor(GetTearColor(local.RNG), Globals.INFINITY, Globals.COLOR_PRIORITY);
          Knife.DepthOffset = 200;

          const KnifeHash = GetPtrHash(Knife);
          const KnifeData = getOrDefault(saved.room.ddknives, KnifeHash, ManualKnifeData);
          KnifeData.Velocity = Direction.mul(rollRange(Constants.ShotSpeedSpreadMin, Constants.ShotSpeedSpreadMax, local.RNG)).mul(Constants.KnifeSpeedMul);
          KnifeData.LifeSpan = rollRange(Constants.KnifeTimeoutMin, Constants.KnifeTimeoutMax, local.RNG);
          KnifeData.Splatted = false;
        }
      } else {
        dd.CrackTearCounter += dd.TearsPerFrame;

        while (dd.CrackTearCounter > 1) {
          dd.CrackTearCounter--;

          const Angle = local.RNG.RandomFloat() * 360;
          const Direction = Vector.FromAngle(Angle);
          const DamageMul = rollRange(Constants.DamageSpreadMin, Constants.DamageSpreadMax, local.RNG);
          const ShotSpeedMul = rollRange(Constants.ShotSpeedSpreadMin, Constants.ShotSpeedSpreadMax, local.RNG);

          const Tear = player.FireTear(dd.ExplosionPos, Direction.mul(ShotSpeedMul * BaseShotSpeed), true, true, false, player, DamageMul);
          Tear.FallingSpeed = Constants.TearFallingSpeed;
          Tear.FallingAcceleration = Constants.TearFallingAcceleration;
          Tear.SetColor(GetTearColor(local.RNG), Globals.INFINITY, Globals.COLOR_PRIORITY);
        }
      }

      while (dd.CrackSoulCounter > 1) {
        dd.CrackSoulCounter--;
        const Soul = Isaac.Spawn(EntityType.EFFECT, EffectVariant.PURGATORY, 2, dd.ExplosionPos, Vector(0, 1), player);
        Soul.GetSprite().Load("gfx/1000.189_purgatory soul.anm2", true);
        Soul.GetSprite().ReplaceSpritesheet(0, "gfx/effects/purgatory_soul.png");
        Soul.GetSprite().LoadGraphics();
        Soul.GetSprite().Color = GetTearColor(local.RNG);

        spawn(EntityType.EFFECT, EffectVariant.BLOOD_GUSH, 0, dd.ExplosionPos);
      }

      spawn(EntityType.EFFECT, EffectVariant.BLOOD_EXPLOSION, local.RNG.RandomInt(6), dd.ExplosionPos, Vector.FromAngle(local.RNG.RandomFloat() * 360).mul(4));
      spawn(EntityType.EFFECT, EffectVariant.BLOOD_PARTICLE, local.RNG.RandomInt(2), dd.ExplosionPos, Vector.FromAngle(local.RNG.RandomFloat() * 360).mul(2));
    }
  }
}

function GetTearColor(rng: RNG): Color {
  return Color(
    rollRange(Constants.TearColorRedMin, Constants.TearColorRedMax, rng),
    Constants.ShotBaseColor.G,
    Constants.ShotBaseColor.B,
    Constants.ShotBaseColor.A,
    Constants.ShotBaseColor.RO,
    Constants.ShotBaseColor.GO,
    Constants.ShotBaseColor.BO
  );
}
