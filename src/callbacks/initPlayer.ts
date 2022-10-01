import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { Constants } from "../enums/Constants";
import { PlayerTypes } from "../enums/PlayerTypes";
import { initAstra } from "./initPlayer/astra";
import { initAstraB } from "./initPlayer/astra_b";

export function initPlayerInit(mod: ModUpgraded, _: Mod): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, initPlayer);
}

function initPlayer(player: EntityPlayer) {
  const shinyRNG: number = RNG().RandomInt(Constants.SHINY_ODDS);
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
