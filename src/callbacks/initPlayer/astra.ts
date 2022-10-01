import { ActiveSlot } from "isaac-typescript-definitions";
import { Collectibles } from "../../enums/Collectibles";
import { Costumes } from "../../enums/Costumes";

export function initAstra(player: EntityPlayer, shiny: boolean): void {
  if (shiny) {
    player.AddNullCostume(Costumes.ASTRA_HAIR_SHINY);
  } else {
    player.AddNullCostume(Costumes.ASTRA_HAIR);
  }

  player.AddCollectible(Collectibles.CONFUSION, 0, false);
  player.SetPocketActiveItem(Collectibles.BLINK, ActiveSlot.POCKET, false);
}
