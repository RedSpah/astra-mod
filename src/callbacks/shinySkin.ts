import { ModCallback, PlayerVariant } from "isaac-typescript-definitions";
import { Costumes } from "../enums/Costumes";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { getOrDefault } from "../helpers";
import { mod } from "../mod";

export class ShinyData {
  Shiny = false;
}

export class ShinyVolatileData {
  SkinUpdated = false;
}

export const locals: Map<PtrHash, ShinyVolatileData> = new Map<PtrHash, ShinyVolatileData>();

export const saved = {
  run: {
    shiny: new Map<PtrHash, ShinyData>()
  }
};

export function shinySkinInit(): void {
  mod.saveDataManager("astra.shiny", saved);
  mod.saveDataManagerRegisterClass(ShinyData);
  mod.AddCallback(ModCallback.POST_PLAYER_UPDATE, ShinySkin, PlayerVariant.PLAYER);
}

function ShinySkin(player: EntityPlayer) {
  const playerHash = GetPtrHash(player);
  if (player.GetPlayerType() === PlayerTypeCustom.DANIEL || player.GetPlayerType() === PlayerTypeCustom.DANIEL_B) {
    const shinySave = getOrDefault(saved.run.shiny, playerHash, ShinyData);
    if (shinySave.Shiny) {
      const shinyVolatile = getOrDefault(locals, playerHash, ShinyVolatileData);
      if (!shinyVolatile.SkinUpdated) {
        switch (player.GetPlayerType()) {
          case PlayerTypeCustom.DANIEL:
            player.GetSprite().ReplaceSpritesheet(0, Costumes.DANIEL_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(1, Costumes.DANIEL_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(2, Costumes.DANIEL_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(4, Costumes.DANIEL_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(12, Costumes.DANIEL_SHINY_SKIN_PATH);
            player.GetSprite().LoadGraphics();
            break;
          case PlayerTypeCustom.DANIEL_B:
            player.GetSprite().ReplaceSpritesheet(0, Costumes.DANIEL_B_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(1, Costumes.DANIEL_B_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(2, Costumes.DANIEL_B_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(4, Costumes.DANIEL_B_SHINY_SKIN_PATH);
            player.GetSprite().ReplaceSpritesheet(12, Costumes.DANIEL_B_SHINY_SKIN_PATH);
            player.GetSprite().LoadGraphics();
            break;
          default:
            break;
        }
        shinyVolatile.SkinUpdated = true;
      }
    }
  }
}
