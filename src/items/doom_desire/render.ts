import { CollectibleCustom } from "../../enums/Collectibles";
import { getOrDefault } from "../../helpers";
import { DoomDesireConstants as Constants } from "./constants";
import { DoomDesireData, DoomDesireVolatileData, locals, saved } from "./variables";

export function DoomDesireRender(player: EntityPlayer, _: Vector): void {
  const playerHash = GetPtrHash(player);

  if (player.HasCollectible(CollectibleCustom.DOOM_DESIRE)) {
    // Variable setup
    const dd = getOrDefault(saved.run.conf, playerHash, DoomDesireData);
    const local = getOrDefault(locals, playerHash, DoomDesireVolatileData);
    const SSh = Vector(Game().ScreenShakeOffset.X, Game().ScreenShakeOffset.Y);

    if (dd.CD > 0) {
      local.ChargeSprite.SetFrame("Charging", math.floor((100 * dd.CD) / dd.MaxCD));
      local.ChargeSprite.Render(Isaac.WorldToScreen(player.Position).add(Constants.ChargeIconOffset).sub(SSh));
    }
  }
}
