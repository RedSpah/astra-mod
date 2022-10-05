import { EffectVariant, EntityType } from "isaac-typescript-definitions";
import { getRandomSeed, spawn } from "isaacscript-common";
import { ConfusionConstants as Constants } from "./Constants";

export class ConfusionVolatileData {
  ChargeSprite: Sprite;
  OuterWisp: EntityEffect | undefined;
  OuterWispOffsets: Vector[];
  OuterWispDistOffsets: number[];
  OuterWispFadeawayTimer = 0;

  RepelEffect: EntityEffect | undefined;
  EyesAnim = 0;
  EyesAnimPrev = 0;

  constructor() {
    const rng = RNG();
    rng.SetSeed(getRandomSeed(), 35);
    this.ChargeSprite = Sprite();
    this.ChargeSprite.Load("gfx/ui/chargebar_confusion.anm2", true);
    this.ChargeSprite.Color = Color(1, 1, 1, 1);
    this.ChargeSprite.SetFrame("Charging", 0);

    this.OuterWispOffsets = [];
    for (let i = 0; i < Constants.WispsNum; i++) {
      this.OuterWispOffsets.push(Vector((rng.RandomFloat() - 0.5) * 6, (rng.RandomFloat() - 0.5) * 6));
    }

    this.OuterWispDistOffsets = [];
    for (let i = 0; i < Constants.WispsNum; i++) {
      if (i % 2 === 0) {
        this.OuterWispDistOffsets.push(0);
      } else {
        const RandFactor = 0; // rng.RandomFloat() ** 4;

        // const SwirlFactor = 1 - (i % (Constants.WispsNum / 4)) / (Constants.WispsNum / 4);

        this.OuterWispDistOffsets.push(RandFactor);
      }
    }

    this.refreshWisps();
    this.refreshRepel();
  }

  public refreshRepel(): void {
    if (this.RepelEffect === undefined || this.RepelEffect.IsDead()) {
      if (this.RepelEffect !== undefined) {
        this.RepelEffect.Remove();
      }

      this.RepelEffect = spawn(EntityType.EFFECT, EffectVariant.PULLING_EFFECT, 0, Vector(-100, -100)).ToEffect();
      if (this.RepelEffect !== undefined) {
        this.RepelEffect.SetTimeout(Constants.Infinity);
        this.RepelEffect.SetColor(Constants.RepelColor, Constants.Infinity, Constants.EffectColorPriority);
        this.RepelEffect.Visible = false;
      }
    }
  }

  public refreshWisps(): void {
    if (this.OuterWisp === undefined || this.OuterWisp.IsDead()) {
      if (this.OuterWisp !== undefined) {
        this.OuterWisp.Remove();
      }

      this.OuterWisp = spawn(EntityType.EFFECT, EffectVariant.ENEMY_SOUL, 0, Vector(-100, -100)).ToEffect();

      if (this.OuterWisp !== undefined) {
        this.OuterWisp.Visible = false;
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
  DischargeLockout = false;
  DischargeExplosion = false;
  DischargeTopCharge = 0;
  OuterRange = 0;
  InnerRange = 0;
}

export const locals: Map<PtrHash, ConfusionVolatileData> = new Map<PtrHash, ConfusionVolatileData>();

export const saved = {
  run: {
    conf: new Map<PtrHash, ConfusionData>()
  }
};
