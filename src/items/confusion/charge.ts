import {
  CacheFlag,
  DamageFlag,
  Direction,
  EffectVariant,
  EntityPartition,
  EntityType,
  SoundEffect,
  TearFlag,
} from "isaac-typescript-definitions";
import { addFlag, hasFlag, spawn } from "isaacscript-common";
import { Collectibles } from "../../enums/Collectibles";
import { ConfusionConstants as Constants } from "./Constants";
import { ConfusionData, saved } from "./variables";

export function ConfusionCharge(player: EntityPlayer): void {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    // Variable setup
    let conf = saved.run.conf.get(playerHash);
    if (conf === undefined) {
      conf = new ConfusionData();
      saved.run.conf.set(playerHash, conf);
    }

    // Setting pseudo consts
    conf.MaxTimer =
      conf.Timer === 0
        ? Constants.ChargeTimeBase +
          Constants.ChargeTimeFireDelayMul * player.MaxFireDelay
        : Constants.ChargeTimeBase +
          Constants.ChargeTimeFireDelayMul * conf.FireDelayCached;
    conf.OuterRange = Constants.OuterRangeMul * player.TearHeight;
    conf.InnerRange = conf.OuterRange * Constants.InnerRangeMul;
    conf.Timer = math.min(conf.Timer, conf.MaxTimer);
    conf.ChargeProgress = conf.Timer / conf.MaxTimer;

    const CH = conf.ChargeProgress;
    const CR = math.sqrt(conf.ChargeProgress);

    // Charging detection
    if (
      player.GetFireDirection() !== Direction.NO_DIRECTION &&
      !player.IsHoldingItem() &&
      conf.Timer < conf.MaxTimer
    ) {
      if (conf.Timer === 0) {
        conf.FireDelayCached = player.MaxFireDelay;
      }

      conf.Timer++;
      conf.Charging = true;
    }

    // Effects during Charging
    if (conf.Charging) {
      /// Variables
      // Distances
      const OuterDist = conf.OuterRange * CR;
      const InnerDist = conf.InnerRange * CR;

      // Outer
      const OuterEnemies = Isaac.FindInRadius(
        player.Position,
        OuterDist,
        EntityPartition.ENEMY,
      );

      // Inner
      const InnerEnemies = Isaac.FindInRadius(
        player.Position,
        InnerDist,
        addFlag(EntityPartition.ENEMY, EntityPartition.PICKUP),
      );

      /// Constant effects
      // Update firerate
      player.AddCacheFlags(CacheFlag.FIRE_DELAY);
      player.EvaluateItems();

      // Pushback
      InnerEnemies.filter(
        (x) => x.IsVulnerableEnemy() || x.Type === EntityType.PICKUP,
      ).forEach((x) => {
        x.AddVelocity(
          Vector(
            x.Position.X - player.Position.X,
            x.Position.Y - player.Position.Y,
          )
            .Normalized()
            .mul(
              Constants.ConstantPushForce *
                ((InnerDist - x.Position.Distance(player.Position)) /
                  InnerDist),
            ),
        );
      });

      /// Fire!
      if (
        player.GetFireDirection() === Direction.NO_DIRECTION &&
        !player.IsHoldingItem() &&
        conf.Timer > 0
      ) {
        // Explosion
        if (conf.ChargeProgress > Constants.ExplosionMinCharge) {
          // SFX
          if (conf.Timer === conf.MaxTimer) {
            SFXManager().Play(SoundEffect.ANGEL_BEAM, 1, 0, false, 1);
          } else {
            SFXManager().Play(SoundEffect.LIGHT_BOLT, 1, 0, false, 1);
          }

          // Player VFX
          spawn(EntityType.EFFECT, EffectVariant.IMPACT, 0, player.Position);

          // Knockback + VFX
          InnerEnemies.forEach((x) => {
            x.AddVelocity(
              Vector(
                x.Position.X - player.Position.X,
                x.Position.Y - player.Position.Y,
              )
                .Normalized()
                .mul(Constants.ExplosionPushForce),
            );
            spawn(EntityType.EFFECT, EffectVariant.RIPPLE_POOF, 0, x.Position);
            spawn(
              EntityType.EFFECT,
              EffectVariant.TEAR_POOF_SMALL,
              0,
              x.Position,
            );
          });

          // Damage + status
          OuterEnemies.filter((x) => x.IsVulnerableEnemy()).forEach((x) => {
            const Force = math.max(
              ((OuterDist - x.Position.Distance(player.Position)) / OuterDist) *
                CH,
              0,
            );

            x.TakeDamage(
              Force * Constants.ExplosionDamageMul * player.Damage,
              DamageFlag.IGNORE_ARMOR,
              EntityRef(player),
              0,
            );

            if (hasFlag(player.TearFlags, TearFlag.BURN)) {
              x.AddBurn(
                EntityRef(player),
                Constants.StatusMaxLength * Force,
                player.Damage,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.POISON)) {
              x.AddPoison(
                EntityRef(player),
                Constants.StatusMaxLength * Force,
                player.Damage,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.CHARM)) {
              x.AddCharmed(
                EntityRef(player),
                Constants.StatusMaxLength * Force,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.FREEZE)) {
              x.AddFreeze(
                EntityRef(player),
                Constants.StatusMaxLength * Force * Force,
              );
            }

            x.AddConfusion(
              EntityRef(player),
              math.floor(Constants.StatusMaxLength * math.sqrt(Force)),
              false,
            );

            x.AddSlowing(
              EntityRef(player),
              math.floor(Constants.StatusMaxLength * math.sqrt(Force)),
              Constants.SlowingFactor,
              Constants.OuterWispColor,
            );
          });
        }

        // Cleanup
        conf.Timer = 0;
        conf.ChargeProgress = 0;
        conf.Charging = false;
        player.AddCacheFlags(CacheFlag.FIRE_DELAY);
        player.EvaluateItems();
      }
    }
  }
}
