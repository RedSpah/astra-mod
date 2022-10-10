import { ISCFeature, upgradeMod } from "isaacscript-common";

const MOD_NAME = "Astra Mod v2.0";

const modVanilla = RegisterMod(MOD_NAME, 1);
const features = [ISCFeature.SAVE_DATA_MANAGER] as const;
export const mod = upgradeMod(modVanilla, features);
