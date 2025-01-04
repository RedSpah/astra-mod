export const PlayerTypeCustom = {
  ASTRA: Isaac.GetPlayerTypeByName("Astra", false),
  ASTRA_B: Isaac.GetPlayerTypeByName("Astra", true),
  DANIEL: Isaac.GetPlayerTypeByName("Daniel", false),
  DANIEL_B: Isaac.GetPlayerTypeByName("Daniel", true)
} as const;
