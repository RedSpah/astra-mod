import { Direction, EffectVariant, EntityType, ModCallback, PlayerVariant } from "isaac-typescript-definitions";
import { spawn } from "isaacscript-common";
import { Globals } from "../enums/Globals";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { mod, modRNG } from "../mod";

export function tAstraDripInit(): void {
  mod.AddCallback(ModCallback.POST_PLAYER_UPDATE, TAstraDrip, PlayerVariant.PLAYER);
}

function TAstraDrip(player: EntityPlayer) {
  if (player.GetPlayerType() === PlayerTypeCustom.ASTRA_B) {
    if (!Game().IsPaused() && modRNG.RandomFloat() < 0.03) {
      let REmber: EntityEffect | undefined;

      switch (player.GetHeadDirection()) {
        case Direction.NO_DIRECTION:
        case Direction.DOWN:
          REmber = spawn(EntityType.EFFECT, EffectVariant.EMBER_PARTICLE, 0, Vector(player.Position.X + 22, player.Position.Y - 9), Vector(0, 1), player).ToEffect();
          break;
        case Direction.UP:
          REmber = spawn(EntityType.EFFECT, EffectVariant.EMBER_PARTICLE, 0, Vector(player.Position.X - 25, player.Position.Y - 9), Vector(0, 2), player).ToEffect();
          break;
        case Direction.LEFT:
          REmber = spawn(EntityType.EFFECT, EffectVariant.EMBER_PARTICLE, 0, Vector(player.Position.X + modRNG.RandomInt(10) - 15, player.Position.Y - 12), Vector(0, 2), player).ToEffect();
          if (REmber !== undefined) {
            REmber.DepthOffset = 20;
          }
          break;
        case Direction.RIGHT:
          REmber = spawn(EntityType.EFFECT, EffectVariant.EMBER_PARTICLE, 0, Vector(player.Position.X + modRNG.RandomInt(10) + 5, player.Position.Y - 9), Vector(0, 2), player).ToEffect();
          break;
      }

      if (REmber !== undefined) {
        REmber.SetTimeout(7);
        REmber.State = 1;
        REmber.Size = 0.5;
        REmber.FallingAcceleration = 3;
        REmber.SetColor(Color(0.6, 0, 0, 1, 0, 0, 0), Globals.INFINITY, Globals.COLOR_PRIORITY);
      }
    }
  }
}
