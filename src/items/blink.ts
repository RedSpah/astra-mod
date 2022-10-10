import { ActiveSlot, ButtonAction, CollectibleType, EffectVariant, EntityType, InputHook, ModCallback, PlayerItemAnimation, SoundEffect, UseFlag } from "isaac-typescript-definitions";
import { getPlayers, hasFlag, ModUpgraded, saveDataManager, saveDataManagerRegisterClass, spawn } from "isaacscript-common";
import { Collectibles } from "../enums/Collectibles";
import { Globals } from "../enums/Globals";
import { getFireVector, getOrDefault } from "../helpers";

const Constants = {
  ReticuleMoveSpeed: 8,
  BlinkCD: 150,
  TPUpDelay: 10,
  TPControlCD: 20,
  TPPostControlCD: 19,
  ReticuleStillSlowMul: 0.5
} as const;

export class BlinkVolatileData {
  AimReticule: EntityEffect | undefined;

  public refreshReticule(): void {
    if (this.AimReticule === undefined || this.AimReticule.IsDead()) {
      if (this.AimReticule !== undefined) {
        this.AimReticule.Remove();
      }

      this.AimReticule = spawn(EntityType.EFFECT, EffectVariant.OCCULT_TARGET, 2, Vector(-100, -100)).ToEffect();

      if (this.AimReticule !== undefined) {
        this.AimReticule.SetTimeout(1000000);
        this.AimReticule.Visible = false;
        this.AimReticule.SetColor(Color(0, 1, 1, 1, 0, 1, 1), Globals.INFINITY, Globals.COLOR_PRIORITY);
      }
    }
  }
}

export class BlinkData {
  InUse = false;
  TPDelay = -1;
  TPDest = Vector(0, 0);
  Slot = ActiveSlot.PRIMARY;
  TPDownFrame = 0;
  ButtonLock = false;
  AimReticuleVelocity = Vector(0, 0);
  AimReticulePos = Vector(0, 0);
}

export const locals: Map<PtrHash, BlinkVolatileData> = new Map<PtrHash, BlinkVolatileData>();

export const saved = {
  run: {
    conf: new Map<PtrHash, BlinkData>()
  }
};

export function blinkInit(mod: ModUpgraded): void {
  saveDataManager("astra.blink", saved);
  saveDataManagerRegisterClass(BlinkData);
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, BlinkProcess);
  mod.AddCallback(ModCallback.POST_RENDER, Blink60FPSProcess);
  mod.AddCallback(ModCallback.PRE_USE_ITEM, BlinkUse, Collectibles.BLINK);
  mod.AddCallback(ModCallback.INPUT_ACTION, BlinkUseInputBlock);
}

function BlinkProcess(player: EntityPlayer) {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(Collectibles.BLINK)) {
    const blink = getOrDefault(saved.run.conf, playerHash, BlinkData);

    if (blink.InUse) {
      // Resetting the charge in case you get damaged out of using Blink
      if (!player.IsHoldingItem()) {
        blink.InUse = false;
        player.SetActiveCharge(Constants.BlinkCD, blink.Slot);
      }

      const Speed = player.ShotSpeed * Constants.ReticuleMoveSpeed;
      const MoveVec = getFireVector(player);

      if (MoveVec.X === 0 && MoveVec.Y === 0) {
        blink.AimReticuleVelocity = blink.AimReticuleVelocity.mul(Constants.ReticuleStillSlowMul);
      } else {
        blink.AimReticuleVelocity = blink.AimReticuleVelocity.Normalized().mul(0.25).add(MoveVec.mul(0.75)).Normalized().mul(Speed);
      }

      if (
        !blink.ButtonLock &&
        ((Input.IsActionPressed(ButtonAction.ITEM, player.ControllerIndex) && blink.Slot === ActiveSlot.PRIMARY) ||
          (Input.IsActionPressed(ButtonAction.PILL_CARD, player.ControllerIndex) && blink.Slot === ActiveSlot.POCKET))
      ) {
        blink.TPDest = blink.AimReticulePos;
        blink.TPDelay = Constants.TPUpDelay;

        blink.InUse = false;

        player.AddControlsCooldown(Constants.TPControlCD);
        player.PlayExtraAnimation("TeleportUp");
        SFXManager().Play(SoundEffect.HELL_PORTAL_1);
      }

      // Locking the item from instantly activating
      if (
        (blink.ButtonLock && !Input.IsActionPressed(ButtonAction.ITEM, player.ControllerIndex) && blink.Slot === ActiveSlot.PRIMARY) ||
        (!Input.IsActionPressed(ButtonAction.PILL_CARD, player.ControllerIndex) && blink.Slot === ActiveSlot.POCKET)
      ) {
        blink.ButtonLock = false;
      }
    }

    // Yeet
    if (blink.TPDelay === 0) {
      SFXManager().Play(SoundEffect.HELL_PORTAL_2);
      player.Position = Game().GetRoom().FindFreeTilePosition(blink.TPDest, 0);
      player.GetSprite().Play("TeleportDown", true);
      player.AddControlsCooldown(Constants.TPPostControlCD);
      blink.TPDelay = -1;
    } else if (blink.TPDelay > 0) {
      blink.TPDelay = math.max(0, blink.TPDelay - 1);
    }
  }
}

// Code for activating the initial item
function BlinkUse(_: CollectibleType, __: RNG, player: EntityPlayer, useFlags: BitFlags<UseFlag>, slot: ActiveSlot) {
  if (!hasFlag(useFlags, UseFlag.MIMIC, UseFlag.CAR_BATTERY, UseFlag.VOID)) {
    const playerHash = GetPtrHash(player);
    const blink = getOrDefault(saved.run.conf, playerHash, BlinkData);
    const local = getOrDefault(locals, playerHash, BlinkVolatileData);

    if (!blink.InUse && blink.TPDelay === -1) {
      local.refreshReticule();
      if (local.AimReticule !== undefined) {
        blink.AimReticulePos = player.Position;
        blink.AimReticuleVelocity = Vector(0, 0);
        local.AimReticule.Visible = true;
        player.AnimateCollectible(Collectibles.BLINK, PlayerItemAnimation.LIFT_ITEM);

        blink.InUse = true;
        blink.ButtonLock = true;
        blink.Slot = slot;
      }
    }
  }

  return false;
}

// Input blocking used to prevent using other items while using Blink
function BlinkUseInputBlock(entity: Entity | undefined, _: InputHook, button: ButtonAction): boolean | undefined {
  if (entity !== undefined && entity.Type === EntityType.PLAYER) {
    const player = entity.ToPlayer();
    if (player !== undefined) {
      const blink = getOrDefault(saved.run.conf, GetPtrHash(player), BlinkData);
      if (blink.InUse) {
        if (button === ButtonAction.ITEM && blink.Slot === ActiveSlot.POCKET) {
          return false;
        }
        if (button === ButtonAction.PILL_CARD && blink.Slot === ActiveSlot.PRIMARY) {
          return false;
        }
      }
    }
  }
  return undefined;
}

function Blink60FPSProcess() {
  if (!Game().IsPaused()) {
    for (const player of getPlayers()) {
      const playerHash = GetPtrHash(player);

      if (player.HasCollectible(Collectibles.BLINK)) {
        const blink = getOrDefault(saved.run.conf, playerHash, BlinkData);
        const local = getOrDefault(locals, playerHash, BlinkVolatileData);
        if (blink.InUse) {
          local.refreshReticule();
          if (local.AimReticule !== undefined) {
            blink.AimReticulePos = Game().GetRoom().GetClampedPosition(blink.AimReticulePos.add(blink.AimReticuleVelocity), 0);
            local.AimReticule.Position = blink.AimReticulePos;
          }
        } else if (local.AimReticule !== undefined) {
          local.AimReticule.Remove();
        }

        if (local.AimReticule !== undefined && !local.AimReticule.IsDead()) {
          local.AimReticule.Visible = blink.InUse;
        }
      }
    }
  }
}
