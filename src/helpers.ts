import { ButtonAction, CollectibleType, PlayerForm } from "isaac-typescript-definitions";
import { getPlayerCollectibleCount, getPlayerTransformations } from "isaacscript-common";

export function getOrDefault<T, K>(map: Map<K, T>, key: K, __type: new () => T): T {
  let ret = map.get(key);
  if (ret === undefined) {
    ret = new __type();
    map.set(key, ret);
  }
  return ret;
}

export function getFireVector(player: EntityPlayer): Vector {
  let MoveVec = Vector(0, 0);
  if (Input.IsActionPressed(ButtonAction.SHOOT_DOWN, player.ControllerIndex)) {
    MoveVec = MoveVec.add(Vector(0, 1));
  }
  if (Input.IsActionPressed(ButtonAction.SHOOT_LEFT, player.ControllerIndex)) {
    MoveVec = MoveVec.add(Vector(-1, 0));
  }
  if (Input.IsActionPressed(ButtonAction.SHOOT_RIGHT, player.ControllerIndex)) {
    MoveVec = MoveVec.add(Vector(1, 0));
  }
  if (Input.IsActionPressed(ButtonAction.SHOOT_UP, player.ControllerIndex)) {
    MoveVec = MoveVec.add(Vector(0, -1));
  }
  return MoveVec.Normalized();
}

export function getApproxNumTears(player: EntityPlayer): number {
  let num = 1;
  num += getPlayerCollectibleCount(player, CollectibleType.TWENTY_TWENTY, CollectibleType.WIZ);
  num += getPlayerCollectibleCount(player, CollectibleType.INNER_EYE) * 2;
  num += getPlayerCollectibleCount(player, CollectibleType.MUTANT_SPIDER) * 3;
  num += getPlayerCollectibleCount(player, CollectibleType.MONSTROS_LUNG) * 14;

  if (getPlayerTransformations(player).has(PlayerForm.CONJOINED)) {
    num += 2;
  }

  return num;
}

export function rollRange(min: number, max: number, rng: RNG = RNG()): number {
  return min + rng.RandomFloat() * (max - min);
}
