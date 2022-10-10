import { EffectVariant, EntityType } from "isaac-typescript-definitions";
import { getRandomSeed, spawn } from "isaacscript-common";
import { Globals } from "../../enums/Globals";
import { DoomDesireConstants as Constants } from "./constants";

export class DoomDesireVolatileData {
  ChargeSprite: Sprite;
  AimReticule: EntityEffect | undefined;
  Crack: EntityEffect | undefined;
  CrackSprite: Sprite;
  CrackVisible: boolean;
  RNG: RNG;

  constructor() {
    this.ChargeSprite = Sprite();
    this.ChargeSprite.Load("gfx/ui/chargebar_doom_desire.anm2", true);
    this.ChargeSprite.Color = Color(1, 1, 1, 1);
    this.ChargeSprite.SetFrame("Charging", 0);

    this.CrackSprite = Sprite();
    this.CrackSprite.Load("gfx/1000.189_purgatory rift.anm2", true);
    this.CrackSprite.ReplaceSpritesheet(1, "gfx/effects/purgatory_rift.png");
    this.CrackSprite.LoadGraphics();

    this.RNG = RNG();
    this.RNG.SetSeed(getRandomSeed(), 35);

    this.CrackVisible = true;
  }

  public refreshReticule(): void {
    if (this.AimReticule === undefined || this.AimReticule.IsDead()) {
      if (this.AimReticule !== undefined) {
        this.AimReticule.Remove();
      }

      this.AimReticule = spawn(EntityType.EFFECT, EffectVariant.OCCULT_TARGET, 0, Vector(-100, -100)).ToEffect();
      if (this.AimReticule !== undefined) {
        this.AimReticule.SetTimeout(Globals.INFINITY);
        this.AimReticule.SetColor(Constants.ReticuleColor, Globals.INFINITY, Globals.COLOR_PRIORITY);
        this.AimReticule.Visible = false;
      }
    }
  }

  public refreshCrack(): void {
    if (this.Crack === undefined || this.Crack.IsDead()) {
      if (this.Crack !== undefined) {
        this.Crack.Remove();
      }

      this.Crack = spawn(EntityType.EFFECT, EffectVariant.WOMB_TELEPORT, 0, Vector(-100, -100)).ToEffect();
      if (this.Crack !== undefined) {
        this.Crack.SetTimeout(Globals.INFINITY);
        this.Crack.GetSprite().Load("gfx/1000.189_purgatory rift.anm2", true);
        this.Crack.GetSprite().ReplaceSpritesheet(1, "gfx/effects/purgatory_rift.png");
        this.Crack.GetSprite().LoadGraphics();
        this.Crack.DepthOffset = -100;
        this.Crack.Visible = false;
      }
    }
  }
}

export class DoomDesireData {
  Timer = 0;
  MaxTimer = 0;
  CD = 0;
  MaxCD = 0;
  CoolingDown = false;
  InUse = false;
  JustExploded = false;
  AimReticuleVelocity = Vector(0, 0);
  AimReticulePos = Vector(0, 0);
  ExplosionPos = Vector(0, 0);
  CrackDuration = 0;
  CrackTearCounter = 0;
  CrackSoulCounter = 0;
  CrackKnifeCounter = 0;
  CrackLaserCounter = 0;
  CrackBrimCounter = 0;
  CrackTechCounter = 0;
  CrackTechXCounter = 0;
  TearsPerFrame = 0;
}

export class ManualKnifeData {
  Velocity = Vector(0, 0);
  LifeSpan = 0;
  Splatted = false;
}

export const locals: Map<PtrHash, DoomDesireVolatileData> = new Map<PtrHash, DoomDesireVolatileData>();

export const saved = {
  run: {
    conf: new Map<PtrHash, DoomDesireData>()
  },
  room: {
    ddknives: new Map<PtrHash, ManualKnifeData>()
  }
};
