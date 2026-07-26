// ============================================================
// NEPHALEM'S CODEX — D4 Item Database
// Season 14: Death Awakening | Lord of Hatred Expansion
// Source: Owen's Boss Loot Table spreadsheet (July 2026)
// ============================================================
// HOW TO ADD ITEMS:
//   Use the compact helper functions below. Each item is one line.
//   b(BOSS_ID)  = dedicated boss drop source
//   pool()      = General Unique Pool (any boss, Cube 3-to-1 recommended)
//   myth()      = Mythic Unique (any Tormented Boss; Belial best)
//
// BOSS ID ALIASES (for use with b()):
//   AN=andariel  AS=astaroth  BA=bartuc  BI=beast-in-ice
//   BL=belial    BU=butcher   DU=duriel  GR=grigoire
//   HA=harbinger LZ=lord-zir  UR=urivar  VA=varshan
//
// SLOT IDs: helm chest gloves pants boots amulet ring weapon offhand
// CLASS:    "all"  OR  "Barbarian" "Druid" "Necromancer" "Paladin"
//           "Rogue" "Sorcerer" "Spiritborn" "Warlock"
// ============================================================

// ── COMPACT HELPERS ──────────────────────────────────────────
const _BN = {
  andariel:     "Echo of Andariel",
  astaroth:     "Astaroth, the Charred Duke",
  bartuc:       "Bartuc, Lord of Chaos",
  "beast-in-ice": "The Beast in Ice",
  belial:       "Belial, Lord of Lies",
  butcher:      "The Butcher",
  duriel:       "Duriel, King of Maggots",
  grigoire:     "Grigoire, the Galvanic Saint",
  harbinger:    "Harbinger of Hatred",
  "lord-zir":   "Lord Zir",
  urivar:       "Urivar",
  varshan:      "Echo of Varshan"
};
const AN="andariel", AS="astaroth", BA="bartuc", BI="beast-in-ice",
      BL="belial",   BU="butcher",  DU="duriel", GR="grigoire",
      HA="harbinger",LZ="lord-zir", UR="urivar", VA="varshan";

function b(id)  { return { type:"boss",   boss:id,   label:_BN[id]||id,          detail:"Dedicated class drop" }; }
function pool() { return { type:"pool",   boss:null,  label:"General Unique Pool", detail:"Any Lair Boss (low rate). Horadric Cube 3-to-1 is the most reliable method." }; }
function myth() { return { type:"mythic", boss:BL,    label:"All Tormented Bosses", detail:"Can drop from any Tormented Boss. Belial (Exalted) has the highest drop chance." }; }
// u(id, name, slot, slotDisplay, class, itemType, sources[], notes?)
function u(id,name,slot,slotDisp,cls,iType,src,notes) {
  return { id, name, slot, slotDisplay:slotDisp, class:cls, itemType:iType, sources:src, notes:notes||"", uniquePower:"" };
}

// ── MAIN DATABASE ─────────────────────────────────────────────
const D4DB = {

  meta: { season:14, seasonName:"Death Awakening", expansion:"Lord of Hatred", lastUpdated:"July 2026" },

  gearSlots: [
    { id:"helm",    label:"Helm",     icon:"🪖" },
    { id:"chest",   label:"Chest",    icon:"🛡️" },
    { id:"gloves",  label:"Gloves",   icon:"🧤" },
    { id:"pants",   label:"Pants",    icon:"👖" },
    { id:"boots",   label:"Boots",    icon:"👢" },
    { id:"amulet",  label:"Amulet",   icon:"📿" },
    { id:"ring1",   label:"Ring 1",   icon:"💍" },
    { id:"ring2",   label:"Ring 2",   icon:"💍" },
    { id:"weapon1", label:"Weapon 1", icon:"⚔️" },
    { id:"weapon2", label:"Weapon 2", icon:"🗡️" },
    { id:"offhand", label:"Off-Hand", icon:"🛡️" }
  ],

  // Slot category map: app slot ID → DB slot value used for filtering
  slotCategoryMap: {
    helm:"helm", chest:"chest", gloves:"gloves", pants:"pants",
    boots:"boots", amulet:"amulet", offhand:"offhand",
    ring1:"ring", ring2:"ring",
    weapon1:"weapon", weapon2:"weapon"
  },

  classes: ["Barbarian","Druid","Necromancer","Paladin","Rogue","Sorcerer","Spiritborn","Warlock"],

  // ── BOSSES ────────────────────────────────────────────────────
  bosses: [
    { id:"varshan",      name:"Echo of Varshan",             tier:"Initiate", keyMaterial:"Malignant Heart",                       keySource:"Whisper Caches, Grotesque Debtors",            mythicChance:false, notes:"Good early-endgame target. Farm Whispers for keys." },
    { id:"lord-zir",     name:"Lord Zir",                    tier:"Initiate", keyMaterial:"Exquisite Blood",                       keySource:"Bloodseeker enemies, Helltide",                 mythicChance:false, notes:"Drops strong class-specific uniques." },
    { id:"grigoire",     name:"Grigoire, the Galvanic Saint",tier:"Initiate", keyMaterial:"Live Seedling",                         keySource:"Living Steel Chests in Helltide",               mythicChance:false, notes:"Run often — Helltide provides keys reliably." },
    { id:"beast-in-ice", name:"The Beast in Ice",            tier:"Initiate", keyMaterial:"Distilled Fear",                        keySource:"Nightmare Dungeons (Tier 30+)",                 mythicChance:false, notes:"Key drops from Nightmare Dungeons." },
    { id:"urivar",       name:"Urivar",                      tier:"Initiate", keyMaterial:"Urivar's Essence",                      keySource:"War Plans, Helltide (Lord of Hatred)",          mythicChance:false, notes:"New LoH boss. Farm War Plans for keys." },
    { id:"astaroth",     name:"Astaroth, the Charred Duke",  tier:"Greater",  keyMaterial:"Smoldering Ash",                        keySource:"Elite monsters, War Plans",                     mythicChance:true,  notes:"Greater boss. Mythic drops possible." },
    { id:"bartuc",       name:"Bartuc, Lord of Chaos",       tier:"Greater",  keyMaterial:"Blood-Soaked Armor",                    keySource:"Elite monsters, Helltide",                      mythicChance:true,  notes:"Greater boss. Good Mythic farming target." },
    { id:"duriel",       name:"Duriel, King of Maggots",     tier:"Greater",  keyMaterial:"Mucus-Slick Egg + Shards of Agony",     keySource:"Varshan (Egg) + Grigoire (Shards)",             mythicChance:true,  notes:"Top Mythic boss. Farm Initiate bosses for key materials first." },
    { id:"andariel",     name:"Echo of Andariel",            tier:"Greater",  keyMaterial:"Sandscorched Shackles + Pincushioned Doll", keySource:"Lord Zir (Shackles) + Beast in Ice (Doll)", mythicChance:true,  notes:"Top Mythic boss, equal to Duriel." },
    { id:"harbinger",    name:"Harbinger of Hatred",         tier:"Greater",  keyMaterial:"Hatred's Toll",                         keySource:"Urivar drops, War Plans (Lord of Hatred)",      mythicChance:true,  notes:"New LoH Greater boss. Strong Mythic source." },
    { id:"belial",       name:"Belial, Lord of Lies",        tier:"Exalted",  keyMaterial:"Betrayer's Husk (×2)",                  keySource:"Drops from Greater Lair Bosses",                mythicChance:true,  notes:"Highest Mythic drop chance. Guarantees Ancestral Unique. Pinnacle boss of Lord of Hatred." },
    { id:"butcher",      name:"The Butcher",                 tier:"Encounter",keyMaterial:"None — spawns randomly",                keySource:"Spawns randomly in any dungeon or The Pit",      mythicChance:false, notes:"⚠️ Cannot be summoned. Farm dungeons and The Pit. He is extremely dangerous — come prepared!" }
  ],

  // ── UNIQUE ITEMS ──────────────────────────────────────────────
  // Organized by boss (matches Owen's spreadsheet).
  // Items with multiple sources (pool + specific boss) appear ONCE with both source entries.
  uniques: [

    // ══════════════════════════════════════════════════════════
    // MYTHIC UNIQUES — Drop from any Tormented Boss
    // Belial (Exalted) has the highest chance
    // ══════════════════════════════════════════════════════════
    u("ahavarion",        "Ahavarion, Spear of Lycander",  "weapon", "Staff",    "all","mythic",[myth()]),
    u("andariel-visage",  "Andariel's Visage",             "helm",   "Helm",     "all","mythic",[myth()]),
    u("doombringer",      "Doombringer",                   "weapon", "1H Sword", "all","mythic",[myth()]),
    u("eldruin",          "El'Druin, Sword of Justice",    "weapon", "1H Sword", "all","mythic",[myth()]),
    u("harlequin-crest",  "Harlequin Crest",               "helm",   "Helm",     "all","mythic",[myth()]),
    u("heir-perdition",   "Heir of Perdition",             "helm",   "Helm",     "all","mythic",[myth()]),
    u("melted-heart",     "Melted Heart of Selig",         "amulet", "Amulet",   "all","mythic",[myth()]),
    u("ring-starless",    "Ring of Starless Skies",        "ring",   "Ring",     "all","mythic",[myth()]),
    u("shroud-false",     "Shroud of False Death",         "chest",  "Chest",    "all","mythic",[myth()]),
    u("tyraels-might",    "Tyrael's Might",                "chest",  "Chest",    "all","mythic",[myth()]),
    u("shattered-vow",    "Shattered Vow",                 "weapon", "Polearm",  "all","mythic",[myth()]),
    u("grandfather",      "The Grandfather",               "weapon", "2H Sword", "all","mythic",[myth()]),
    u("nesekem",          "Nesekem, the Herald",           "weapon", "Glaive",   "Spiritborn","mythic",[b(BL)],"Spiritborn-specific Mythic from Belial."),

    // ══════════════════════════════════════════════════════════
    // GENERAL UNIQUE POOL — Drop from ANY Lair Boss (low rate)
    // Best farmed via Horadric Cube 3-to-1 Transmutation
    // ══════════════════════════════════════════════════════════
    u("azurewrath",       "Azurewrath",                    "weapon", "1H Sword", "all","unique",[pool()]),
    u("banished-talisman","Banished Lord's Talisman",      "amulet", "Amulet",   "all","unique",[pool()]),
    u("blood-mad-idol",   "Blood-Mad Idol",                "amulet", "Amulet",   "all","unique",[pool()]),
    u("crown-lucion",     "Crown of Lucion",               "helm",   "Helm",     "all","unique",[pool()]),
    u("endurant-faith",   "Endurant Faith",                "gloves", "Gloves",   "all","unique",[pool()]),
    u("fists-of-fate",    "Fists of Fate",                 "gloves", "Gloves",   "all","unique",[pool()]),
    u("flickerstep",      "Flickerstep",                   "boots",  "Boots",    "all","unique",[pool()]),
    u("frostburn",        "Frostburn",                     "gloves", "Gloves",   "all","unique",[pool()]),
    u("godslayer-crown",  "Godslayer Crown",               "helm",   "Helm",     "all","unique",[pool()]),
    u("locrans-talisman", "Locran's Talisman",             "amulet", "Amulet",   "all","unique",[pool()]),
    u("mothers-embrace",  "Mother's Embrace",              "ring",   "Ring",     "all","unique",[pool()]),
    u("paingorgers",      "Paingorger's Gauntlets",        "gloves", "Gloves",   "all","unique",[pool()]),
    u("penitent-greaves", "Penitent Greaves",              "boots",  "Boots",    "all","unique",[pool()]),
    u("rakanoth-wake",    "Rakanoth's Wake",               "boots",  "Boots",    "all","unique",[pool()]),
    u("razorplate",       "Razorplate",                    "chest",  "Chest",    "all","unique",[pool()]),
    u("rustbitten-dirk",  "Rustbitten Dirk",               "weapon", "Dagger",   "all","unique",[pool(),b(BU)],"Also a dedicated Butcher drop for Druid, Necromancer, Rogue, and Sorcerer."),
    u("shard-verathiel",  "Shard of Verathiel",            "weapon", "1H Sword", "all","unique",[pool()]),
    u("signet-pelghain",  "Signet of Pelghain",            "ring",   "Ring",     "all","unique",[pool()]),
    u("soulbrand",        "Soulbrand",                     "chest",  "Chest",    "all","unique",[pool()]),
    u("tassets-dawning",  "Tassets of the Dawning Sky",    "pants",  "Pants",    "all","unique",[pool()]),
    u("temerity",         "Temerity",                      "pants",  "Pants",    "all","unique",[pool()]),
    u("butchers-cleaver", "The Butcher's Cleaver",         "weapon", "1H Axe",   "all","unique",[pool(),b(GR)],"Also a dedicated Grigoire drop for Barbarian, Druid, and Necromancer."),
    u("thousand-eye",     "Thousand-Eye Reaver",           "weapon", "1H Axe",   "all","unique",[pool(),b(BU)],"Also a dedicated Butcher drop for Druid, Necromancer, and Paladin."),
    u("tibaults-will",    "Tibault's Will",                "pants",  "Pants",    "all","unique",[pool()]),
    u("wendigo-brand",    "Wendigo Brand",                 "ring",   "Ring",     "all","unique",[pool()]),
    u("wyrdskin",         "Wyrdskin",                      "gloves", "Gloves",   "all","unique",[pool()]),
    u("xfal-signet",      "X'Fal's Corroded Signet",       "ring",   "Ring",     "all","unique",[pool()]),
    u("yens-blessing",    "Yen's Blessing",                "boots",  "Boots",    "all","unique",[pool()]),

    // ══════════════════════════════════════════════════════════
    // ANDARIEL DROPS
    // ══════════════════════════════════════════════════════════
    u("ancients-oath",     "Ancients' Oath",              "weapon","2H Axe",   "Barbarian",  "unique",[b(AN)]),
    u("emblem-staalbreak", "Emblem of Staalbreak",        "amulet","Amulet",   "Barbarian",  "unique",[b(AN)]),
    u("hellhammer",        "Hellhammer",                  "weapon","2H Mace",  "Barbarian",  "unique",[b(AN)]),
    u("greenwalker-signet","Greenwalker's Signet",        "ring",  "Ring",     "Druid",      "unique",[b(AN)]),
    u("insatiable-fury",   "Insatiable Fury",             "chest", "Chest",    "Druid",      "unique",[b(AN)]),
    u("storms-companion",  "Storm's Companion",           "pants", "Pants",    "Druid",      "unique",[b(AN)]),
    u("ebonpiercer",       "Ebonpiercer",                 "amulet","Amulet",   "Necromancer","unique",[b(AN)]),
    u("kessimes-legacy",   "Kessime's Legacy",            "pants", "Pants",    "Necromancer","unique",[b(AN)]),
    u("lidless-wall",      "Lidless Wall",                "offhand","Shield",  "Necromancer","unique",[b(AN)]),
    u("argent-veil",       "Argent Veil",                 "ring",  "Ring",     "Paladin",    "unique",[b(AN)]),
    u("dawnfire",          "Dawnfire",                    "gloves","Gloves",   "Paladin",    "unique",[b(AN)]),
    u("assassins-stride",  "Assassin's Stride",           "pants", "Pants",    "Rogue",      "unique",[b(AN)]),
    u("beastfall-boots",   "Beastfall Boots",             "boots", "Boots",    "Rogue",      "unique",[b(AN)]),
    u("deathmask-nirmitruq","Deathmask of Nirmitruq",    "helm",  "Helm",     "Rogue",      "unique",[b(AN)]),
    u("drognans-anguish",  "Drognan's Anguish",           "ring",  "Ring",     "Sorcerer",   "unique",[b(AN)]),
    u("esadoras-cameo",    "Esadora's Overflowing Cameo", "amulet","Amulet",   "Sorcerer",   "unique",[b(AN)]),
    u("orsivane",          "Orsivane",                    "weapon","1H Mace",  "Sorcerer",   "unique",[b(AN)]),
    u("craze-dead-god",    "Craze of the Dead God",       "gloves","Gloves",   "Spiritborn", "unique",[b(AN)]),
    u("ring-midday-hunt",  "Ring of the Midday Hunt",     "ring",  "Ring",     "Spiritborn", "unique",[b(AN)]),
    u("anathema-primes",   "Anathema of the Primes",      "weapon","2H Sword", "Warlock",    "unique",[b(AN)]),
    u("night-terror",      "Night Terror",                "amulet","Amulet",   "Warlock",    "unique",[b(AN)]),
    u("scepter-three",     "Scepter of the Three",        "weapon","2H Mace",  "Warlock",    "unique",[b(AN)]),

    // ══════════════════════════════════════════════════════════
    // ASTAROTH DROPS
    // ══════════════════════════════════════════════════════════
    u("battle-trance",     "Battle Trance",               "amulet","Amulet",   "Barbarian",  "unique",[b(AS)]),
    u("hooves-mountain",   "Hooves of the Mountain God",  "boots", "Boots",    "Barbarian",  "unique",[b(AS)]),
    u("third-blade",       "The Third Blade",             "weapon","1H Sword", "Barbarian",  "unique",[b(AS)]),
    u("dirge-airidah",     "Dirge of Airidah",            "ring",  "Ring",     "Druid",      "unique",[b(AS)]),
    u("mad-wolfs-glee",    "Mad Wolf's Glee",             "chest", "Chest",    "Druid",      "unique",[b(AS)]),
    u("wildheart-hunger",  "Wildheart Hunger",            "boots", "Boots",    "Druid",      "unique",[b(AS)]),
    u("blood-moon-breeches","Blood Moon Breeches",        "pants", "Pants",    "Necromancer","unique",[b(AS)]),
    u("bloodless-scream",  "Bloodless Scream",            "weapon","2H Scythe","Necromancer","unique",[b(AS)]),
    u("ring-sacrilegious", "Ring of the Sacrilegious Soul","ring", "Ring",     "Necromancer","unique",[b(AS)]),
    u("griswolds-opus",    "Griswold's Opus",             "weapon","1H Sword", "Paladin",    "unique",[b(AS)]),
    u("herald-zakarum",    "Herald of Zakarum",           "offhand","Shield",  "Paladin",    "unique",[b(AS)]),
    u("ashearas-khanjar",  "Asheara's Khanjar",           "weapon","Dagger",   "Rogue",      "unique",[b(AS)]),
    u("eyes-in-dark",      "Eyes in the Dark",            "pants", "Pants",    "Rogue",      "unique",[b(AS)]),
    u("gladiators-triumph","Gladiator's Triumph",         "gloves","Gloves",   "Rogue",      "unique",[b(AS)]),
    u("esus-heirloom",     "Esu's Heirloom",             "boots", "Boots",    "Sorcerer",   "unique",[b(AS)]),
    u("fractured-winterglass","Fractured Winterglass",    "amulet","Amulet",   "Sorcerer",   "unique",[b(AS)]),
    u("hail-verglas",      "Hail of Verglas",             "helm",  "Helm",     "Sorcerer",   "unique",[b(AS)]),
    u("echo-kwatli",       "Echo of Kwatli",              "amulet","Amulet",   "Spiritborn", "unique",[b(AS)]),
    u("ring-midnight-sun", "Ring of the Midnight Sun",    "ring",  "Ring",     "Spiritborn", "unique",[b(AS)]),
    u("bindings-attrition","Bindings of Attrition",       "pants", "Pants",    "Warlock",    "unique",[b(AS)]),
    u("footfalls-waning",  "Footfalls of the Waning World","boots","Boots",    "Warlock",    "unique",[b(AS)]),
    u("hecaton-chasm",     "Hecaton Chasm",               "ring",  "Ring",     "Warlock",    "unique",[b(AS)]),
    u("litany-sable",      "Litany of Sable",             "weapon","Dagger",   "Warlock",    "unique",[b(AS)]),

    // ══════════════════════════════════════════════════════════
    // BARTUC DROPS
    // ══════════════════════════════════════════════════════════
    u("arreat-bearing",    "Arreat's Bearing",            "pants", "Pants",    "Barbarian",  "unique",[b(BA)]),
    u("open-eye-gorgorra", "The Open Eye of Gorgorra",    "amulet","Amulet",   "Barbarian",  "unique",[b(BA)]),
    u("tuskhelm-joritz",   "Tuskhelm of Joritz the Mighty","helm", "Helm",    "Barbarian",  "unique",[b(BA)]),
    u("earthbreaker",      "Earthbreaker",                "ring",  "Ring",     "Druid",      "unique",[b(BA)]),
    u("khamsin-steppewalkers","Khamsin Steppewalkers",    "boots", "Boots",    "Druid",      "unique",[b(BA)]),
    u("mjolnic-ryng",      "Mjölnic Ryng",                "ring",  "Ring",     "Druid",      "unique",[b(BA)]),
    u("gravewalkers-hand", "Gravewalker's Hand",          "gloves","Gloves",   "Necromancer","unique",[b(BA)]),
    u("omen-of-pain",      "Omen of Pain",                "ring",  "Ring",     "Necromancer","unique",[b(BA)]),
    u("the-unmaker",       "The Unmaker",                 "helm",  "Helm",     "Necromancer","unique",[b(BA)]),
    u("arcadia",           "Arcadia",                     "pants", "Pants",    "Paladin",    "unique",[b(BA)]),
    u("sundered-night",    "Sundered Night",              "weapon","2H Axe",   "Paladin",    "unique",[b(BA)]),
    u("grasp-of-shadow",   "Grasp of Shadow",             "gloves","Gloves",   "Rogue",      "unique",[b(BA)]),
    u("misericorde",       "Misericorde",                 "weapon","1H Sword", "Rogue",      "unique",[b(BA)]),
    u("word-of-hakan",     "Word of Hakan",               "amulet","Amulet",   "Rogue",      "unique",[b(BA)]),
    u("axial-conduit",     "Axial Conduit",               "pants", "Pants",    "Sorcerer",   "unique",[b(BA)]),
    u("ophidian-iris",     "Ophidian Iris",               "amulet","Amulet",   "Sorcerer",   "unique",[b(BA)]),
    u("raiment-infinite",  "Raiment of the Infinite",     "chest", "Chest",    "Sorcerer",   "unique",[b(BA)]),
    u("harmony-ebewaka",   "Harmony of Ebewaka",          "helm",  "Helm",     "Spiritborn", "unique",[b(BA)]),
    u("loyaltys-mantle",   "Loyalty's Mantle",            "helm",  "Helm",     "Spiritborn", "unique",[b(BA)]),
    u("eye-of-baal",       "Eye of Baal",                 "offhand","Focus",   "Warlock",    "unique",[b(BA)]),
    u("hand-apotheosis",   "Hand of Apotheosis",          "gloves","Gloves",   "Warlock",    "unique",[b(BA)]),
    u("sashes-wretched",   "Sashes of the Wretched",      "pants", "Pants",    "Warlock",    "unique",[b(BA)]),
    u("hemat-stone",       "The Hemat Stone",             "amulet","Amulet",   "Warlock",    "unique",[b(BA)]),

    // ══════════════════════════════════════════════════════════
    // BEAST IN ICE DROPS
    // ══════════════════════════════════════════════════════════
    u("ring-ravenous",     "Ring of the Ravenous",        "ring",  "Ring",     "Barbarian",  "unique",[b(BI)]),
    u("relentless-heart",  "The Relentless Heart",        "chest", "Chest",    "Barbarian",  "unique",[b(BI)]),
    u("accord-wilds",      "Accord of the Wilds",         "ring",  "Ring",     "Druid",      "unique",[b(BI)]),
    u("airidahs-will",     "Airidah's Inexorable Will",   "ring",  "Ring",     "Druid",      "unique",[b(BI)]),
    u("malefic-crescent",  "Malefic Crescent",            "amulet","Amulet",   "Druid",      "unique",[b(BI)]),
    u("deathless-visage",  "Deathless Visage",            "helm",  "Helm",     "Necromancer","unique",[b(BI)]),
    u("howl-from-below",   "Howl from Below",             "gloves","Gloves",   "Necromancer","unique",[b(BI)]),
    u("lights-rebuke",     "Light's Rebuke",              "weapon","Flail",    "Paladin",    "unique",[b(BI)]),
    u("sanctis-kethamar",  "Sanctis of Kethamar",         "amulet","Amulet",   "Paladin",    "unique",[b(BI)]),
    u("orphan-maker",      "Orphan Maker",                "weapon","Crossbow", "Rogue",      "unique",[b(BI)]),
    u("saboteurs-signet",  "Saboteur's Signet",           "ring",  "Ring",     "Rogue",      "unique",[b(BI)]),
    u("gift-of-frost",     "Gift of Frost",               "boots", "Boots",    "Sorcerer",   "unique",[b(BI)]),
    u("starfall-coronet",  "Starfall Coronet",            "helm",  "Helm",     "Sorcerer",   "unique",[b(BI)]),
    u("the-oculus",        "The Oculus",                  "weapon","Wand",     "Sorcerer",   "unique",[b(BI)]),
    u("protection-prime",  "Protection of the Prime",     "pants", "Pants",    "Spiritborn", "unique",[b(BI)]),
    u("scorn-of-earth",    "Scorn of the Earth",          "boots", "Boots",    "Spiritborn", "unique",[b(BI)]),
    u("hellhound-sabatons","Hellhound's Sabatons",        "boots", "Boots",    "Warlock",    "unique",[b(BI)]),
    u("kabraxis-will",     "Kabraxis' Will",              "pants", "Pants",    "Warlock",    "unique",[b(BI)]),
    u("morlu-fleshward",   "Morlu Fleshward",             "pants", "Pants",    "Warlock",    "unique",[b(BI)]),
    u("eightfold-idol",    "The Eightfold Idol",          "ring",  "Ring",     "Warlock",    "unique",[b(BI)]),

    // ══════════════════════════════════════════════════════════
    // BUTCHER DROPS  (The Butcher = random encounter, no key needed)
    // Note: Rustbitten Dirk & Thousand-Eye Reaver are listed above
    //       in the General Pool section with Butcher as secondary source.
    // ══════════════════════════════════════════════════════════
    u("chainscourged-mail","Chainscourged Mail",          "pants", "Pants",    "Barbarian",  "unique",[b(BU)]),
    u("rage-harrogath",    "Rage of Harrogath",           "chest", "Chest",    "Barbarian",  "unique",[b(BU)]),
    u("ramaladnis-opus",   "Ramaladni's Magnum Opus",     "weapon","1H Sword", "Barbarian",  "unique",[b(BU)]),
    u("ring-red-furor",    "Ring of Red Furor",           "ring",  "Ring",     "Barbarian",  "unique",[b(BU)]),
    u("fury-of-wilds",     "Fury of the Wilds",           "ring",  "Ring",     "Druid",      "unique",[b(BU)]),
    u("heart-of-azgar",    "Heart of Azgar",              "chest", "Chest",    "Druid",      "unique",[b(BU)]),
    u("purified-lightbringer","Purified Lightbringer",    "weapon","2H Mace",  "Druid",      "unique",[b(BU)]),
    u("mace-king-leoric",  "Mace of King Leoric",         "weapon","1H Mace",  "Necromancer","unique",[b(BU)]),
    u("red-blessing",      "Red Blessing",                "amulet","Amulet",   "Necromancer","unique",[b(BU)]),
    u("vengeful-sinew",    "Vengeful Sinew",              "chest", "Chest",    "Necromancer","unique",[b(BU)]),
    u("march-stalwart",    "March of the Stalwart Soul",  "boots", "Boots",    "Paladin",    "unique",[b(BU)]),
    u("red-sermon",        "Red Sermon",                  "weapon","2H Sword", "Paladin",    "unique",[b(BU)]),
    u("cowl-nameless",     "Cowl of the Nameless",        "helm",  "Helm",     "Rogue",      "unique",[b(BU)]),
    u("fist-iron-rose",    "Fist of the Iron Rose",       "gloves","Gloves",   "Rogue",      "unique",[b(BU)]),
    u("scoundrels-kiss",   "Scoundrel's Kiss",            "ring",  "Ring",     "Rogue",      "unique",[b(BU)]),
    u("emberfury",         "Emberfury",                   "amulet","Amulet",   "Sorcerer",   "unique",[b(BU)]),
    u("shanars-resonance", "Shanar's Resonance",          "offhand","Focus",   "Sorcerer",   "unique",[b(BU)]),
    u("staff-of-zerae",    "Staff of Zerae",              "weapon","Staff",    "Sorcerer",   "unique",[b(BU)]),
    u("hesha-e-kesungi",   "Hesha e Kesungi",             "gloves","Gloves",   "Spiritborn", "unique",[b(BU)]),
    u("path-emissary",     "Path of the Emissary",        "boots", "Boots",    "Spiritborn", "unique",[b(BU)]),
    u("hellbrand-signet",  "Hellbrand Signet",            "ring",  "Ring",     "Warlock",    "unique",[b(BU)]),
    u("lurid-pact",        "Lurid Pact",                  "ring",  "Ring",     "Warlock",    "unique",[b(BU)]),
    u("molochs-flame",     "Moloch's Beating Flame",      "amulet","Amulet",   "Warlock",    "unique",[b(BU)]),
    u("nails-gore-crowned","Nails of the Gore-Crowned",   "helm",  "Helm",     "Warlock",    "unique",[b(BU)]),

    // ══════════════════════════════════════════════════════════
    // DURIEL DROPS
    // ══════════════════════════════════════════════════════════
    u("100000-steps",      "100,000 Steps",               "boots", "Boots",    "Barbarian",  "unique",[b(DU)]),
    u("dark-stalker-med",  "Dark Stalker's Medallion",    "amulet","Amulet",   "Barbarian",  "unique",[b(DU)]),
    u("fractured-runestone","Fractured Runestone",        "ring",  "Ring",     "Druid",      "unique",[b(DU)]),
    u("greenwalker-oath",  "Greenwalker's Oath",          "boots", "Boots",    "Druid",      "unique",[b(DU)]),
    u("mark-old-wolf",     "Mark of the Old Wolf",        "ring",  "Ring",     "Druid",      "unique",[b(DU)]),
    u("mutilator-plate",   "Mutilator Plate",             "chest", "Chest",    "Necromancer","unique",[b(DU)]),
    u("path-tragoul",      "Path of Trag'Oul",            "boots", "Boots",    "Necromancer","unique",[b(DU)]),
    u("undercrown",        "The Undercrown",              "helm",  "Helm",     "Necromancer","unique",[b(DU)]),
    u("supplication",      "Supplication",                "weapon","1H Sword", "Paladin",    "unique",[b(DU)]),
    u("ward-white-dove",   "Ward of the White Dove",      "offhand","Shield",  "Paladin",    "unique",[b(DU)]),
    u("bands-ichorous-rose","Bands of Ichorous Rose",     "gloves","Gloves",   "Rogue",      "unique",[b(DU)]),
    u("condemnation",      "Condemnation",                "weapon","Dagger",   "Rogue",      "unique",[b(DU)]),
    u("sea-lords-gloves",  "Sea Lord's Fine Gloves",      "gloves","Gloves",   "Rogue",      "unique",[b(DU)]),
    u("blue-rose",         "Blue Rose",                   "ring",  "Ring",     "Sorcerer",   "unique",[b(DU)]),
    u("galvanic-azurite",  "Galvanic Azurite",            "ring",  "Ring",     "Sorcerer",   "unique",[b(DU)]),
    u("staff-endless-rage","Staff of Endless Rage",       "weapon","Staff",    "Sorcerer",   "unique",[b(DU)]),
    u("rod-of-kepeleke",   "Rod of Kepeleke",             "weapon","Quarterstaff","Spiritborn","unique",[b(DU)]),
    u("widows-web",        "Widow's Web",                 "amulet","Amulet",   "Spiritborn", "unique",[b(DU)]),
    u("wushe-nak-pa",      "Wushe Nak Pa",                "weapon","Glaive",   "Spiritborn", "unique",[b(DU)]),
    u("gauntlets-sheol",   "Gauntlets of Sheol",          "gloves","Gloves",   "Warlock",    "unique",[b(DU)]),
    u("rictus-terror",     "Rictus of Terror",            "helm",  "Helm",     "Warlock",    "unique",[b(DU)]),
    u("scourge-duriel",    "Scourge of Duriel",           "weapon","Flail",    "Warlock",    "unique",[b(DU)]),

    // ══════════════════════════════════════════════════════════
    // GRIGOIRE DROPS
    // Note: The Butcher's Cleaver is listed above (pool + Grigoire source)
    // ══════════════════════════════════════════════════════════
    u("gohrs-grips",       "Gohr's Devastating Grips",    "gloves","Gloves",   "Barbarian",  "unique",[b(GR)]),
    u("might-qual-kehk",   "Might of Qual-Kehk",          "gloves","Gloves",   "Barbarian",  "unique",[b(GR)]),
    u("hunters-zenith",    "Hunter's Zenith",             "ring",  "Ring",     "Druid",      "unique",[b(GR)]),
    u("the-basilisk",      "The Basilisk",                "weapon","Staff",    "Druid",      "unique",[b(GR)]),
    u("will-of-stone",     "Will of Stone",               "helm",  "Helm",     "Druid",      "unique",[b(GR)]),
    u("deathgrip",         "Deathgrip",                   "gloves","Gloves",   "Necromancer","unique",[b(GR)]),
    u("the-mortacrux",     "The Mortacrux",               "weapon","Dagger",   "Necromancer","unique",[b(GR)]),
    u("bastion-matthias",  "Bastion of Sir Matthias",     "offhand","Shield",  "Paladin",    "unique",[b(GR)]),
    u("sunbrand",          "Sunbrand",                    "weapon","Flail",    "Paladin",    "unique",[b(GR)]),
    u("desperate-march",   "Desperate March",             "boots", "Boots",    "Rogue",      "unique",[b(GR)]),
    u("the-maestro",       "The Maestro",                 "weapon","Dagger",   "Rogue",      "unique",[b(GR)]),
    u("strike-stormhorn",  "Strike of Stormhorn",         "offhand","Focus",   "Sorcerer",   "unique",[b(GR)]),
    u("vision-firestorm",  "Vision of the Firestorm",     "helm",  "Helm",     "Sorcerer",   "unique",[b(GR)]),
    u("peacemonger-signet","Peacemonger's Signet",        "ring",  "Ring",     "Spiritborn", "unique",[b(GR)]),
    u("sunstained-crozier","Sunstained War-Crozier",      "weapon","Quarterstaff","Spiritborn","unique",[b(GR)]),
    u("cage-of-madness",   "Cage of Madness",             "helm",  "Helm",     "Warlock",    "unique",[b(GR)]),
    u("hands-worldbreaker","Hands of the Worldbreaker",   "gloves","Gloves",   "Warlock",    "unique",[b(GR)]),
    u("seed-of-horazon",   "Seed of Horazon",             "amulet","Amulet",   "Warlock",    "unique",[b(GR)]),
    u("sire-of-sin",       "Sire of Sin",                 "ring",  "Ring",     "Warlock",    "unique",[b(GR)]),

    // ══════════════════════════════════════════════════════════
    // HARBINGER DROPS
    // ══════════════════════════════════════════════════════════
    u("bane-ahjad-den",    "Bane of Ahjad-Den",           "gloves","Gloves",   "Barbarian",  "unique",[b(HA)]),
    u("nomads-heart",      "Nomad's Longing Heart",       "amulet","Amulet",   "Barbarian",  "unique",[b(HA)]),
    u("ugly-bastard-helm", "Ugly Bastard Helm",           "helm",  "Helm",     "Barbarian",  "unique",[b(HA)]),
    u("fleshrender",       "Fleshrender",                 "weapon","1H Mace",  "Druid",      "unique",[b(HA)]),
    u("ifehs-dire-totem",  "Ifeh's Dire Totem",           "offhand","Totem",   "Druid",      "unique",[b(HA)]),
    u("might-ursine",      "Might of the Ursine",         "ring",  "Ring",     "Druid",      "unique",[b(HA)]),
    u("blood-wake",        "Blood Wake",                  "boots", "Boots",    "Necromancer","unique",[b(HA)]),
    u("pact-of-bone",      "Pact of Bone",                "ring",  "Ring",     "Necromancer","unique",[b(HA)]),
    u("gloom-ward",        "The Gloom Ward",              "offhand","Shield",  "Necromancer","unique",[b(HA)]),
    u("gate-red-dawn",     "Gate of the Red Dawn",        "offhand","Shield",  "Paladin",    "unique",[b(HA)]),
    u("mantle-grey",       "Mantle of the Grey",          "chest", "Chest",    "Paladin",    "unique",[b(HA)]),
    u("etnas-lost-dagger", "Etna's Lost Dagger",          "weapon","Dagger",   "Rogue",      "unique",[b(HA)]),
    u("scoundrels-leathers","Scoundrel's Leathers",       "pants", "Pants",    "Rogue",      "unique",[b(HA)]),
    u("shrouded-gift",     "Shrouded Gift",               "pants", "Pants",    "Rogue",      "unique",[b(HA)]),
    u("flameweaver",       "Flameweaver",                 "gloves","Gloves",   "Sorcerer",   "unique",[b(HA)]),
    u("sidhe-bindings",    "Sidhe Bindings",              "gloves","Gloves",   "Sorcerer",   "unique",[b(HA)]),
    u("tal-rashas-loop",   "Tal Rasha's Iridescent Loop", "ring",  "Ring",     "Sorcerer",   "unique",[b(HA)]),
    u("protean-heart",     "Protean Heart",               "amulet","Amulet",   "Spiritborn", "unique",[b(HA)]),
    u("sepazontec",        "Sepazontec",                  "weapon","Quarterstaff","Spiritborn","unique",[b(HA)]),
    u("bridle-torbalos",   "Bridle of Tor'Baalos",        "helm",  "Helm",     "Warlock",    "unique",[b(HA)]),
    u("spine-tathamet",    "Spine of Tathamet",           "weapon","1H Mace",  "Warlock",    "unique",[b(HA)]),
    u("fecund-seal",       "The Fecund Seal",             "ring",  "Ring",     "Warlock",    "unique",[b(HA)]),

    // ══════════════════════════════════════════════════════════
    // LORD ZIR DROPS
    // ══════════════════════════════════════════════════════════
    u("fields-crimson",    "Fields of Crimson",           "weapon","2H Sword", "Barbarian",  "unique",[b(LZ)]),
    u("twin-strikes",      "Twin Strikes",                "gloves","Gloves",   "Barbarian",  "unique",[b(LZ)]),
    u("gathlens-birthright","Gathlen's Birthright",       "helm",  "Helm",     "Druid",      "unique",[b(LZ)]),
    u("unsung-ascetic",    "Unsung Ascetic's Wraps",      "gloves","Gloves",   "Druid",      "unique",[b(LZ)]),
    u("waxing-gibbous",    "Waxing Gibbous",              "weapon","1H Axe",   "Druid",      "unique",[b(LZ)]),
    u("blood-artisan",     "Blood Artisan's Cuirass",     "chest", "Chest",    "Necromancer","unique",[b(LZ)]),
    u("cruors-embrace",    "Cruor's Embrace",             "gloves","Gloves",   "Necromancer","unique",[b(LZ)]),
    u("sanguivor",         "Sanguivor, Blade of Zir",     "weapon","2H Sword", "Necromancer","unique",[b(LZ)]),
    u("judgment-auriel",   "Judgment of Auriel",          "amulet","Amulet",   "Paladin",    "unique",[b(LZ)]),
    u("judicant-glaivehelm","Judicant's Glaivehelm",      "helm",  "Helm",     "Paladin",    "unique",[b(LZ)]),
    u("shroud-khanduras",  "Shroud of Khanduras",         "chest", "Chest",    "Rogue",      "unique",[b(LZ)]),
    u("skyhunter",         "Skyhunter",                   "weapon","Bow",      "Rogue",      "unique",[b(LZ)]),
    u("umbracrux",         "The Umbracrux",               "weapon","Dagger",   "Rogue",      "unique",[b(LZ)]),
    u("fang-vipermagi",    "Fang of the Vipermagi",       "weapon","Dagger",   "Sorcerer",   "unique",[b(LZ)]),
    u("rimeblood",         "Rimeblood",                   "gloves","Gloves",   "Sorcerer",   "unique",[b(LZ)]),
    u("staff-lam-esen",    "Staff of Lam Esen",           "weapon","Staff",    "Sorcerer",   "unique",[b(LZ)]),
    u("jacinth-shell",     "Jacinth Shell",               "chest", "Chest",    "Spiritborn", "unique",[b(LZ)]),
    u("ring-writhing-moon","Ring of Writhing Moon",       "ring",  "Ring",     "Spiritborn", "unique",[b(LZ)]),
    u("dirge-odium",       "Dirge of Odium",              "weapon","2H Axe",   "Warlock",    "unique",[b(LZ)]),
    u("elegy",             "Elegy",                       "weapon","1H Sword", "Warlock",    "unique",[b(LZ)]),
    u("fleshwrit-carapace","Fleshwrit Carapace",          "chest", "Chest",    "Warlock",    "unique",[b(LZ)]),

    // ══════════════════════════════════════════════════════════
    // URIVAR DROPS
    // ══════════════════════════════════════════════════════════
    u("mantle-mountain",   "Mantle of Mountain's Fury",   "chest", "Chest",    "Barbarian",  "unique",[b(UR)]),
    u("unbroken-chain",    "Unbroken Chain",              "amulet","Amulet",   "Barbarian",  "unique",[b(UR)]),
    u("dark-howl",         "Dark Howl",                   "gloves","Gloves",   "Druid",      "unique",[b(UR)]),
    u("dolmen-stone",      "Dolmen Stone",                "amulet","Amulet",   "Druid",      "unique",[b(UR)]),
    u("kilt-blackwing",    "Kilt of Blackwing",           "pants", "Pants",    "Druid",      "unique",[b(UR)]),
    u("gospel-devotee",    "Gospel of the Devotee",       "offhand","Focus",   "Necromancer","unique",[b(UR)]),
    u("will-rathma",       "Will of Rathma",              "amulet","Amulet",   "Necromancer","unique",[b(UR)]),
    u("cathedals-song",    "Cathedral's Song",            "offhand","Shield",  "Paladin",    "unique",[b(UR)]),
    u("heralds-morningstar","Herald's Morningstar",       "weapon","1H Mace",  "Paladin",    "unique",[b(UR)]),
    u("cassias-grace",     "Cassia's Grace",              "weapon","Bow",      "Rogue",      "unique",[b(UR)]),
    u("windforce",         "Windforce",                   "weapon","Bow",      "Rogue",      "unique",[b(UR)]),
    u("writhing-trickery", "Writhing Band of Trickery",   "ring",  "Ring",     "Rogue",      "unique",[b(UR)]),
    u("flamescar",         "Flamescar",                   "weapon","Wand",     "Sorcerer",   "unique",[b(UR)]),
    u("iceheart-brais",    "Iceheart Brais",              "pants", "Pants",    "Sorcerer",   "unique",[b(UR)]),
    u("molten-band",       "Molten Band",                 "ring",  "Ring",     "Sorcerer",   "unique",[b(UR)]),
    u("band-first-breath", "Band of First Breath",        "ring",  "Ring",     "Spiritborn", "unique",[b(UR)]),
    u("sunbirds-gorget",   "Sunbird's Gorget",            "amulet","Amulet",   "Spiritborn", "unique",[b(UR)]),
    u("cowl-malefic",      "Cowl of Malefic Torment",     "helm",  "Helm",     "Warlock",    "unique",[b(UR)]),
    u("infernal-homunculus","Infernal Homunculus",        "offhand","Focus",   "Warlock",    "unique",[b(UR)]),
    u("blade-sight-aflame","The Blade of Sight Aflame",   "weapon","1H Sword", "Warlock",    "unique",[b(UR)]),

    // ══════════════════════════════════════════════════════════
    // VARSHAN DROPS
    // ══════════════════════════════════════════════════════════
    u("overkill",          "Overkill",                    "weapon","2H Mace",  "Barbarian",  "unique",[b(VA)]),
    u("sabre-tsasgal",     "Sabre of Tsasgal",            "weapon","1H Sword", "Barbarian",  "unique",[b(VA)]),
    u("autumnal-crown",    "Autumnal Crown",              "helm",  "Helm",     "Druid",      "unique",[b(VA)]),
    u("greatstaff-crone",  "Greatstaff of the Crone",     "weapon","Staff",    "Druid",      "unique",[b(VA)]),
    u("stone-vehemen",     "Stone of Vehemen",            "offhand","Totem",   "Druid",      "unique",[b(VA)]),
    u("deathspeaker",      "Deathspeaker's Pendant",      "amulet","Amulet",   "Necromancer","unique",[b(VA)]),
    u("hangmans-hand",     "Hangman's Hand",              "gloves","Gloves",   "Necromancer","unique",[b(VA)]),
    u("hand-of-naz",       "The Hand of Naz",             "gloves","Gloves",   "Necromancer","unique",[b(VA)]),
    u("seal-second-trumpet","Seal of the Second Trumpet", "ring",  "Ring",     "Paladin",    "unique",[b(VA)]),
    u("wreath-auric-laurel","Wreath of Auric Laurel",     "ring",  "Ring",     "Paladin",    "unique",[b(VA)]),
    u("deaths-pavane",     "Death's Pavane",              "pants", "Pants",    "Rogue",      "unique",[b(VA)]),
    u("eaglehorn",         "Eaglehorn",                   "weapon","Bow",      "Rogue",      "unique",[b(VA)]),
    u("pitfighters-gull",  "Pitfighter's Gull",           "ring",  "Ring",     "Rogue",      "unique",[b(VA)]),
    u("levin-grasp",       "Levin Grasp",                 "gloves","Gloves",   "Sorcerer",   "unique",[b(VA)]),
    u("onyx-soul",         "Onyx Soul",                   "offhand","Focus",   "Sorcerer",   "unique",[b(VA)]),
    u("raiment-sea",       "Raiment of the Sea",          "chest", "Chest",    "Sorcerer",   "unique",[b(VA)]),
    u("vox-omnium",        "Vox Omnium",                  "weapon","Staff",    "Sorcerer",   "unique",[b(VA)]),
    u("balazans-maxtlatl", "Balazan's Maxtlatl",          "pants", "Pants",    "Spiritborn", "unique",[b(VA)]),
    u("wound-drinker",     "Wound Drinker",               "ring",  "Ring",     "Spiritborn", "unique",[b(VA)]),
    u("aegrom-schism",     "Ae'grom's Schism",            "chest", "Chest",    "Warlock",    "unique",[b(VA)]),
    u("seal-ophanim",      "Seal of the Ophanim",         "ring",  "Ring",     "Warlock",    "unique",[b(VA)]),
    u("thrice-woven",      "Thrice-Woven Nightmare",      "gloves","Gloves",   "Warlock",    "unique",[b(VA)])

  ], // end uniques

  // ── LEGENDARY ASPECTS ──────────────────────────────────────
  // Since Lord of Hatred, aspects are fully drop-driven (salvage legendaries).
  // The Codex of Power auto-upgrades when you salvage a better roll.
  aspects: [
    // ALL CLASSES
    { id:"aspect-protector", name:"Aspect of the Protector",     class:"all",         category:"Defensive", slots:["Helm","Chest","Pants","Amulet"],              effect:"Damaging an Elite grants a Barrier up to [X] damage for 10 seconds. 30s cooldown.", source:"Salvage Legendary drops" },
    { id:"eluding",          name:"Eluding Aspect",              class:"all",         category:"Utility",   slots:["Boots","Helm","Chest","Pants","Gloves","Amulet"],effect:"Becoming Injured while Crowd Controlled grants Unstoppable for 4 seconds.",       source:"Salvage Legendary drops" },
    { id:"accelerating",     name:"Accelerating Aspect",         class:"all",         category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Critical Strikes with Core Skills increase Attack Speed by [15–25]% for 5 seconds.", source:"Salvage Legendary drops" },
    { id:"aspect-might",     name:"Aspect of Might",             class:"all",         category:"Defensive", slots:["Helm","Chest","Pants","Amulet"],               effect:"Basic Skills grant [20]% Damage Reduction for [2–6] seconds.",                    source:"Salvage Legendary drops" },
    { id:"rapid",            name:"Rapid Aspect",                class:"all",         category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Basic Skills gain [15–30]% increased Attack Speed.",                             source:"Salvage Legendary drops" },
    { id:"exploiters",       name:"Exploiter's Aspect",          class:"all",         category:"Utility",   slots:["Boots","Helm","Chest","Pants","Gloves","Amulet"],effect:"[20]% increased CC duration. While enemies are Unstoppable, deal [20–50]%[x] increased damage to them.", source:"Salvage Legendary drops" },
    { id:"retribution",      name:"Aspect of Retribution",       class:"all",         category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Distant enemies have a [8–20]% chance to be Stunned for 2 seconds when they hit you.", source:"Salvage Legendary drops" },
    // BARBARIAN
    { id:"bul-kathos",       name:"Aspect of Bul-Kathos",        class:"Barbarian",   category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Leap creates an Earthquake on landing, dealing [X] damage over 4 seconds.",     source:"Salvage Legendary drops" },
    { id:"iron-warrior",     name:"Iron Warrior Aspect",         class:"Barbarian",   category:"Defensive", slots:["Helm","Chest","Pants","Amulet"],               effect:"Iron Skin grants Unstoppable and [X]% Base Life as Fortify.",                  source:"Salvage Legendary drops" },
    { id:"echoing-fury",     name:"Echoing Fury Shout Aspect",   class:"Barbarian",   category:"Utility",   slots:["Boots","Helm","Chest","Pants","Gloves","Amulet"],effect:"Your Shout Skills generate [2–4] Fury per second while active.",              source:"Salvage Legendary drops" },
    { id:"limitless-rage",   name:"Aspect of Limitless Rage",    class:"Barbarian",   category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Each point of Fury generated while at max Fury grants your next Core Skill [1%] increased damage, up to [30%].", source:"Salvage Legendary drops" },
    // DRUID
    { id:"retaliation",      name:"Aspect of Retaliation",       class:"Druid",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Nature Magic Skills deal up to [20–40]%[x] increased damage based on your % of Maximum Fortify.", source:"Salvage Legendary drops" },
    { id:"stormclaw",        name:"Stormclaw's Aspect",          class:"Druid",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Critical Strikes with Shred deal [X]% of the damage dealt as Lightning to the target and nearby enemies.", source:"Salvage Legendary drops" },
    { id:"tempest",          name:"Tempest Roar Aspect",         class:"Druid",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Lucky Hit: Storm Skills have up to a [XX]% chance to grant [3] Spirit.", source:"Salvage Legendary drops" },
    // NECROMANCER
    { id:"unyielding-commander","name":"Unyielding Commander's Aspect", name:"Unyielding Commander's Aspect",class:"Necromancer",category:"Utility",slots:["Helm","Chest","Pants","Gloves","Boots","Amulet"],effect:"While Army of the Dead is active, minions deal [70–100]%[x] increased damage and take [90]% reduced damage.", source:"Salvage Legendary drops" },
    { id:"bone-cloak",       name:"Aspect of the Bone Cloak",    class:"Necromancer", category:"Defensive", slots:["Helm","Chest","Pants","Amulet"],               effect:"Consuming an Essence gives your Bone Armor a [3%] chance to absorb [X] damage for you.", source:"Salvage Legendary drops" },
    { id:"grasping-veins",   name:"Aspect of Grasping Veins",    class:"Necromancer", category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Corpse Tendrils grants [X]% increased Critical Strike Chance for [6–10] seconds against pulled enemies.", source:"Salvage Legendary drops" },
    // PALADIN
    { id:"radiant-faith",    name:"Aspect of Radiant Faith",     class:"Paladin",     category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Gain [X]% increased Holy damage for each active Oath.",                         source:"Salvage Legendary drops" },
    { id:"divine-wrath",     name:"Divine Wrath Aspect",         class:"Paladin",     category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Smite has a [15–25]% chance to Stun enemies for 2 seconds.",                    source:"Salvage Legendary drops" },
    // ROGUE
    { id:"umbrous",          name:"Umbrous Aspect",              class:"Rogue",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Lucky Hit: Critical Strikes with Ranged Skills have up to a [X]% chance to grant a free use of Dark Shroud.", source:"Salvage Legendary drops" },
    { id:"blade-dancer",     name:"Blade Dancer's Aspect",       class:"Rogue",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Twisting Blades orbit for a short time after they return, dealing [10–20]%[x] of Twisting Blades' damage.", source:"Salvage Legendary drops" },
    { id:"shadow-bleeder",   name:"Shadow Bleeder Aspect",       class:"Rogue",       category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Dealing direct damage with Shadow Imbued skills has a [20]% chance to spread Shadow Imbuement.", source:"Salvage Legendary drops" },
    // SORCERER
    { id:"splintering",      name:"Splintering Energy Aspect",   class:"Sorcerer",    category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Lightning Spear has a [11–20]% chance to spawn an additional Lightning Spear when you activate it.", source:"Salvage Legendary drops" },
    { id:"frozen-orbit",     name:"Frozen Orbit Aspect",         class:"Sorcerer",    category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Frozen Orb stays in place after reaching its destination and explodes [2] additional times for [50]% of its damage.", source:"Salvage Legendary drops" },
    { id:"glacial",          name:"Glacial Aspect",              class:"Sorcerer",    category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"When you cast Blizzard, it periodically expels a Frost Bolt that deals [X] damage with 100% Chill chance.", source:"Salvage Legendary drops" },
    // SPIRITBORN
    { id:"seismic-shift",    name:"Seismic Shift Aspect",        class:"Spiritborn",  category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Crushing Hand hits a second time for [X]% of the original damage.",            source:"Salvage Legendary drops" },
    // WARLOCK
    { id:"infernal-pact",    name:"Infernal Pact Aspect",        class:"Warlock",     category:"Offensive", slots:["Gloves","Ring","Amulet","Weapon"],              effect:"Each point of Favor you generate has a [X]% chance to grant a free Imprint.",  source:"Salvage Legendary drops" }
  ],

  // ── HORADRIC CUBE RECIPES ──────────────────────────────────
  cubeRecipes: {
    gearModification: [
      { id:"add-affix",     name:"Add Affix",          icon:"➕", description:"Adds a random affix to an item with fewer than 4 affixes.", materials:"Primordial Dust (tier scales with item power) + Optional: Tuning Prism", usesTuningPrisms:true,  pro:"Build items from scratch — best for base items with 0–2 affixes.", tip:"Use a Tuning Prism to control affix category (Offensive, Defensive, etc.)." },
      { id:"focus-reroll",  name:"Focus Reroll",       icon:"🎯", description:"Rerolls ONE specific affix of your choice on an item.",      materials:"Primordial Dust + Optional: Tuning Prism",                            usesTuningPrisms:true,  pro:"Best general-purpose recipe. Keeps good affixes, rerolls bad ones.",     tip:"Use Tuning Prism to steer toward a specific affix category. Most efficient method." },
      { id:"chaotic-reroll",name:"Chaotic Reroll",     icon:"🎲", description:"Rerolls ALL affixes on an item randomly.",                   materials:"Higher tier Primordial Dust",                                          usesTuningPrisms:false, pro:"Nuclear option — use when every single affix is bad.",                   tip:"⚠️ Risky! Save for completely bricked items." },
      { id:"remove-affix",  name:"Remove Affix",       icon:"➖", description:"Removes one specific affix you select from an item.",        materials:"Primordial Dust",                                                      usesTuningPrisms:false, pro:"Combo: Remove bad affix → Add Affix (with Prism) for targeted slot.",    tip:"Fish for All Resistance: Add Resist twice, remove single Resist (50/50 chance to keep All Resist)." },
      { id:"transfigure",   name:"Transfigure Item",   icon:"🔄", description:"Changes the item type while keeping the same slot.",         materials:"High tier Primordial Dust + Entropic or Kullean Tuning Prism",        usesTuningPrisms:true,  pro:"Force a specific item base type (e.g., turn a Sword into a Mace).",      tip:"Kullean/Entropic Prisms control the transfiguration outcome category." },
      { id:"unique-reroll", name:"Unique Power Reroll",icon:"⚡", description:"Rerolls the value range of a Unique item's special power.",  materials:"Boss Trophy (from any Lair Boss) + Primordial Dust",                  usesTuningPrisms:false, pro:"Push a good unique with a bad power roll to max potential.",             tip:"Collect Boss Trophies — don't discard them! They fuel this recipe." }
    ],
    itemTransmutation: [
      { id:"three-to-one",  name:"3-to-1 Transmutation",  icon:"3️⃣→1️⃣", description:"Converts 3 same-slot items into 1 item of that slot at higher rarity. Common → Unique is possible!", materials:"3× items (same slot, any rarity) + Primordial Dust", usesTuningPrisms:false, pro:"Best method for General Pool uniques with no dedicated boss.", tip:"Also perfect for recycling bricked items you rolled badly on." },
      { id:"charm-craft",   name:"Unique Charm Craft",    icon:"✨",      description:"Crafts a Unique Charm for your charm set.",                                                            materials:"Horadric Resin + Boss Trophies",                       usesTuningPrisms:false, pro:"Target-craft specific charm powers for your build.",         tip:"Horadric Resin comes from salvaging Talisman Charms and Seals — hoard them!" },
      { id:"reroll-charm",  name:"Reroll Set Charm",      icon:"🔁",      description:"Rerolls a Set Charm, with a chance to obtain Greater Affixes.",                                       materials:"Horadric Resin + Primordial Dust",                     usesTuningPrisms:false, pro:"Can grant Greater Affixes on Charms — significant power boost.", tip:"Worth doing once you have good base charms to push for GA rolls." }
    ]
  },

  // ── LEGENDARY GEAR BUILD WORKFLOW ─────────────────────────
  legendaryWorkflow: [
    { step:1, icon:"🔍", name:"Find a Base Item",            detail:"Get a Rare or Legendary in the correct slot. Endgame target: Ancestral (Item Power 900+). Farm Helltide, Nightmare Dungeons, or Transfigure via Cube." },
    { step:2, icon:"⚗️", name:"Roll Affixes (Horadric Cube)",detail:"Use Add Affix to build from scratch, or Focus Reroll to replace bad stats. Combine with Tuning Prisms for category control." },
    { step:3, icon:"📖", name:"Imprint Aspect (Occultist)",  detail:"The aspect must be in your Codex of Power (auto-added when you salvage a legendary with that aspect at the Blacksmith). Costs gold + Veiled Crystals." },
    { step:4, icon:"🔨", name:"Temper (Blacksmith)",         detail:"⚠️ LIMITED re-rolls per Temper slot! Choose your temper category first, then the specific temper from your build guide. Apply carefully." },
    { step:5, icon:"⭐", name:"Masterwork (Blacksmith)",     detail:"MW 12 for max power. Every 4 MW levels, ONE random stat gets a stackable 25% bonus. Use Resplendent Sparks to target the stat that matters most." }
  ],

  // ── TUNING PRISMS ─────────────────────────────────────────
  tuningPrisms: [
    { name:"Aggressive Tuning Prism",  controls:"Offensive affixes",        icon:"⚔️", examples:"Critical Strike Damage, Attack Speed, Skill Damage" },
    { name:"Protector's Tuning Prism", controls:"Defensive affixes",        icon:"🛡️", examples:"Maximum Life, Damage Reduction, Armor" },
    { name:"Pragmatic Tuning Prism",   controls:"Mobility & Utility affixes",icon:"🏃", examples:"Movement Speed, Cooldown Reduction" },
    { name:"Resourceful Tuning Prism", controls:"Resource affixes",         icon:"💧", examples:"Resource Cost Reduction, Resource Generation" },
    { name:"Adept's Tuning Prism",     controls:"Skill & Core Stat affixes", icon:"📚", examples:"Skill Ranks, Core Stats (Strength, Dexterity, etc.)" },
    { name:"Chromatic Tuning Prism",   controls:"Resistance affixes",       icon:"🌈", examples:"All Resistance, Fire Resistance, etc." },
    { name:"Entropic Tuning Prism",    controls:"Transfiguration (type A)",  icon:"🌀", examples:"Controls Transfigure outcome — pair with Kullean" },
    { name:"Kullean Tuning Prism",     controls:"Transfiguration (type B)",  icon:"🌀", examples:"Controls Transfigure outcome — pair with Entropic" }
  ]

}; // end D4DB
