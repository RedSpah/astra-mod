import { EffectVariant, EntityType } from "isaac-typescript-definitions";
import { getKnives, getPlayers, spawn } from "isaacscript-common";

import { CollectibleCustom } from "../../enums/CollectibleCustom";
import { Globals } from "../../enums/Globals";
import { getOrDefault } from "../../helpers";
import { modRNG } from "../../mod";
import { DoomDesireConstants as Constants } from "./constants";
import { DoomDesireData, DoomDesireVolatileData, locals, ManualKnifeData, saved } from "./variables";

export function DoomDesire60FPSProcess(): void {
  if (!Game().IsPaused()) {
    for (const player of getPlayers()) {
      const playerHash = GetPtrHash(player);

      if (player.HasCollectible(CollectibleCustom.DOOM_DESIRE)) {
        // Variable setup
        const dd = getOrDefault(saved.run.conf, playerHash, DoomDesireData);
        const local = getOrDefault(locals, playerHash, DoomDesireVolatileData);

        if (Game().GetFrameCount() % 12 === 0 && !Game().IsPaused()) {
          const REmber = spawn(
            EntityType.EFFECT,
            EffectVariant.EMBER_PARTICLE,
            modRNG.RandomInt(2),
            Vector(player.Position.X + modRNG.RandomInt(50) - 25, player.Position.Y + modRNG.RandomInt(50) - 25),
            Vector(0, -modRNG.RandomFloat() * 2 - 1)
          );
          // Ember.ToEffect()?.SetTimeout(20);
          REmber.SetColor(Color(1, 0, 0, 1, 0, 0, 0), Globals.INFINITY, Globals.COLOR_PRIORITY);
        }

        local.refreshCrack();
        if (local.Crack !== undefined) {
          if (dd.JustExploded) {
            local.Crack.Position = dd.ExplosionPos;
            local.Crack.GetSprite().Play("Appear", true);
            local.Crack.Visible = true;
          }

          if (local.Crack.GetSprite().IsFinished("Appear")) {
            local.Crack.GetSprite().Play("Disappear", true);
          }

          if (local.Crack.GetSprite().IsPlaying("Disappear") && local.Crack.GetSprite().GetFrame() > 8 && local.Crack.GetSprite().GetFrame() < 11 && dd.CrackDuration === 0) {
            dd.CrackDuration = Constants.CrackDuration;
            local.Crack.GetSprite().SetFrame(11);
          }

          if (dd.CrackDuration > 0) {
            dd.CrackDuration--;
          }

          if (local.Crack.GetSprite().IsFinished("Disappear")) {
            local.Crack.Visible = false;
          }

          if (dd.CrackDuration === 0) {
            local.Crack.GetSprite().Update();
          }
        }

        if (!Game().IsPaused()) {
          dd.AimReticulePos = Game().GetRoom().GetClampedPosition(dd.AimReticulePos.add(dd.AimReticuleVelocity), 0);
        }

        if (dd.InUse) {
          local.refreshReticule();
          if (local.AimReticule !== undefined) {
            local.AimReticule.Position = dd.AimReticulePos;

            const Progress = dd.Timer / dd.MaxTimer;
            local.AimReticule.SpriteRotation = Constants.ReticuleRotationMulti * Progress;

            if (Progress < Constants.ReticuleShrinkCutoff) {
              local.AimReticule.SetColor(Color(Progress * (1 / Constants.ReticuleShrinkCutoff), 0, 0, 1, 0.2, 0, 0), Globals.INFINITY, Globals.COLOR_PRIORITY);
              local.AimReticule.GetSprite().Scale = Vector(1 - Constants.ReticuleShrinkCutoff + Progress, 1 - Constants.ReticuleShrinkCutoff + Progress);
            }
          }
        } else if (local.AimReticule !== undefined) {
          local.AimReticule.Remove();
        }

        if (local.AimReticule !== undefined && !local.AimReticule.IsDead()) {
          local.AimReticule.Visible = dd.InUse;
        }
      }
    }

    for (const knife of getKnives()) {
      const KnifeHash = GetPtrHash(knife);

      if (saved.room.ddknives.has(KnifeHash)) {
        const kdata = getOrDefault(saved.room.ddknives, KnifeHash, ManualKnifeData);
        knife.Position = knife.Position.add(kdata.Velocity);
        kdata.LifeSpan--;
        if (kdata.LifeSpan <= 0) {
          knife.Remove();
          if (!kdata.Splatted) {
            spawn(EntityType.EFFECT, EffectVariant.BLOOD_EXPLOSION, 0, knife.Position, Vector(0, 0));
            kdata.Splatted = true;
          }
        }
      }
    }
  }
}
