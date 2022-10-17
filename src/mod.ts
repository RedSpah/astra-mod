import { ISCFeature, upgradeMod } from "isaacscript-common";

export const MOD_VER = "2.0";
export const MOD_NAME = `Astra Mod v${MOD_VER}`;

const modVanilla = RegisterMod(MOD_NAME, 1);
const features = [ISCFeature.SAVE_DATA_MANAGER] as const;
export const mod = upgradeMod(modVanilla, features);
export const modRNG = RNG();
