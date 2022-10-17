export const PlayerTypeCustom = {
  ASTRA: Isaac.GetPlayerTypeByName("Astra", false),
  ASTRA_B: Isaac.GetPlayerTypeByName("Astra", true)
} as const;
