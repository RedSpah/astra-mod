import { ActiveSlot } from "isaac-typescript-definitions";
import { Collectibles } from "../../enums/Collectibles";
import { Costumes } from "../../enums/Costumes";

export function initAstraB(player: EntityPlayer, shiny: boolean): void {
  if (shiny) {
    player.AddNullCostume(Costumes.ASTRA_B_HAIR_SHINY);
  } else {
    player.AddNullCostume(Costumes.ASTRA_B_HAIR);
  }

  player.AddCollectible(Collectibles.DOOM_DESIRE, 0, false);
  player.SetPocketActiveItem(Collectibles.FRUSTRATION, ActiveSlot.POCKET, false);
}
