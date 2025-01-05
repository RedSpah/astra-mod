import { ActiveSlot, EffectVariant, EntityType, PlayerVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { CollectibleCustom } from "../enums/CollectibleCustom";
import { Costumes } from "../enums/Costumes";
import { Globals } from "../enums/Globals";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { getOrDefault } from "../helpers";
import { mod, modRNG } from "../mod";
import { evaluateCacheInit } from "./evaluateCache";
import { heartbrokenInit } from "./heartbroken";
import { impurityInit } from "./impurity";
import { purityInit } from "./purity";
import { saved, ShinyData, shinySkinInit } from "./shinySkin";
import { tAstraDripInit } from "./tastraDrip";

export function initCallbacks(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initAstra, PlayerVariant.PLAYER, PlayerTypeCustom.ASTRA);
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initAstraB, PlayerVariant.PLAYER, PlayerTypeCustom.ASTRA_B);
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initDaniel, PlayerVariant.PLAYER, PlayerTypeCustom.DANIEL);
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initDanielB, PlayerVariant.PLAYER, PlayerTypeCustom.DANIEL_B);
  evaluateCacheInit();
  purityInit();
  impurityInit();
  heartbrokenInit();
  tAstraDripInit();
  shinySkinInit();
}

export function initAstra(player: EntityPlayer): void {
  const shiny = modRNG.RandomInt(Globals.SHINY_ODDS) === 0;
  const shinySave = getOrDefault(saved.run.shiny, GetPtrHash(player), ShinyData);

  if (shiny) {
    shinySave.Shiny = true;
    player.AddNullCostume(Costumes.ASTRA_HAIR_SHINY);
    player.AddNullCostume(Costumes.ASTRA_BODY_SHINY);
    const fireworks = Isaac.Spawn(EntityType.EFFECT, EffectVariant.FIREWORKS, 0, player.Position, Vector(0, 0), player);
    fireworks.ToEffect()?.SetTimeout(100);
  } else {
    player.AddNullCostume(Costumes.ASTRA_SIDE_HAIR);
  }

  player.AddCollectible(CollectibleCustom.CONFUSION, 0, false);
  player.SetPocketActiveItem(CollectibleCustom.BLINK, ActiveSlot.POCKET, false);
}

export function initAstraB(player: EntityPlayer): void {
  const shiny = modRNG.RandomInt(Globals.SHINY_ODDS) === 0;
  const shinySave = getOrDefault(saved.run.shiny, GetPtrHash(player), ShinyData);

  if (shiny) {
    shinySave.Shiny = true;
    player.AddNullCostume(Costumes.ASTRA_B_HAIR_SHINY);
    player.AddNullCostume(Costumes.ASTRA_B_BODY_SHINY);
    const fireworks = Isaac.Spawn(EntityType.EFFECT, EffectVariant.FIREWORKS, 0, player.Position, Vector(0, 0), player);
    fireworks.ToEffect()?.SetTimeout(100);
  } else {
    player.AddNullCostume(Costumes.ASTRA_B_SIDE_HAIR);
  }

  player.AddCollectible(CollectibleCustom.DOOM_DESIRE, 0, false);
  player.SetPocketActiveItem(CollectibleCustom.FRUSTRATION, ActiveSlot.POCKET, false);
}

export function initDaniel(player: EntityPlayer): void {
  const shiny = modRNG.RandomInt(Globals.SHINY_ODDS) === 0;
  const shinySave = getOrDefault(saved.run.shiny, GetPtrHash(player), ShinyData);

  if (shiny) {
    shinySave.Shiny = true;
    player.AddNullCostume(Costumes.DANIEL_EARS_SHINY);
    const fireworks = Isaac.Spawn(EntityType.EFFECT, EffectVariant.FIREWORKS, 0, player.Position, Vector(0, 0), player);
    fireworks.ToEffect()?.SetTimeout(100);
  } else {
    player.AddNullCostume(Costumes.DANIEL_EARS);
  }
  player.AddNullCostume(Costumes.DANIEL_MANE);

  player.AddCollectible(CollectibleCustom.HYPNOS_PENDULUM, 0, false);
  player.AddCollectible(CollectibleCustom.PSIONIC_PERSUASION, 6, false);
}

export function initDanielB(player: EntityPlayer): void {
  const shiny = modRNG.RandomInt(Globals.SHINY_ODDS) === 0;
  const shinySave = getOrDefault(saved.run.shiny, GetPtrHash(player), ShinyData);

  if (shiny) {
    shinySave.Shiny = true;
    player.AddNullCostume(Costumes.DANIEL_B_EARS_SHINY);
    const fireworks = Isaac.Spawn(EntityType.EFFECT, EffectVariant.FIREWORKS, 0, player.Position, Vector(0, 0), player);
    fireworks.ToEffect()?.SetTimeout(100);
  } else {
    player.AddNullCostume(Costumes.DANIEL_B_EARS);
  }
  player.AddNullCostume(Costumes.DANIEL_B_MANE);

  player.AddCollectible(CollectibleCustom.DREAM_EATER, 0, false);
  player.AddCollectible(CollectibleCustom.WISHMAKER_PENDANT, 2, false);
  player.SetPocketActiveItem(CollectibleCustom.TARNISHED_LOCKET_2, ActiveSlot.POCKET, false);
}
