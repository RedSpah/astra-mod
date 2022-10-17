import { ActiveSlot, EffectVariant, EntityType, PlayerVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { CollectibleCustom } from "../enums/Collectibles";
import { Costumes } from "../enums/Costumes";
import { Globals } from "../enums/Globals";
import { PlayerTypeCustom } from "../enums/PlayerTypes";
import { mod, modRNG } from "../mod";
import { evaluateCacheInit } from "./evaluateCache";
import { heartbrokenInit } from "./heartbroken";
import { impurityInit } from "./impurity";
import { purityInit } from "./purity";
import { tAstraDripInit } from "./tastraDrip";

export function initCallbacks(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initAstra, PlayerVariant.PLAYER, PlayerTypeCustom.ASTRA);
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initAstraB, PlayerVariant.PLAYER, PlayerTypeCustom.ASTRA_B);
  evaluateCacheInit();
  purityInit();
  impurityInit();
  heartbrokenInit();
  tAstraDripInit();
}

export function initAstra(player: EntityPlayer): void {
  const shiny = modRNG.RandomInt(Globals.SHINY_ODDS) === 0;

  if (shiny) {
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

  if (shiny) {
    player.AddNullCostume(Costumes.ASTRA_B_HAIR_SHINY);
    player.AddNullCostume(Costumes.ASTRA_B_BODY_SHINY);
    const fireworks = Isaac.Spawn(EntityType.EFFECT, EffectVariant.FIREWORKS, 0, player.Position, Vector(0, 0), player);
    fireworks.ToEffect()?.SetTimeout(100);
  }

  player.AddCollectible(CollectibleCustom.DOOM_DESIRE, 0, false);
  player.SetPocketActiveItem(CollectibleCustom.FRUSTRATION, ActiveSlot.POCKET, false);
}
