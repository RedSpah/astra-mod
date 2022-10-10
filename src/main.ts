import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded, upgradeMod } from "isaacscript-common";
import { evaluateCacheInit } from "./callbacks/evaluateCache";
import { initPlayerInit } from "./callbacks/initPlayer";
import { initItems } from "./items/initItems";

const MOD_NAME = "Astra Mod v2.0";

export function main(): void {
  // Instantiate a new mod object, which grants the ability to add callback functions that
  // correspond to in-game events.
  const mod = upgradeMod(RegisterMod(MOD_NAME, 1));

  registerCallbacks(mod);
  mod.Name = MOD_NAME;

  // Register a callback function that corresponds to when a new run is started.
  mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

  // Print a message to the "log.txt" file.
  Isaac.DebugString(`${MOD_NAME} initialized.`);
}

function postGameStarted() {
  RNG().SetSeed(Game().GetSeeds().GetStartSeed(), 35);
  Isaac.DebugString("Callback fired: POST_GAME_STARTED");
}

function registerCallbacks(mod: ModUpgraded) {
  initPlayerInit(mod);
  evaluateCacheInit(mod);
  initItems(mod);
}
