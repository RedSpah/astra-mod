import { ActiveSlot, ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom, upgradeMod } from "isaacscript-common";

const MOD_NAME = "astra";
const ASTRA_HAIR_FULL = Isaac.GetCostumeIdByPath(
  "gfx/characters/character_red001_astrahairfull.anm2",
);
const TAINTED_ASTRA_HAIR_FULL = Isaac.GetCostumeIdByPath(
  "gfx/characters/character_red001x_tastrahairfull.anm2",
);
const ASTRA_HAIR_FULL_SHINY = Isaac.GetCostumeIdByPath(
  "gfx/characters/character_red001_astrahairfull_shiny.anm2",
);
const TAINTED_ASTRA_HAIR_FULL_SHINY = Isaac.GetCostumeIdByPath(
  "gfx/characters/character_red001x_tastrahairfull_shiny.anm2",
);
const ASTRA_TYPE = Isaac.GetPlayerTypeByName("Astra", false);
const TAINTED_ASTRA_TYPE = Isaac.GetPlayerTypeByName("Astra", true);
const COLLECTIBLE_CONFUSION = Isaac.GetItemIdByName("Confusion");
const COLLECTIBLE_BLINK = Isaac.GetItemIdByName("Blink");
const COLLECTIBLE_DOOM_DESIRE = Isaac.GetItemIdByName("Doom Desire");
const COLLECTIBLE_FRUSTRATION = Isaac.GetItemIdByName("Frustration");
const SHINY_ODDS = 64;

main();

function main() {
  // Instantiate a new mod object, which grants the ability to add callback functions that
  // correspond to in-game events.
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  // Register a callback function that corresponds to when a new run is started.
  mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initPlayer);

  // Print a message to the "log.txt" file.
  Isaac.DebugString(`${MOD_NAME} initialized.`);
}

function postGameStarted() {
  RNG().SetSeed(Game().GetSeeds().GetStartSeed(), 35);
  Isaac.DebugString("Callback fired: POST_GAME_STARTED");
}

function initPlayer(player: EntityPlayer) {
  const shinyRNG: number = RNG().RandomInt(SHINY_ODDS);
  switch (player.GetPlayerType()) {
    case ASTRA_TYPE:
      initAstra(player, shinyRNG === 0);
      break;
    case TAINTED_ASTRA_TYPE:
      initTAstra(player, shinyRNG === 0);
      break;
  }
}

function initAstra(player: EntityPlayer, shiny: boolean) {
  if (shiny) {
    player.AddNullCostume(ASTRA_HAIR_FULL_SHINY);
  } else {
    player.AddNullCostume(ASTRA_HAIR_FULL);
  }

  player.AddCollectible(COLLECTIBLE_CONFUSION, 0, false);
  player.SetPocketActiveItem(COLLECTIBLE_BLINK, ActiveSlot.POCKET, false);
}

function initTAstra(player: EntityPlayer, shiny: boolean) {
  if (shiny) {
    player.AddNullCostume(TAINTED_ASTRA_HAIR_FULL_SHINY);
  } else {
    player.AddNullCostume(TAINTED_ASTRA_HAIR_FULL);
  }

  player.AddCollectible(COLLECTIBLE_DOOM_DESIRE, 0, false);
  player.SetPocketActiveItem(COLLECTIBLE_FRUSTRATION, ActiveSlot.POCKET, false);
}
