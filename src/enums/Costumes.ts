export const Costumes = {
  ASTRA_HAIR: Isaac.GetCostumeIdByPath("gfx/characters/character_red001_astrahairfull.anm2"),
  ASTRA_HAIR_SHINY: Isaac.GetCostumeIdByPath("gfx/characters/character_red001_astrahairfull_shiny.anm2"),
  ASTRA_B_HAIR: Isaac.GetCostumeIdByPath("gfx/characters/character_red001x_tastrahairfull.anm2"),
  ASTRA_B_HAIR_SHINY: Isaac.GetCostumeIdByPath("gfx/characters/character_red001x_tastrahairfull_shiny.anm2"),

  CONF_CHARGE_ANIM: [
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge1.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge2.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge3.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge4.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge5.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge6.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge7.anm2"),
    Isaac.GetCostumeIdByPath("gfx/characters/confusion_charge8.anm2")
  ],

  ASTRA_DEVIL: Isaac.GetCostumeIdByPath("gfx/characters/costume_astra_devil.anm2"),
  ASTRA_CRY: Isaac.GetCostumeIdByPath("gfx/characters/costume_astra_cry.anm2"),
  ASTRA_HAPPY: Isaac.GetCostumeIdByPath("gfx/characters/costume_astra_happy.anm2"),
  ASTRA_PLANETARIUM: Isaac.GetCostumeIdByPath("gfx/characters/costume_astra_planetarium.anm2")
} as const;
