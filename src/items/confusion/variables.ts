import { EffectVariant, EntityType } from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { ConfusionConstants as Constants } from "./Constants";

export class ConfusionVolatileData {
  ChargeSprite: Sprite;
  OuterWisp: EntityEffect | undefined;
  RepelEffect: EntityEffect | undefined;
  EyesAnim = 0;
  EyesAnimPrev = 0;

  constructor(player: EntityPlayer) {
    this.ChargeSprite = Sprite();
    this.ChargeSprite.Load("gfx/ui/chargebar_confusion.anm2", true);
    this.ChargeSprite.Color = Color(1, 1, 1, 1);
    this.ChargeSprite.SetFrame("Charging", 0);

    this.refreshWisps(player);
    this.refreshRepel(player);
  }

  public refreshRepel(player: EntityPlayer): void {
    if (this.RepelEffect === undefined || this.RepelEffect.IsDead()) {
      if (this.RepelEffect !== undefined) {
        this.RepelEffect.Remove();
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
        this.RepelEffect.SetColor(
          Color(0.25, 1, 1, 1, 0.25, 1, 1),
          9999999,
          999,
        );
        this.RepelEffect.FollowParent(player);
        this.RepelEffect.Visible = false;
      }
    }
  }

  public refreshWisps(player: EntityPlayer): void {
    if (this.OuterWisp === undefined || this.OuterWisp.IsDead()) {
      if (this.OuterWisp !== undefined) {
        this.OuterWisp.Remove();
      }

      this.OuterWisp = spawn(
        EntityType.EFFECT,
        EffectVariant.ENEMY_SOUL,
        0,
        player.Position,
        Vector(0, 0),
        player,
      ).ToEffect();

      if (this.OuterWisp !== undefined) {
        this.OuterWisp.Visible = false;
        this.OuterWisp.FollowParent(player);
        this.OuterWisp.SpriteScale = Vector(0.75, 0.75);
      }
    }
  }
}

export class ConfusionData {
  Timer = 0;
  MaxTimer = 0;
  ChargeProgress = 0;
  FireDelayCached = 0;
  Charging = false;
  Angle = 0;
  OuterRange = 0;
  InnerRange = 0;
}

export const locals: Map<PtrHash, ConfusionVolatileData> = new Map<
  PtrHash,
  ConfusionVolatileData
>();

export const saved = {
  run: {
    conf: new Map<PtrHash, ConfusionData>(),
  },
};
