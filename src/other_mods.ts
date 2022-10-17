import { CollectibleCustom } from "./enums/CollectibleCustom";
import { PlayerTypeCustom } from "./enums/PlayerTypeCustom";

export function initOtherMods(): void {
  if (EID !== undefined) {
    EID.addCollectible(CollectibleCustom.DOOM_DESIRE, "Controllable tear eruption", "Doom Desire");
    EID.addCollectible(CollectibleCustom.CONFUSION, "Chargeable psychic explosion", "Confusion");
    EID.addCollectible(CollectibleCustom.BLINK, "Controllable intra-room teleport", "Blink");
    EID.addCollectible(CollectibleCustom.FRUSTRATION, "Teleports the player randomly", "Frustration");
  }

  const DDWiki: EncyclopediaWikiDescription = [];
  DDWiki.push([
    { str: "Effects", fsize: 2, clr: 3, halign: 0 },
    { str: "Adds a tear eruption whose location can be controlled similarly to Epic Fetus on top of the normal attack." },
    { str: "Affected by vanilla alternate weapons." }
  ]);
  DDWiki.push([
    { str: "Trivia", fsize: 2, clr: 3, halign: 0 },
    { str: "Has diverged so far from the original design that the name doesn't make much sense anymore." },
    { str: "It's still very cool though, so I'm keeping it." }
  ]);

  const ConfWiki: EncyclopediaWikiDescription = [];
  ConfWiki.push([
    { str: "Effects", fsize: 2, clr: 3, halign: 0 },
    { str: "Adds a chargeable AoE attack centered on the player that deals damage, stuns and knocks back nearby enemies once released." },
    { str: "Greatly reduces tears while being charged and held." }
  ]);
  ConfWiki.push([{ str: "Trivia", fsize: 2, clr: 3, halign: 0 }, { str: "The wisps only represent the range of the AoE damage, they don't have any inherent gameplay effect." }]);

  const BlinkWiki: EncyclopediaWikiDescription = [];
  BlinkWiki.push([{ str: "Effects", fsize: 2, clr: 3, halign: 0 }, { str: "Activate to spawn a target that can be controlled with fire keys. Activate again to teleport to the target." }]);

  const FrustWiki: EncyclopediaWikiDescription = [];
  FrustWiki.push([
    { str: "Effects", fsize: 2, clr: 3, halign: 0 },
    { str: "Teleports the user to a random spot in the room. Unobtainable outside of corrupting Astra, or as Tainted Astra's starting item." }
  ]);

  const AstraWiki: EncyclopediaWikiDescription = [];
  AstraWiki.push([
    { str: "Start Data", fsize: 2, clr: 3, halign: 0 },
    { str: "== Items: " },
    { str: "* Confusion" },
    { str: "* Blink (pocket item slot)" },
    { str: "== Stats: " },
    { str: "HP: 2 Red Hearts, 1 Soul Heart" },
    { str: "Damage: 2.74 (x0.75 Damage Multiplier) " },
    { str: "Tears: 2.73 " },
    { str: "Range: 6.50 " },
    { str: "Shot Speed: 1.00 " },
    { str: "Speed: 1.00 " },
    { str: "Luck: 2 " }
  ]);
  AstraWiki.push([
    { str: "Traits", fsize: 2, clr: 3, halign: 0 },
    { str: "== Purity" },
    { str: "Evil items lower damage further." },
    { str: '- Includes all items that grant "Evil Up".' },
    { str: "Devil Deals strip Astra of her power." },
    { str: "- Taking a Devil Deal removes Confusion, and replaces Blink with its broken version, Frustration." },
    { str: "- Dark Room and Black Market deals are fine." }
  ]);
  AstraWiki.push([{ str: "Birthright", fsize: 2, clr: 3, halign: 0 }, { str: "(NOT IMPLEMENTED YET)" }]);

  const AstraBWiki: EncyclopediaWikiDescription = [];
  AstraBWiki.push([
    { str: "Start Data", fsize: 2, clr: 3, halign: 0 },
    { str: "== Items: " },
    { str: "* Doom Desire" },
    { str: "* Frustration (pocket item slot)" },
    { str: "== Stats: " },
    { str: "HP: 1 Red Heart, 0.5 Soul Heart" },
    { str: "Damage: 4.38 (x1.25 Damage Multiplier) " },
    { str: "Tears: 2.73 (blindfolded)" },
    { str: "Range: 6.50 " },
    { str: "Shot Speed: 0.80 " },
    { str: "Speed: 0.75 " },
    { str: "Luck: -1 " }
  ]);
  AstraBWiki.push([
    { str: "Traits", fsize: 2, clr: 3, halign: 0 },
    { str: "== Impure" },
    { str: "Angel Rooms yield no rewards, Angels will aggro on sight." },
    { str: "Doom Desire fires additional Purgatory souls." },
    { str: "== Heartbroken" },
    { str: "Most sources of healing are halved." },
    { str: "- May be slightly buggy." },
    { str: "Astra has a number of Broken Hearts equal to the number of heart containers." }
  ]);
  AstraBWiki.push([{ str: "Birthright", fsize: 2, clr: 3, halign: 0 }, { str: "== Forgiven" }, { str: "The Angels forgive you." }, { str: "- You get to keep the buffed Doom Desire." }]);

  if (Encyclopedia !== undefined) {
    Encyclopedia.AddItem({
      ModName: "Astra Mod",
      ID: CollectibleCustom.DOOM_DESIRE,
      WikiDesc: DDWiki,
      Pools: [
        EncyclopediaItemPoolType.POOL_DEVIL,
        EncyclopediaItemPoolType.POOL_GREED_DEVIL,
        EncyclopediaItemPoolType.POOL_DEMON_BEGGAR,
        EncyclopediaItemPoolType.POOL_CURSE,
        EncyclopediaItemPoolType.POOL_GREED_CURSE
      ]
    });

    Encyclopedia.AddItem({
      ModName: "Astra Mod",
      ID: CollectibleCustom.CONFUSION,
      WikiDesc: ConfWiki,
      Pools: [
        EncyclopediaItemPoolType.POOL_ANGEL,
        EncyclopediaItemPoolType.POOL_TREASURE,
        EncyclopediaItemPoolType.POOL_SECRET,
        EncyclopediaItemPoolType.POOL_GREED_ANGEL,
        EncyclopediaItemPoolType.POOL_GREED_TREASURE,
        EncyclopediaItemPoolType.POOL_GREED_SECRET
      ]
    });

    Encyclopedia.AddItem({
      ModName: "Astra Mod",
      ID: CollectibleCustom.BLINK,
      WikiDesc: BlinkWiki,
      Pools: [EncyclopediaItemPoolType.POOL_SHOP, EncyclopediaItemPoolType.POOL_GREED_SHOP]
    });

    Encyclopedia.AddItem({
      ModName: "Astra Mod",
      ID: CollectibleCustom.FRUSTRATION,
      WikiDesc: FrustWiki,
      Pools: []
    });

    Encyclopedia.AddCharacter({
      ModName: "Astra Mod",
      Name: "Astra",
      Sprite: Encyclopedia.RegisterSprite("gfx/characters/Encyclopedia/characterportraits.anm2", "Astra", 0),
      WikiDesc: AstraWiki,
      ID: PlayerTypeCustom.ASTRA
    });

    Encyclopedia.AddCharacterTainted({
      ModName: "Astra Mod",
      Name: "Astra",
      Description: "The Fiend",
      Sprite: Encyclopedia.RegisterSprite("gfx/characters/Encyclopedia/characterportraitsalt.anm2", "Astra", 0),
      WikiDesc: AstraBWiki,
      ID: PlayerTypeCustom.ASTRA_B
    });
  }
}
