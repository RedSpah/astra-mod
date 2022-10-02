import { Collectibles } from "../../enums/Collectibles";
import { Costumes } from "../../enums/Costumes";
import { ConfusionConstants as Constants } from "./Constants";
import {
  ConfusionData,
  ConfusionVolatileData,
  locals,
  saved,
} from "./variables";

export function ConfusionRender(player: EntityPlayer, _: Vector): void {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.CONFUSION)) {
    // Variables
    let local = locals.get(playerHash);
    if (local === undefined) {
      local = new ConfusionVolatileData(player);
      locals.set(playerHash, local);
    }

    let conf = saved.run.conf.get(playerHash);
    if (conf === undefined) {
      conf = new ConfusionData();
      saved.run.conf.set(playerHash, conf);
    }

    if (conf.Charging && !Game().IsPaused()) {
      // Variables
      const CH = conf.ChargeProgress;
      const CR = math.sqrt(conf.ChargeProgress);
      const InnerDist = conf.InnerRange * CR;

      // Speeeeen
      conf.Angle += Constants.ShotSpeedSpinMul * player.ShotSpeed;
      if (conf.Angle > math.pi * 2) {
        conf.Angle -= math.pi * 2;
      }

      // Charge Sprite
      if (conf.Timer < conf.MaxTimer) {
        local.ChargeSprite.SetFrame(
          "Charging",
          math.floor(conf.ChargeProgress * 100),
        );
      } else if (local.ChargeSprite.GetAnimation() === "Charging") {
        local.ChargeSprite.Play("StartCharged", true);
      } else if (
        (local.ChargeSprite.GetAnimation() === "StartCharged" &&
          local.ChargeSprite.IsFinished("StartCharged")) ||
        (local.ChargeSprite.GetAnimation() === "Charged" &&
          local.ChargeSprite.IsFinished("Charged"))
      ) {
        local.ChargeSprite.Play("Charged", true);
      }
      local.ChargeSprite.Render(
        Isaac.WorldToScreen(player.Position)
          .add(Vector(20, -35))
          .sub(Game().ScreenShakeOffset),
      );
      local.ChargeSprite.Update();

      // Inner VFX
      local.refreshRepel(player);
      if (local.RepelEffect !== undefined) {
        local.RepelEffect.Visible = true;
        local.RepelEffect.SpriteScale = Vector(
          InnerDist * Constants.RepelRenderMul,
          InnerDist *
            Constants.RepelRenderMul *
            Constants.RepelRenderVerticalStretch,
        );
      }

      // Wisp Ring
      local.refreshWisps(player);
      const Wisp = local.OuterWisp;
      if (Wisp !== undefined) {
        const C = Constants.OuterWispColor;
        const CorrectedDist =
          conf.OuterRange *
          math.sqrt(conf.Timer / conf.MaxTimer) *
          Constants.WispRenderDistMul;

        Wisp.Visible = true;
        Wisp.SetColor(
          Color(C.R, C.G, C.B, C.A * CH, C.RO * CR, C.GO * CR, C.BO * CR),
          Constants.Infinity,
          Constants.EffectColorPriority,
        );

        for (let i = 0; i < Constants.WispsNum; i++) {
          const Angle = conf.Angle + i * ((2 * math.pi) / Constants.WispsNum);
          Wisp.GetSprite().Render(
            Isaac.WorldToScreen(player.Position)
              .add(
                Vector(
                  CorrectedDist * math.cos(Angle),
                  CorrectedDist * math.sin(Angle),
                ),
              )
              .add(Game().ScreenShakeOffset)
              .add(Constants.WispRenderVertOffset),
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
    local.EyesAnim =
      conf.Timer === conf.MaxTimer ? 8 : math.ceil(conf.ChargeProgress * 7);

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
