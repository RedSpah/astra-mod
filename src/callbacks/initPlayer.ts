import { ModCallbackCustom } from "isaacscript-common";
import { Globals } from "../enums/Globals";
import { PlayerTypes } from "../enums/PlayerTypes";
import { mod } from "../mod";
import { initAstra } from "./initPlayer/astra";
import { initAstraB } from "./initPlayer/astra_b";
import { purityInit } from "./purity";

export function initPlayerInit(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initPlayer);
  purityInit();
}

function initPlayer(player: EntityPlayer) {
  const shinyRNG: number = RNG().RandomInt(Globals.SHINY_ODDS);
  switch (player.GetPlayerType()) {
    case PlayerTypes.ASTRA:
      initAstra(player, shinyRNG === 0);
      break;
    case PlayerTypes.ASTRA_B:
      initAstraB(player, shinyRNG === 0);
      break;
    default:
      break;
  }
}
