import { ActiveSlot, ButtonAction, CollectibleType, EffectVariant, EntityType, InputHook, ModCallback, PlayerItemAnimation, UseFlag } from "isaac-typescript-definitions";
import { hasFlag, ModUpgraded, saveDataManager, saveDataManagerRegisterClass, spawn } from "isaacscript-common";
import { Collectibles } from "../enums/Collectibles";
import { getOrDefault } from "../helpers";

const Constants = {
  ReticuleMoveSpeed: 13,
  BlinkCD: 150,
  TPUpDelay: 10,
  TPControlCD: 20,
  TPPostControlCD: 19
} as const;

export class BlinkVolatileData {
  AimReticule: EntityEffect | undefined;

  constructor(player: EntityPlayer) {
    // his.refreshReticule(player);
  }

  public refreshReticule(player: EntityPlayer): void {
    if (this.AimReticule === undefined || this.AimReticule.IsDead()) {
      if (this.AimReticule !== undefined) {
        this.AimReticule.Remove();
      }

      this.AimReticule = spawn(EntityType.EFFECT, EffectVariant.TARGET, 2, Vector(-100, -100)).ToEffect();

      if (this.AimReticule !== undefined) {
        this.AimReticule.SetTimeout(1000000);
        this.AimReticule.Visible = false;
        this.AimReticule.SetColor(Color(0, 1, 1, 1, 0, 1, 1), 1000000, 99);
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

  constructor() {}
}

export const locals: Map<PtrHash, BlinkVolatileData> = new Map<PtrHash, BlinkVolatileData>();

export const saved = {
  run: {
    conf: new Map<PtrHash, BlinkData>()
  }
};

export function blinkInit(_: ModUpgraded, modVanilla: Mod): void {
  saveDataManager("astra.blink", saved);
  saveDataManagerRegisterClass(BlinkData);
  modVanilla.AddCallback(ModCallback.POST_PEFFECT_UPDATE, BlinkProcess);
  modVanilla.AddCallback(ModCallback.PRE_USE_ITEM, BlinkUse, Collectibles.BLINK);
  modVanilla.AddCallback(ModCallback.INPUT_ACTION, BlinkUseInputBlock);
}

function BlinkProcess(player: EntityPlayer) {
  const playerHash = GetPtrHash(player);

  const blink = getOrDefault(saved.run.conf, playerHash, BlinkData);
  const local = getOrDefault(locals, playerHash, BlinkVolatileData, player);

  if (blink.InUse) {
    // Resetting the charge in case you get damaged out of using Blink
    if (!player.IsHoldingItem()) {
      blink.InUse = false;
      player.SetActiveCharge(Constants.BlinkCD, blink.Slot);
    }

    local.refreshReticule(player);
    if (local.AimReticule !== undefined) {
      local.AimReticule.Visible = true;
      let MoveVec = Vector(0, 0);
      const Speed = player.ShotSpeed * Constants.ReticuleMoveSpeed;
      if (Input.IsActionPressed(ButtonAction.SHOOT_DOWN, player.ControllerIndex)) {
        MoveVec = MoveVec.add(Vector(0, Speed));
      }
      if (Input.IsActionPressed(ButtonAction.SHOOT_LEFT, player.ControllerIndex)) {
        MoveVec = MoveVec.add(Vector(-Speed, 0));
      }
      if (Input.IsActionPressed(ButtonAction.SHOOT_RIGHT, player.ControllerIndex)) {
        MoveVec = MoveVec.add(Vector(Speed, 0));
      }
      if (Input.IsActionPressed(ButtonAction.SHOOT_UP, player.ControllerIndex)) {
        MoveVec = MoveVec.add(Vector(0, -Speed));
      }
      local.AimReticule.Position = Game().GetRoom().GetClampedPosition(local.AimReticule.Position.add(MoveVec), 0);

      if (
        !blink.ButtonLock &&
        ((Input.IsActionPressed(ButtonAction.ITEM, player.ControllerIndex) && blink.Slot === ActiveSlot.PRIMARY) ||
          (Input.IsActionPressed(ButtonAction.PILL_CARD, player.ControllerIndex) && blink.Slot === ActiveSlot.POCKET))
      ) {
        blink.TPDest = local.AimReticule.Position;
        blink.TPDelay = Constants.TPUpDelay;

        local.AimReticule.Remove();
        local.AimReticule = undefined;
        blink.InUse = false;

        player.AddControlsCooldown(Constants.TPControlCD);
        player.PlayExtraAnimation("TeleportUp");
      }
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
    player.Position = Game().GetRoom().FindFreeTilePosition(blink.TPDest, 0);
    player.GetSprite().Play("TeleportDown", true);
    player.AddControlsCooldown(Constants.TPPostControlCD);
    blink.TPDelay = -1;
  } else if (blink.TPDelay > 0) {
    blink.TPDelay = math.max(0, blink.TPDelay - 1);
  }
}

// Code for activating the initial item
function BlinkUse(_: CollectibleType, __: RNG, player: EntityPlayer, useFlags: BitFlags<UseFlag>, slot: ActiveSlot) {
  if (!hasFlag(useFlags, UseFlag.MIMIC, UseFlag.CAR_BATTERY, UseFlag.VOID)) {
    const playerHash = GetPtrHash(player);
    const blink = getOrDefault(saved.run.conf, playerHash, BlinkData);
    const local = getOrDefault(locals, playerHash, BlinkVolatileData, player);

    if (!blink.InUse && blink.TPDelay === -1) {
      local.refreshReticule(player);
      if (local.AimReticule !== undefined) {
        local.AimReticule.Position = player.Position;
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
function BlinkUseInputBlock(entity: Entity | undefined, ihook: InputHook, button: ButtonAction): boolean | undefined {
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
