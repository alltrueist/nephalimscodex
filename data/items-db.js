// ============================================================
// NEPHALEM'S CODEX — D4 Item Database
// Season 14: Death Awakening | Lord of Hatred Expansion
// Last Updated: July 2026
// ------------------------------------------------------------
// HOW TO ADD ITEMS:
//   - Uniques: Add to D4DB.uniques array
//   - Aspects: Add to D4DB.aspects array
//   - Bosses: Add to D4DB.bosses array
// ============================================================

const D4DB = {

  // ── META ──────────────────────────────────────────────────
  meta: {
    season: 14,
    seasonName: "Death Awakening",
    expansion: "Lord of Hatred",
    lastUpdated: "July 2026"
  },

  // ── GEAR SLOTS ────────────────────────────────────────────
  gearSlots: [
    { id: "helm",       label: "Helm",        icon: "🪖" },
    { id: "chest",      label: "Chest",       icon: "🛡️" },
    { id: "gloves",     label: "Gloves",      icon: "🧤" },
    { id: "pants",      label: "Pants",       icon: "👖" },
    { id: "boots",      label: "Boots",       icon: "👢" },
    { id: "amulet",     label: "Amulet",      icon: "📿" },
    { id: "ring1",      label: "Ring 1",      icon: "💍" },
    { id: "ring2",      label: "Ring 2",      icon: "💍" },
    { id: "weapon1",    label: "Weapon 1",    icon: "⚔️" },
    { id: "weapon2",    label: "Weapon 2",    icon: "🗡️" },
    { id: "offhand",    label: "Off-Hand",    icon: "🛡️" }
  ],

  // ── CLASSES ───────────────────────────────────────────────
  classes: [
    "Barbarian", "Druid", "Necromancer", "Paladin",
    "Rogue", "Sorcerer", "Spiritborn", "Warlock"
  ],

  // ── LAIR BOSSES ───────────────────────────────────────────
  bosses: [
    {
      id: "varshan",
      name: "Echo of Varshan",
      tier: "Initiate",
      keyMaterial: "Malignant Heart",
      keySource: "Whisper Caches, Grotesque Debtors",
      mythicChance: false,
      notes: "Good source for class-specific uniques. Run first when gearing up."
    },
    {
      id: "lord-zir",
      name: "Lord Zir",
      tier: "Initiate",
      keyMaterial: "Exquisite Blood",
      keySource: "Bloodseeker enemies, Helltide",
      mythicChance: false,
      notes: "Class-specific unique drops. Strong early-endgame farming target."
    },
    {
      id: "grigoire",
      name: "Grigoire, the Galvanic Saint",
      tier: "Initiate",
      keyMaterial: "Live Seedling",
      keySource: "Living Steel Chests in Helltide",
      mythicChance: false,
      notes: "Class-specific unique drops."
    },
    {
      id: "beast-in-ice",
      name: "The Beast in Ice",
      tier: "Initiate",
      keyMaterial: "Distilled Fear",
      keySource: "Nightmare Dungeons (Tier 30+)",
      mythicChance: false,
      notes: "Class-specific unique drops."
    },
    {
      id: "urivar",
      name: "Urivar",
      tier: "Initiate",
      keyMaterial: "Urivar's Essence",
      keySource: "War Plans, Helltide (Lord of Hatred)",
      mythicChance: false,
      notes: "New boss in Lord of Hatred expansion. Season-specific drops."
    },
    {
      id: "astaroth",
      name: "Astaroth, the Charred Duke",
      tier: "Greater",
      keyMaterial: "Smoldering Ash",
      keySource: "Elite monsters, War Plans",
      mythicChance: true,
      notes: "Greater boss with higher unique rarity. Mythic drops possible."
    },
    {
      id: "bartuc",
      name: "Bartuc, Lord of Chaos",
      tier: "Greater",
      keyMaterial: "Blood-Soaked Armor",
      keySource: "Elite monsters, Helltide",
      mythicChance: true,
      notes: "Greater boss. Good Mythic farming target."
    },
    {
      id: "duriel",
      name: "Duriel, King of Maggots",
      tier: "Greater",
      keyMaterial: "Mucus-Slick Egg + Shards of Agony",
      keySource: "Varshan (Egg) + Grigoire (Shards)",
      mythicChance: true,
      notes: "Top Mythic farming boss alongside Andariel. Farm Initiate bosses to get key materials."
    },
    {
      id: "andariel",
      name: "Echo of Andariel",
      tier: "Greater",
      keyMaterial: "Sandscorched Shackles + Pincushioned Doll",
      keySource: "Lord Zir (Shackles) + Beast in Ice (Doll)",
      mythicChance: true,
      notes: "Top Mythic farming boss. Equal to Duriel for Mythic chances."
    },
    {
      id: "harbinger",
      name: "Harbinger of Hatred",
      tier: "Greater",
      keyMaterial: "Hatred's Toll",
      keySource: "Urivar boss drops, War Plans (Lord of Hatred)",
      mythicChance: true,
      notes: "New Greater boss in Lord of Hatred. Strong Mythic source."
    },
    {
      id: "belial",
      name: "Belial, Lord of Lies",
      tier: "Exalted",
      keyMaterial: "Betrayer's Husk (×2)",
      keySource: "Drops from Greater Lair Bosses",
      mythicChance: true,
      notes: "Highest Mythic drop chance in the game. Guarantees an Ancestral Unique. Pinnacle boss of Lord of Hatred."
    }
  ],

  // ── GENERAL UNIQUE POOL ───────────────────────────────────
  generalUniquePool: [
    "Azurewrath", "Banished Lord's Talisman", "Blood-Mad Idol",
    "Crown of Lucion", "Endurant Faith", "Fists of Fate",
    "Flickerstep", "Frostburn", "Godslayer Crown",
    "Locran's Talisman", "Mother's Embrace", "Paingorger's Gauntlets",
    "Penitent Greaves", "Rakanoth's Wake", "Razorplate",
    "Rustbitten Dirk", "Shard of Verathiel", "Signet of Pelghain",
    "Soulbrand", "Tassets of the Dawning Sky", "Temerity",
    "The Butcher's Cleaver", "Thousand-Eye Reaver", "Thundergod's Blessing",
    "Tibault's Will", "Wendigo Brand", "Wyrdskin",
    "X'Fal's Corroded Signet", "Yen's Blessing"
  ],

  // ── UNIQUE ITEMS ──────────────────────────────────────────
  uniques: [
    // ── GENERAL POOL (all classes) ──
    {
      id: "tibaults-will",
      name: "Tibault's Will",
      slot: "pants",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Pants (any rarity) → chance at Tibault's Will", type: "cube" }
      ],
      uniquePower: "You deal [20–40]%[x] increased damage while Unstoppable. While Unstoppable, you gain [60–100] of your Primary Resource.",
      notes: "No dedicated boss. Horadric Cube 3-to-1 is the most reliable method."
    },
    {
      id: "temerity",
      name: "Temerity",
      slot: "pants",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Pants (any rarity) → chance at Temerity", type: "cube" }
      ],
      uniquePower: "Effects that Heal you beyond your Maximum Life grant you a Barrier up to [40–80]% of your Maximum Life for 8 seconds.",
      notes: "No dedicated boss. Use Cube 3-to-1 for best odds."
    },
    {
      id: "fists-of-fate",
      name: "Fists of Fate",
      slot: "gloves",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Gloves (any rarity) → chance at Fists of Fate", type: "cube" }
      ],
      uniquePower: "Your attacks randomly deal [1–300%] of their normal damage.",
      notes: "High variance item, beloved for Lucky Hit builds."
    },
    {
      id: "flickerstep",
      name: "Flickerstep",
      slot: "boots",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Boots (any rarity) → chance at Flickerstep", type: "cube" }
      ],
      uniquePower: "Each enemy you Evade through reduces your active Cooldowns by [0.5–1.5] seconds, up to [3–5] seconds.",
      notes: "Core for Evade-focused builds."
    },
    {
      id: "godslayer-crown",
      name: "Godslayer Crown",
      slot: "helm",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Helms (any rarity) → chance at Godslayer Crown", type: "cube" }
      ],
      uniquePower: "When you stun, freeze, or immobilize an Elite enemy or Boss, it takes [30–60]% increased damage from all sources for 3 seconds.",
      notes: "Strong for crowd control builds."
    },
    {
      id: "razorplate",
      name: "Razorplate",
      slot: "chest",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Chest Armor (any rarity) → chance at Razorplate", type: "cube" }
      ],
      uniquePower: "Gain [X] Thorns for each percent of Life you are missing.",
      notes: "Core for Thorns builds (Barbarian, Necromancer)."
    },
    {
      id: "paingorgers-gauntlets",
      name: "Paingorger's Gauntlets",
      slot: "gloves",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Gloves (any rarity) → chance", type: "cube" }
      ],
      uniquePower: "Non-Basic Skills cast randomly cause your last Evaded-through enemy to explode for [400–600%] damage.",
      notes: "Strong for high hit-rate builds."
    },
    {
      id: "soulbrand",
      name: "Soulbrand",
      slot: "chest",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Chest Armor → chance", type: "cube" }
      ],
      uniquePower: "Your Healing Potions no longer heal instantly. Instead, gain a Barrier equal to [150–250]% of the healing for [5–9] seconds.",
      notes: "Synergizes with Barrier-focused builds."
    },
    {
      id: "penitent-greaves",
      name: "Penitent Greaves",
      slot: "boots",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Boots → chance", type: "cube" }
      ],
      uniquePower: "You leave behind a trail of frost that Chills enemies. You deal [8–16]%[x] more damage to Chilled enemies.",
      notes: "Used for Cold-based builds that need consistent chill application."
    },
    {
      id: "mothers-embrace",
      name: "Mother's Embrace",
      slot: "ring",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Rings → chance", type: "cube" }
      ],
      uniquePower: "If a Core Skill hits 5 or more enemies, [20–40]% of the Resource cost is refunded.",
      notes: "Great for AoE resource-hungry builds."
    },
    {
      id: "thundergods-blessing",
      name: "Thundergod's Blessing",
      slot: "pants",
      class: "all",
      sources: [
        { label: "General Unique Pool", detail: "Any Lair Boss (low rate)", type: "pool" },
        { label: "Horadric Cube – 3-to-1", detail: "3× Pants → chance", type: "cube" }
      ],
      uniquePower: "Striking enemies with Lightning damage has a [10–20]% chance to summon a Lightning Bolt striking for [200–400]% Lightning damage.",
      notes: "Lightning-themed universal unique."
    },
    // ── MYTHICS (all classes) ──
    {
      id: "the-grandfather",
      name: "The Grandfather",
      slot: "weapon1",
      class: "Barbarian",
      sources: [
        { label: "Mythic Unique – All Tormented Bosses", detail: "Very rare drop. Belial has highest chance.", type: "boss", boss: "belial" }
      ],
      uniquePower: "Increases your Critical Strike Damage by [60–100]%. The other properties on this item can roll higher than normal.",
      notes: "Mythic Unique. Extremely rare. Target farm Belial (Exalted Boss) or Greater bosses."
    },
    {
      id: "harlequin-crest",
      name: "Harlequin Crest",
      slot: "helm",
      class: "all",
      sources: [
        { label: "Mythic Unique – All Tormented Bosses", detail: "Very rare. Belial has highest chance.", type: "boss", boss: "belial" }
      ],
      uniquePower: "Gain [10–20]% Damage Reduction. In addition, gain +[4] Ranks to all Skills.",
      notes: "Mythic Unique. One of the best items in the game for any class."
    },
    {
      id: "tyraels-might",
      name: "Tyrael's Might",
      slot: "chest",
      class: "all",
      sources: [
        { label: "Mythic Unique – All Tormented Bosses", detail: "Very rare. Belial has highest chance.", type: "boss", boss: "belial" }
      ],
      uniquePower: "You are immune to Slows and take [20–40]%[x] less damage from Elites. Attacks reduce the duration of Elite buffs by [2–4] seconds.",
      notes: "Mythic Unique."
    },
    {
      id: "andariel-visage",
      name: "Andariel's Visage",
      slot: "helm",
      class: "all",
      sources: [
        { label: "Mythic Unique – All Tormented Bosses", detail: "Very rare. Belial has highest chance.", type: "boss", boss: "belial" }
      ],
      uniquePower: "Lucky Hit: Up to a [15–25]% chance to trigger a poison nova that applies [X] Poisoning damage over 5 seconds to nearby enemies.",
      notes: "Mythic Unique. Strong for Poison builds."
    },
    // ── BARBARIAN ──
    {
      id: "skull-grasp",
      name: "Skull Grasp",
      slot: "ring",
      class: "Barbarian",
      sources: [
        { label: "Grigoire", detail: "Dedicated Barbarian drop", type: "boss", boss: "grigoire" },
        { label: "Varshan", detail: "Secondary source", type: "boss", boss: "varshan" }
      ],
      uniquePower: "Whirlwind pulls in Distant enemies and your Whirlwind Radius is increased by [X]%.",
      notes: "Core for Whirlwind Barbarian builds."
    },
    // ── ROGUE ──
    {
      id: "word-of-hakan",
      name: "Word of Hakan",
      slot: "amulet",
      class: "Rogue",
      sources: [
        { label: "Andariel", detail: "Dedicated Rogue amulet drop", type: "boss", boss: "andariel" },
        { label: "Duriel", detail: "Secondary source", type: "boss", boss: "duriel" }
      ],
      uniquePower: "Your Rain of Arrows is always Imbued with all Imbuements at once.",
      notes: "Key for Rain of Arrows Rogue builds."
    },
    {
      id: "band-of-ichorous-rose",
      name: "Band of the Ichorous Rose",
      slot: "gloves",
      class: "Rogue",
      sources: [
        { label: "Grigoire", detail: "Dedicated Rogue drop", type: "boss", boss: "grigoire" },
        { label: "Urivar", detail: "Secondary source", type: "boss", boss: "urivar" },
        { label: "Harbinger of Hatred", detail: "Secondary source", type: "boss", boss: "harbinger" }
      ],
      uniquePower: "Poison Trap always deals its full damage over 3 seconds. Benefits from all upgrades increased by 50–150%[x].",
      notes: "Season 8 Rogue unique. Poison Trap build staple."
    },
    // ── SORCERER ──
    {
      id: "hail-of-verglas",
      name: "Hail of Verglas",
      slot: "helm",
      class: "Sorcerer",
      sources: [
        { label: "Grigoire", detail: "Dedicated drop", type: "boss", boss: "grigoire" },
        { label: "Duriel", detail: "Secondary source", type: "boss", boss: "duriel" },
        { label: "Beast in Ice", detail: "Secondary source", type: "boss", boss: "beast-in-ice" }
      ],
      uniquePower: "Ice Shards spreads with 2 additional shards. You deal [1–2]%[x] increased damage per hit for 5 seconds, stacking up to 75–100%.",
      notes: "Season 8 Sorcerer unique. Ice Shards build core."
    },
    // ── DRUID ──
    {
      id: "gathlen-birthright",
      name: "Gathlen's Birthright",
      slot: "helm",
      class: "Druid",
      sources: [
        { label: "Beast in Ice", detail: "Dedicated Druid drop", type: "boss", boss: "beast-in-ice" },
        { label: "Urivar", detail: "Secondary source", type: "boss", boss: "urivar" }
      ],
      uniquePower: "In Human form, every 300–150 Nature Magic Critical Strikes grant Anima of the Forest for 15 seconds.",
      notes: "Season 8 Druid unique."
    },
    // ── NECROMANCER ──
    {
      id: "lidless-wall",
      name: "Lidless Wall",
      slot: "offhand",
      class: "Necromancer",
      sources: [
        { label: "Duriel", detail: "Dedicated Necromancer drop", type: "boss", boss: "duriel" },
        { label: "Andariel", detail: "Secondary source", type: "boss", boss: "andariel" }
      ],
      uniquePower: "Lucky Hit: While you have an active Bone Storm, hitting an enemy outside of a Bone Storm has up to [20–40]% chance to spawn an additional Bone Storm at their location.",
      notes: "Core for Bone Storm Necromancer builds."
    },
    // ── SPIRITBORN ──
    {
      id: "sunbird-gorget",
      name: "Sunbird's Gorget",
      slot: "amulet",
      class: "Spiritborn",
      sources: [
        { label: "Varshan", detail: "Dedicated Spiritborn drop", type: "boss", boss: "varshan" },
        { label: "Duriel", detail: "Secondary source", type: "boss", boss: "duriel" },
        { label: "Andariel", detail: "Secondary source", type: "boss", boss: "andariel" }
      ],
      uniquePower: "Picking up a Storm Feather forms a firestorm around you for 8 seconds.",
      notes: "Season 8 Spiritborn unique."
    }
  ],

  // ── LEGENDARY ASPECTS ─────────────────────────────────────
  aspects: [
    // ALL CLASSES
    { id: "aspect-protector", name: "Aspect of the Protector", class: "all", category: "Defensive",
      slots: ["Helm", "Chest", "Pants", "Amulet"],
      effect: "Damaging an Elite grants a Barrier up to [X] damage for 10 seconds. 30-second cooldown.",
      source: "Salvage Legendary drops (drop-driven since Lord of Hatred)" },
    { id: "eluding", name: "Eluding Aspect", class: "all", category: "Utility",
      slots: ["Boots", "Helm", "Chest", "Pants", "Gloves", "Amulet"],
      effect: "Becoming Injured while Crowd Controlled grants Unstoppable for 4 seconds. [X] second cooldown.",
      source: "Salvage Legendary drops" },
    { id: "accelerating", name: "Accelerating Aspect", class: "all", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Critical Strikes with Core Skills increase your Attack Speed by [15–25]% for 5 seconds.",
      source: "Salvage Legendary drops" },
    { id: "aspect-of-might", name: "Aspect of Might", class: "all", category: "Defensive",
      slots: ["Helm", "Chest", "Pants", "Amulet"],
      effect: "Basic Skills grant [20]% Damage Reduction for [2–6] seconds.",
      source: "Salvage Legendary drops" },
    { id: "rapid", name: "Rapid Aspect", class: "all", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Basic Skills gain [15–30]% increased Attack Speed.",
      source: "Salvage Legendary drops" },
    { id: "exploiters", name: "Exploiter's Aspect", class: "all", category: "Utility",
      slots: ["Boots", "Helm", "Chest", "Pants", "Gloves", "Amulet"],
      effect: "You have [20]% increased Crowd Control duration. While enemies are Unstoppable, you deal [20–50]%[x] increased damage to them.",
      source: "Salvage Legendary drops" },
    // BARBARIAN
    { id: "bul-kathos-momentum", name: "Aspect of Bul-Kathos", class: "Barbarian", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Leap creates an Earthquake on landing, dealing [X] damage over 4 seconds.",
      source: "Salvage Legendary drops" },
    { id: "iron-warrior", name: "Iron Warrior Aspect", class: "Barbarian", category: "Defensive",
      slots: ["Helm", "Chest", "Pants", "Amulet"],
      effect: "Iron Skin grants Unstoppable and [X]% Base Life as Fortify.",
      source: "Salvage Legendary drops" },
    // ROGUE
    { id: "umbrous", name: "Umbrous Aspect", class: "Rogue", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Lucky Hit: Critical Strikes with Ranged Skills have up to a [X]% chance to grant a free use of Dark Shroud.",
      source: "Salvage Legendary drops" },
    { id: "blade-dancer", name: "Blade Dancer's Aspect", class: "Rogue", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Twisting Blades orbit for a short time after they return to you, dealing [10–20]%[x] of Twisting Blades' damage.",
      source: "Salvage Legendary drops" },
    // SORCERER
    { id: "splintering-energy", name: "Splintering Energy Aspect", class: "Sorcerer", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Lightning Spear has a [11–20]% chance to spawn an additional Lightning Spear when you activate it.",
      source: "Salvage Legendary drops" },
    { id: "frozen-orbit", name: "Frozen Orbit Aspect", class: "Sorcerer", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Frozen Orb stays in place after reaching its destination and explodes [2] additional times for [50]% of its damage.",
      source: "Salvage Legendary drops" },
    // NECROMANCER
    { id: "unyielding-commander", name: "Unyielding Commander's Aspect", class: "Necromancer", category: "Utility",
      slots: ["Helm", "Chest", "Pants", "Gloves", "Boots", "Amulet"],
      effect: "While Army of the Dead is active, your minions deal [70–100]%[x] increased damage and take [90]% reduced damage.",
      source: "Salvage Legendary drops" },
    // DRUID
    { id: "retaliation", name: "Aspect of Retaliation", class: "Druid", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Your Nature Magic Skills deal up to [20–40]%[x] increased damage based on your % of Maximum Fortify.",
      source: "Salvage Legendary drops" },
    { id: "storm-beast", name: "Stormclaw's Aspect", class: "Druid", category: "Offensive",
      slots: ["Gloves", "Ring", "Amulet", "Weapon"],
      effect: "Critical Strikes with Shred deal [X]% of the damage dealt as Lightning to the target and surrounding enemies.",
      source: "Salvage Legendary drops" }
  ],

  // ── HORADRIC CUBE RECIPES ─────────────────────────────────
  cubeRecipes: {
    gearModification: [
      {
        id: "add-affix",
        name: "Add Affix",
        icon: "➕",
        description: "Adds a new random affix to an item that currently has fewer than 4 affixes.",
        materials: "Primordial Dust (tier scales with item power) + Optional: Tuning Prism",
        usesTuningPrisms: true,
        pro: "Build items from scratch — great for base items with 0–2 affixes.",
        tip: "Use a Tuning Prism to control affix category (Offensive, Defensive, etc.)"
      },
      {
        id: "focus-reroll",
        name: "Focus Reroll",
        icon: "🎯",
        description: "Rerolls ONE specific affix of your choice on an item.",
        materials: "Primordial Dust + Optional: Tuning Prism",
        usesTuningPrisms: true,
        pro: "Best general-purpose upgrade. Keeps your good affixes, rerolls bad ones.",
        tip: "Use Tuning Prism to steer toward a specific category. Most efficient refinement recipe."
      },
      {
        id: "chaotic-reroll",
        name: "Chaotic Reroll",
        icon: "🎲",
        description: "Rerolls ALL affixes on an item randomly.",
        materials: "Higher tier Primordial Dust",
        usesTuningPrisms: false,
        pro: "Nuclear option — use when every affix is bad.",
        tip: "Risky! Save for completely bricked items."
      },
      {
        id: "remove-affix",
        name: "Remove Affix",
        icon: "➖",
        description: "Removes one specific affix you select from an item.",
        materials: "Primordial Dust",
        usesTuningPrisms: false,
        pro: "Useful combo: Remove bad affix → Add Affix (with Prism) for targeted replacement.",
        tip: "Can fish for All Resistance: Add Resist twice, then remove single Resist (50/50 chance of keeping All Resist)."
      },
      {
        id: "transfigure",
        name: "Transfigure Item",
        icon: "🔄",
        description: "Completely changes the item type while keeping the same slot.",
        materials: "High tier Primordial Dust + Entropic or Kullean Tuning Prism",
        usesTuningPrisms: true,
        pro: "Use to target specific item bases.",
        tip: "Kullean/Entropic Prisms control the transfiguration outcome category."
      },
      {
        id: "unique-power-reroll",
        name: "Unique Power Reroll",
        icon: "⚡",
        description: "Rerolls the value range of a Unique item's special power affix.",
        materials: "Boss Trophy (from a Lair Boss) + Primordial Dust",
        usesTuningPrisms: false,
        pro: "Upgrade a good unique with a bad power roll to max potential.",
        tip: "Collect Boss Trophies as crafting materials — don't discard them!"
      }
    ],
    itemTransmutation: [
      {
        id: "three-to-one",
        name: "3-to-1 Transmutation",
        icon: "3️⃣→1️⃣",
        description: "Converts 3 items of the same slot into 1 item of that slot with higher rarity. Common → Unique is possible!",
        materials: "3× items (same slot, any rarity) + Primordial Dust",
        usesTuningPrisms: false,
        pro: "Best method for General Pool uniques (Tibault's Will, Temerity, etc.) with no dedicated boss.",
        tip: "Also excellent for recycling 'bricked' items you rolled badly on."
      },
      {
        id: "unique-charm-craft",
        name: "Unique Charm Craft",
        icon: "✨",
        description: "Crafts a Unique Charm for your charm set.",
        materials: "Horadric Resin + Boss Trophies",
        usesTuningPrisms: false,
        pro: "Target-craft specific charm powers for your build.",
        tip: "Horadric Resin comes from salvaging Talisman Charms and Seals. Hoard these!"
      },
      {
        id: "reroll-charm",
        name: "Reroll Set Charm",
        icon: "🔁",
        description: "Rerolls a Set Charm, with a chance to grant Greater Affixes.",
        materials: "Horadric Resin + Primordial Dust",
        usesTuningPrisms: false,
        pro: "Can obtain Greater Affixes on Charms — significant power boost.",
        tip: "Worth doing after you have good charm pieces to push for GA rolls."
      }
    ]
  },

  // ── LEGENDARY GEAR BUILDING WORKFLOW ──────────────────────
  legendaryWorkflow: [
    {
      step: 1,
      icon: "🔍",
      name: "Find a Base Item",
      description: "Get an item in the correct gear slot. For endgame, target Ancestral items (Item Power 900).",
      detail: "Farm Helltide, Nightmare Dungeons, or use Horadric Cube Transfiguration to get the right slot.",
      cubeRecipe: "transfigure"
    },
    {
      step: 2,
      icon: "⚗️",
      name: "Roll Your Affixes (Horadric Cube)",
      description: "Use the Cube to get the 3–4 affixes your build guide specifies.",
      detail: "Use Add Affix to build from scratch, or Focus Reroll to replace bad stats. Use Tuning Prisms for better control.",
      cubeRecipe: "add-affix"
    },
    {
      step: 3,
      icon: "📖",
      name: "Imprint the Aspect (Occultist)",
      description: "Visit the Occultist (NPC in any main town) to imprint the required Legendary Aspect.",
      detail: "The aspect must be in your Codex of Power (auto-added when you salvage a legendary with that aspect). Imprinting costs gold + Veiled Crystals.",
      cubeRecipe: null
    },
    {
      step: 4,
      icon: "🔨",
      name: "Temper (Blacksmith)",
      description: "Visit the Blacksmith to apply Tempers. Each item has 2 Temper slots.",
      detail: "⚠️ You have a LIMITED number of re-rolls per Temper slot! Apply carefully. Choose the temper category, then the specific temper from your build guide.",
      cubeRecipe: null
    },
    {
      step: 5,
      icon: "⭐",
      name: "Masterwork (Blacksmith)",
      description: "Use Masterworking at the Blacksmith to amplify your best stats.",
      detail: "Upgrade to MW 12 for maximum power. Every 4 MW levels, ONE random stat gets a 25% bonus (stackable). Target your highest-value stat.",
      cubeRecipe: null
    }
  ],

  // ── TUNING PRISM GUIDE ────────────────────────────────────
  tuningPrisms: [
    { name: "Aggressive Tuning Prism", controls: "Offensive affixes", icon: "⚔️", examples: "Critical Strike Damage, Attack Speed, Skill Damage" },
    { name: "Protector's Tuning Prism", controls: "Defensive affixes", icon: "🛡️", examples: "Maximum Life, Damage Reduction, Armor" },
    { name: "Pragmatic Tuning Prism", controls: "Mobility & Utility affixes", icon: "🏃", examples: "Movement Speed, Cooldown Reduction" },
    { name: "Resourceful Tuning Prism", controls: "Resource affixes", icon: "💧", examples: "Resource Cost Reduction, Resource Generation" },
    { name: "Adept's Tuning Prism", controls: "Skill & Core Stat affixes", icon: "📚", examples: "Skill Ranks, Core Stats (Strength, Dexterity, etc.)" },
    { name: "Chromatic Tuning Prism", controls: "Resistance affixes", icon: "🌈", examples: "All Resistance, Fire Resistance, etc." },
    { name: "Entropic Tuning Prism", controls: "Transfiguration (item type)", icon: "🌀", examples: "Controls Transfigure recipe outcome" },
    { name: "Kullean Tuning Prism", controls: "Transfiguration (item type)", icon: "🌀", examples: "Controls Transfigure recipe outcome" }
  ]
};
