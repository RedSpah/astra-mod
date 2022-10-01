import {
  DamageFlag,
  Direction,
  EffectVariant,
  EntityPartition,
  EntityType,
  ModCallback,
  SoundEffect,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  hasFlag,
  ModUpgraded,
  saveDataManager,
  spawn,
} from "isaacscript-common";
import { Collectibles } from "../enums/Collectibles";
import { Costumes } from "../enums/Costumes";

const Constants = {
  DamageMul: 12,
  AuraDamageMul: 1 / 12,
  TimerBase: 30,
  TimerFireDelayMul: 3,
  ShotSpeedSpinMul: 0.21,
  OuterRangeMul: -50,
  InnerRangeMul: -20,
  OuterWispsNum: 12,
  InnerWispsNum: 6,
  Infinity: 2137 * 2137,
  ChargedAnimLen: 11,
  MaxColorIntensity: 0.25,
  SlowingFactor: 0.001,
  MaxSlowdownProgress: 0.66,
  ExplosionCutoff: 0.5,
  PushForce: 70,
  EffectMaxLength: 200,
} as const;

class ConfusionData {
  Timer = 0;
  TimerMax = 0;
  EyesAnim = 0;
  EyesAnimPrev = 0;
  AnimGuard = 0;
  AnimLock = 0;
  Charging = false;
  Angle = 0;
  AngleRotSpeed = 0;
  Range = 0;
  InnerRange = 0;
}

class ConfusionVolatileData {
  ChargeSprite: Sprite;
  OuterWisps: EntityEffect[];
  InnerWisps: EntityEffect[];
  RepelEffect: EntityEffect | undefined;

  constructor(player: EntityPlayer) {
    this.ChargeSprite = Sprite();
    this.ChargeSprite.Load("gfx/ui/chargebar_confusion.anm2", true);
    this.ChargeSprite.Color = Color(1, 1, 1, 1);
    this.ChargeSprite.SetFrame("Charging", 0);

    this.OuterWisps = [];
    this.InnerWisps = [];

    for (let i = 0; i < Constants.OuterWispsNum; i++) {
      const newWisp = spawn(
        EntityType.EFFECT,
        EffectVariant.ENEMY_SOUL,
        0,
        player.Position,
        Vector(0, 0),
        player,
      ).ToEffect();

      if (newWisp !== undefined) {
        newWisp.SetColor(
          Color(0.1, 0.5, 0.5, 1, 0.02, 0.1, 0.1),
          9999999,
          99,
          false,
          false,
        );
        newWisp.Visible = false;
        this.OuterWisps.push(newWisp);
      }
    }

    for (let i = 0; i < Constants.InnerWispsNum; i++) {
      const newWisp = spawn(
        EntityType.EFFECT,
        EffectVariant.ENEMY_SOUL,
        0,
        player.Position,
        Vector(0, 0),
        player,
      ).ToEffect();

      if (newWisp !== undefined) {
        newWisp.SetColor(
          Color(0.2, 0.9, 0.9, 1, 0.12, 0.6, 0.6),
          9999999,
          99,
          false,
          false,
        );
        newWisp.Visible = false;
        this.InnerWisps.push(newWisp);
      }
    }

    this.RepelEffect = spawn(
      EntityType.EFFECT,
      EffectVariant.PULLING_EFFECT,
      0,
      player.Position,
      Vector(0, 0),
      player,
    ).ToEffect();
    if (this.RepelEffect !== undefined) {
      this.RepelEffect.SetTimeout(Constants.Infinity);
      this.RepelEffect.FollowParent(player);
      this.RepelEffect.Visible = false;
    }
  }
}

const locals: Map<PtrHash, ConfusionVolatileData> = new Map<
  PtrHash,
  ConfusionVolatileData
>();

const v = {
  run: {
    conf: new Map<PtrHash, ConfusionData>(),
  },
};

export function confusionInit(_: ModUpgraded, modVanilla: Mod): void {
  saveDataManager("astra.confusion", v);
  modVanilla.AddCallback(ModCallback.POST_PEFFECT_UPDATE, ConfusionCharge);
  modVanilla.AddCallback(ModCallback.POST_PLAYER_RENDER, ConfusionRender);
}

function ConfusionCharge(player: EntityPlayer) {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    // Variable setup
    let local = locals.get(playerHash);
    if (local === undefined) {
      local = new ConfusionVolatileData(player);
      locals.set(playerHash, local);
    }

    let conf = v.run.conf.get(playerHash);
    if (conf === undefined) {
      conf = new ConfusionData();
      v.run.conf.set(playerHash, conf);
    }

    // Setting pseudo consts
    conf.TimerMax =
      Constants.TimerBase + Constants.TimerFireDelayMul * player.MaxFireDelay;
    conf.AngleRotSpeed = Constants.ShotSpeedSpinMul * player.ShotSpeed;

    // Epiphora fix
    conf.Timer = math.min(conf.Timer, conf.TimerMax);

    const ChargeProgress = conf.Timer / conf.TimerMax;

    // Charging detection
    if (
      player.GetFireDirection() !== Direction.NO_DIRECTION &&
      !player.IsHoldingItem() &&
      conf.Timer < conf.TimerMax
    ) {
      conf.Timer++;
      local.ChargeSprite.SetFrame("Charging", math.floor(ChargeProgress * 100));
      conf.Charging = true;
    }

    // Effects during Charging
    if (conf.Charging) {
      /// VFX
      // Passively rotating
      conf.Angle += conf.AngleRotSpeed;
      if (conf.Angle > math.pi * 2) {
        conf.Angle -= math.pi * 2;
      }

      // Speeeeeen
      const CurDist = conf.Range * ChargeProgress;
      const CurDistInner = conf.InnerRange * ChargeProgress;
      const CAngle = conf.Angle;

      // Outer
      local.OuterWisps.forEach((wisp, i) => {
        wisp.Visible = true;
        wisp.Position = Vector(
          player.Position.X +
            CurDist *
              math.cos(CAngle + i * ((2 * math.pi) / Constants.OuterWispsNum)),
          player.Position.Y +
            CurDist *
              math.sin(CAngle + i * ((2 * math.pi) / Constants.OuterWispsNum)),
        );
      });

      // Inner
      local.InnerWisps.forEach((wisp, i) => {
        wisp.Visible = true;
        wisp.Position = Vector(
          player.Position.X +
            CurDistInner *
              math.cos(
                2 * math.pi -
                  CAngle +
                  i * ((2 * math.pi) / Constants.InnerWispsNum),
              ),
          player.Position.Y +
            CurDistInner *
              math.sin(
                2 * math.pi -
                  CAngle +
                  i * ((2 * math.pi) / Constants.InnerWispsNum),
              ),
        );
      });

      // Charge sprite finished
      if (conf.Timer === conf.TimerMax) {
        if (local.ChargeSprite.GetAnimation() === "Charging") {
          local.ChargeSprite.Play("StartCharged", true);
        }

        if (
          (local.ChargeSprite.GetAnimation() === "StartCharged" &&
            local.ChargeSprite.IsFinished("StartCharged")) ||
          (local.ChargeSprite.GetAnimation() === "Charged" &&
            local.ChargeSprite.IsFinished("Charged"))
        ) {
          local.ChargeSprite.Play("Charged", true);
        }
      }

      /// AoE
      // Outer
      const nearEnemies = Isaac.FindInRadius(
        player.Position,
        CurDist,
        EntityPartition.ENEMY,
      );

      nearEnemies.forEach((x) => {
        if (Game().GetFrameCount() % 5 === 0) {
          x.TakeDamage(
            player.Damage * Constants.AuraDamageMul,
            DamageFlag.NO_MODIFIERS,
            EntityRef(player),
            0,
          );
        }
      });

      // Inner
      const nearEnemiesInner = Isaac.FindInRadius(
        player.Position,
        CurDistInner,
        EntityPartition.ENEMY,
      );

      nearEnemiesInner.forEach((x) => {
        const dist = x.Position.Distance(player.Position);
        const colorIntensity = math.min(
          Constants.MaxColorIntensity,
          ((ChargeProgress / 2) * dist) / CurDistInner,
        );
        const force =
          ((CurDistInner - dist) / CurDistInner) *
          Constants.SlowingFactor *
          math.min(ChargeProgress, Constants.MaxSlowdownProgress);

        x.AddSlowing(
          EntityRef(player),
          2,
          force,
          Color(0.25, 1, 1, 1, colorIntensity, colorIntensity, colorIntensity),
        );
      });

      /// Fire!
      if (
        player.GetFireDirection() === Direction.NO_DIRECTION &&
        !player.IsHoldingItem() &&
        conf.Timer > 0
      ) {
        if (ChargeProgress > Constants.ExplosionCutoff) {
          // SFX
          if (conf.Timer === conf.TimerMax) {
            SFXManager().Play(SoundEffect.ANGEL_BEAM, 1, 0, false, 1);
          } else {
            SFXManager().Play(SoundEffect.LIGHT_BOLT, 1, 0, false, 1);
          }

          spawn(EntityType.EFFECT, EffectVariant.IMPACT, 0, player.Position);

          nearEnemiesInner.forEach((x) => {
            const dirVector = Vector(
              x.Position.X - player.Position.X,
              x.Position.Y - player.Position.Y,
            ).Normalized();
            x.AddVelocity(dirVector.mul(Constants.PushForce));
            spawn(EntityType.EFFECT, EffectVariant.RIPPLE_POOF, 0, x.Position);
            spawn(
              EntityType.EFFECT,
              EffectVariant.TEAR_POOF_SMALL,
              0,
              x.Position,
            );
          });

          nearEnemies.forEach((x) => {
            const dist = x.Position.Distance(player.Position);
            const force = ((CurDist - dist) / CurDist) * ChargeProgress;

            x.TakeDamage(
              force * Constants.DamageMul * player.Damage,
              DamageFlag.NO_MODIFIERS,
              EntityRef(player),
              0,
            );

            if (hasFlag(player.TearFlags, TearFlag.BURN)) {
              x.AddBurn(
                EntityRef(player),
                Constants.EffectMaxLength * force,
                player.Damage,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.SLOW)) {
              x.AddSlowing(
                EntityRef(player),
                Constants.EffectMaxLength * force,
                force,
                Color(0.25, 1, 1, 1, 0.25, 0.25, 0.25),
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.CHARM)) {
              x.AddCharmed(
                EntityRef(player),
                Constants.EffectMaxLength * force,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.CONFUSION)) {
              x.AddConfusion(
                EntityRef(player),
                Constants.EffectMaxLength * force,
                true,
              );
            }

            if (hasFlag(player.TearFlags, TearFlag.FREEZE)) {
              x.AddFreeze(
                EntityRef(player),
                Constants.EffectMaxLength * force * force,
              );
            }

            x.AddConfusion(
              EntityRef(player),
              Constants.EffectMaxLength * math.sqrt(force),
              false,
            );
          });
        }

        conf.Timer = 0;
        conf.Charging = false;
        local.OuterWisps.forEach((wisp) => {
          wisp.Visible = false;
        });
        local.InnerWisps.forEach((wisp) => {
          wisp.Visible = false;
        });
        if (local.RepelEffect !== undefined) {
          local.RepelEffect.Visible = false;
        }
      }
    }

    conf.EyesAnimPrev = conf.EyesAnim;

    // TODO: ADD PURITY EFFECT HERE
    // glowy eyes state
    conf.EyesAnim =
      conf.Timer === 0
        ? 0
        : conf.Timer === conf.TimerMax
        ? 8
        : math.ceil(ChargeProgress * 7);
  }
}

function ConfusionRender(player: EntityPlayer, _: Vector) {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    let local = locals.get(playerHash);
    if (local === undefined) {
      local = new ConfusionVolatileData(player);
      locals.set(playerHash, local);
    }

    let conf = v.run.conf.get(playerHash);
    if (conf === undefined) {
      conf = new ConfusionData();
      v.run.conf.set(playerHash, conf);
    }

    if (conf.Charging && !Game().IsPaused()) {
      local.ChargeSprite.Render(
        Isaac.WorldToScreen(player.Position)
          .add(Vector(20, -35))
          .sub(Game().ScreenShakeOffset),
      );
      local.ChargeSprite.Update();
    }

    if (conf.EyesAnim !== conf.EyesAnimPrev) {
      Costumes.CONF_CHARGE_ANIM.forEach((x) => player.TryRemoveNullCostume(x));
      if (conf.EyesAnim !== 0) {
        const costume = Costumes.CONF_CHARGE_ANIM[conf.EyesAnim - 1];
        if (costume !== undefined) {
          player.AddNullCostume(costume);
        }
      }
    }
  }
}
