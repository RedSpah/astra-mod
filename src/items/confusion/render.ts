import { Collectibles } from "../../enums/Collectibles";
import { Costumes } from "../../enums/Costumes";
import { getOrDefault } from "../../helpers";
import { ConfusionConstants as Constants } from "./Constants";
import { ConfusionData, ConfusionVolatileData, locals, saved } from "./variables";

export function ConfusionRender(player: EntityPlayer, _: Vector): void {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    // Variables

    const conf = getOrDefault(saved.run.conf, playerHash, ConfusionData);
    const local = getOrDefault(locals, playerHash, ConfusionVolatileData);

    if (conf.ChargeProgress > 0 && !Game().IsPaused()) {
      // Variables
      const CH = conf.ChargeProgress;
      const CR = math.sqrt(conf.ChargeProgress);
      const Why = Game().ScreenShakeOffset;
      const SSh = Vector(Why.X, Why.Y);

      // Speeeeen
      conf.Angle += Constants.ShotSpeedSpinMul * player.ShotSpeed;
      if (conf.Angle > math.pi * 2) {
        conf.Angle -= math.pi * 2;
      }

      // Charge Sprite
      if (conf.ChargeProgress < 1.0) {
        local.ChargeSprite.SetFrame("Charging", math.floor(conf.ChargeProgress * 100));
      } else if (local.ChargeSprite.GetAnimation() === "Charging") {
        local.ChargeSprite.Play("StartCharged", true);
      } else if (
        (local.ChargeSprite.GetAnimation() === "StartCharged" && local.ChargeSprite.IsFinished("StartCharged")) ||
        (local.ChargeSprite.GetAnimation() === "Charged" && local.ChargeSprite.IsFinished("Charged"))
      ) {
        local.ChargeSprite.Play("Charged", true);
      }
      local.ChargeSprite.Render(Isaac.WorldToScreen(player.Position).add(Vector(20, -35)).sub(SSh));
      local.ChargeSprite.Update();

      // Inner VFX
      local.refreshRepel();
      if (local.RepelEffect !== undefined) {
        local.RepelEffect.FollowParent(player);
        local.RepelEffect.Visible = true;
        if (conf.DischargeExplosion) {
          local.RepelEffect.SpriteScale = Vector(
            conf.InnerRange * math.sqrt(conf.DischargeTopCharge) * (2 - math.sqrt(conf.ChargeProgress)) * Constants.RepelRenderMul,
            conf.InnerRange * math.sqrt(conf.DischargeTopCharge) * (2 - math.sqrt(conf.ChargeProgress)) * Constants.RepelRenderMul * Constants.RepelRenderVerticalStretch
          );
          const C = Constants.RepelColor;
          local.RepelEffect.SetColor(Color(C.R, C.G, C.G, C.A * math.sqrt(conf.ChargeProgress), C.RO, C.GO, C.BO), Constants.Infinity, Constants.EffectColorPriority);
        } else {
          local.RepelEffect.SetColor(Constants.RepelColor, Constants.Infinity, Constants.EffectColorPriority);
          local.RepelEffect.SpriteScale = Vector(
            conf.InnerRange * math.sqrt(conf.ChargeProgress) * Constants.RepelRenderMul,
            conf.InnerRange * math.sqrt(conf.ChargeProgress) * Constants.RepelRenderMul * Constants.RepelRenderVerticalStretch
          );
        }
      }

      // Wisp Ring
      local.refreshWisps();
      const Wisp = local.OuterWisp;
      if (Wisp !== undefined) {
        const C = Constants.OuterWispColor;
        let CorrectedDist = 0;

        if (conf.DischargeExplosion) {
          CorrectedDist = conf.OuterRange * math.sqrt(conf.DischargeTopCharge + (1 - conf.ChargeProgress));
        } else {
          CorrectedDist = conf.OuterRange * math.sqrt(conf.ChargeProgress) * Constants.WispRenderDistMul;
        }

        Wisp.Visible = true;
        Wisp.SetColor(Color(C.R, C.G, C.B, C.A * CH * CH, C.RO * CR, C.GO * CR, C.BO * CR), Constants.Infinity, Constants.EffectColorPriority);

        for (let i = 0; i < Constants.WispsNum; i++) {
          const Angle = conf.Angle + i * ((2 * math.pi) / Constants.WispsNum);
          let WispDist = local.OuterWispDistOffsets[i];
          if (WispDist === undefined) {
            WispDist = 0;
          }

          const FinalDist = CorrectedDist * (1 - WispDist);

          let WispOffset = local.OuterWispOffsets[i];
          if (WispOffset === undefined) {
            WispOffset = Vector(0, 0);
          }

          Wisp.GetSprite().Render(
            Isaac.WorldToScreen(player.Position)
              .add(Vector(FinalDist * math.cos(Angle), FinalDist * math.sin(Angle)))
              .add(SSh)
              .add(Constants.WispRenderVertOffset)
              .add(WispOffset.mul(conf.ChargeProgress))
          );
        }
      }
    } else if (!conf.Charging) {
      if (local.RepelEffect !== undefined) {
        local.RepelEffect.Visible = false;
      }

      if (local.OuterWisp !== undefined) {
        local.OuterWisp.Visible = false;
      }
    }

    // Glowy Eyes
    local.EyesAnimPrev = local.EyesAnim;

    // TODO: ADD PURITY EFFECT HERE
    local.EyesAnim = conf.Timer === conf.MaxTimer ? 8 : math.ceil(conf.ChargeProgress * 7);

    if (local.EyesAnim !== local.EyesAnimPrev) {
      Costumes.CONF_CHARGE_ANIM.forEach((x) => player.TryRemoveNullCostume(x));
      if (local.EyesAnim !== 0) {
        const Costume = Costumes.CONF_CHARGE_ANIM[local.EyesAnim - 1];
        if (Costume !== undefined) {
          player.AddNullCostume(Costume);
        }
      }
    }
  }
}
