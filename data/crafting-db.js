// ============================================================
// NEPHALEM'S CODEX — Horadric Cube Crafting Database
// Season 14: Death Awakening | Lord of Hatred Expansion
// Sources: Game8, D4Guides.gg, Sportskeeda, D4Builds (July 2026)
// ============================================================
// DATA STRUCTURE:
//   CRAFTING_DB.prisms  — Tuning Prism definitions
//   CRAFTING_DB.affixes — All rollable affixes with prism + slot + class data
//
// SLOT IDs (must match app.js gearSlot IDs):
//   helm chest gloves pants boots amulet ring
//   weapon  (covers all weapon types: 1H and 2H)
//   offhand (shield, focus, totem)
//   w2h-blunt w2h-slash w1h-main w1h-off (Barbarian Arsenal slots)
//
// PRISM IDs:
//   aggressive protector adept resourceful pragmatic chromatic none
// ============================================================

const CRAFTING_DB = {

  // ── TUNING PRISMS ─────────────────────────────────────────────
  prisms: {
    aggressive: {
      id:       "aggressive",
      name:     "Aggressive Tuning Prism",
      short:    "Aggressive",
      icon:     "⚔️",
      color:    "#c0392b",
      bg:       "rgba(192,57,43,0.15)",
      border:   "rgba(192,57,43,0.4)",
      category: "Offensive",
      desc:     "Targets offensive affixes: damage, crit, attack speed, and damage multipliers.",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    adept: {
      id:       "adept",
      name:     "Adept's Tuning Prism",
      short:    "Adept's",
      icon:     "📚",
      color:    "#8e44ad",
      bg:       "rgba(142,68,173,0.15)",
      border:   "rgba(142,68,173,0.4)",
      category: "Skill Ranks & Core Stats",
      desc:     "Targets skill rank bonuses and all four core stats (Strength, Dexterity, Intelligence, Willpower). Note: core stats also appear in the Aggressive pool!",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    protector: {
      id:       "protector",
      name:     "Protector's Tuning Prism",
      short:    "Protector's",
      icon:     "🛡️",
      color:    "#2980b9",
      bg:       "rgba(41,128,185,0.15)",
      border:   "rgba(41,128,185,0.4)",
      category: "Defensive",
      desc:     "Targets defensive affixes: Maximum Life, Armor, resistances, Damage Reduction, and Dodge Chance.",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    resourceful: {
      id:       "resourceful",
      name:     "Resourceful Tuning Prism",
      short:    "Resourceful",
      icon:     "💧",
      color:    "#27ae60",
      bg:       "rgba(39,174,96,0.15)",
      border:   "rgba(39,174,96,0.4)",
      category: "Resource",
      desc:     "Targets resource affixes: Maximum Resource, Resource Generation, Cost Reduction, and per-kill/Lucky Hit resource restoration.",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    pragmatic: {
      id:       "pragmatic",
      name:     "Pragmatic Tuning Prism",
      short:    "Pragmatic",
      icon:     "🏃",
      color:    "#d68910",
      bg:       "rgba(214,137,16,0.15)",
      border:   "rgba(214,137,16,0.4)",
      category: "Utility & Mobility",
      desc:     "Targets utility and mobility affixes: CDR, Lucky Hit Chance, Movement Speed, Healing Received, Evade bonuses, and Potion Capacity.",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    chromatic: {
      id:       "chromatic",
      name:     "Chromatic Tuning Prism",
      short:    "Chromatic",
      icon:     "🌈",
      color:    "#16a085",
      bg:       "rgba(22,160,133,0.15)",
      border:   "rgba(22,160,133,0.4)",
      category: "Individual Resistances",
      desc:     "Targets ONE specific elemental resistance. Use when you want a single resistance type. Overlaps with Protector's but is more targeted.",
      farmNote: "Drops from War Plans Cache, Tree of Whispers, and Elite Monsters.",
    },
    none: {
      id:       "none",
      name:     "No Tuning Prism",
      short:    "Untargetable",
      icon:     "❌",
      color:    "#7f8c8d",
      bg:       "rgba(127,140,141,0.1)",
      border:   "rgba(127,140,141,0.3)",
      category: "Cannot Be Targeted",
      desc:     "These affixes CANNOT be targeted by any Tuning Prism. They roll completely randomly — you cannot steer toward them. Plan around them accordingly.",
      farmNote: "Must come from random rolls. You can lock other affixes to re-roll around these.",
    },
  },

  // ── WEAPON TYPE TAGS ──────────────────────────────────────────
  // Used to tag weapon-specific affixes (e.g., some only appear on 2H weapons)
  weaponTypes: {
    all:    "All Weapons",
    "1h":   "1H Weapons Only",
    "2h":   "2H Weapons Only",
    sword:  "Swords Only",
    mace:   "Maces/Hammers Only",
    ranged: "Bows/Crossbows Only",
  },

  // ── AFFIX DATABASE ────────────────────────────────────────────
  // prisms: Array of prism IDs that can roll this affix (most have one, some have two)
  // slots:  Array of slot IDs where this affix can appear
  // class:  "all" or specific class name; class-restricted affixes won't show for other classes
  // note:   Optional clarification shown in the simulator
  affixes: [

    // ══════════════════════════════════════════════════════════
    // AGGRESSIVE — Offensive Affixes
    // ══════════════════════════════════════════════════════════

    // — Damage multipliers (all classes, weapon/ring/amulet) —
    { id:"weapon-damage",     name:"Weapon Damage",                  prisms:["aggressive"],           slots:["weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all",         note:"Weapon slot only. Inherent on some weapon types." },
    { id:"crit-damage",       name:"Critical Strike Damage",         prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"One of the most powerful offensive stats." },
    { id:"crit-chance",       name:"Critical Strike Chance",         prisms:["aggressive"],           slots:["weapon","gloves","ring","amulet","helm","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Common on gloves, ring, and weapon." },
    { id:"attack-speed",      name:"Attack Speed",                   prisms:["aggressive"],           slots:["weapon","gloves","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Not available on 2H weapons for some classes." },
    { id:"vulnerable-damage", name:"Vulnerable Damage",              prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"all-damage",        name:"All Damage Multiplier",          prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"dot-damage",        name:"Damage Over Time",               prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"thorns",            name:"Thorns",                         prisms:["aggressive","pragmatic"],slots:["helm","chest","pants","ring","amulet"],                                          class:"all", note:"Appears under both Aggressive and Pragmatic pools." },

    // — Element damage multipliers —
    { id:"fire-damage",       name:"Fire Damage Multiplier",         prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"cold-damage",       name:"Cold Damage Multiplier",         prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"lightning-damage",  name:"Lightning Damage Multiplier",    prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"physical-damage",   name:"Physical Damage Multiplier",     prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"shadow-damage",     name:"Shadow Damage Multiplier",       prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"poison-damage",     name:"Poison Damage Multiplier",       prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"holy-damage",       name:"Holy Damage Multiplier",         prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },

    // — Situational damage —
    { id:"damage-cc",         name:"Damage to Crowd Controlled",     prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-close",      name:"Damage to Close Enemies",        prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-distant",    name:"Damage to Distant Enemies",      prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-injured",    name:"Damage to Injured Enemies",      prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"damage-frozen",     name:"Damage to Frozen Enemies",       prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"damage-bleeding",   name:"Damage to Bleeding Enemies",     prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },
    { id:"overpower-damage",  name:"Damage per Overpower Stack",     prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"all" },

    // — Class-specific offensive affixes —
    { id:"brawling-damage",   name:"Brawling Damage",                prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"weapon-damage-barb",name:"Damage when Swapping Weapons",  prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"Barbarian" },
    { id:"2h-blunt-damage",   name:"2H Bludgeoning Weapon Damage",  prisms:["aggressive"],           slots:["ring","amulet","w2h-blunt"],                                                    class:"Barbarian" },
    { id:"2h-slash-damage",   name:"2H Slashing Weapon Damage",     prisms:["aggressive"],           slots:["ring","amulet","w2h-slash"],                                                    class:"Barbarian" },
    { id:"dual-wield-damage", name:"Damage with Dual-Wielded Weapons",prisms:["aggressive"],         slots:["ring","amulet","w1h-main"],                                                     class:"Barbarian" },
    { id:"berserking-damage", name:"Damage while Berserking",        prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"],           class:"Barbarian" },
    { id:"ancient-damage",    name:"Ancient Damage",                 prisms:["aggressive"],           slots:["weapon","ring","amulet","w2h-blunt","w2h-slash"],                               class:"Barbarian" },

    { id:"companion-damage",  name:"Companion Damage",               prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Druid" },
    { id:"storm-damage",      name:"Storm Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Druid" },
    { id:"earth-damage",      name:"Earth Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Druid" },

    { id:"bone-damage",       name:"Bone Damage",                    prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Necromancer" },
    { id:"blood-damage",      name:"Blood Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Necromancer" },
    { id:"darkness-damage",   name:"Darkness Damage",                prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Necromancer" },
    { id:"corpse-explosion-chance",name:"Corpse Explosion Double Dmg",prisms:["aggressive"],         slots:["weapon","ring","amulet","offhand"],                                              class:"Necromancer" },

    { id:"agility-damage",    name:"Agility Damage",                 prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Rogue" },
    { id:"cutthroat-damage",  name:"Cutthroat Damage",               prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Rogue" },
    { id:"marksman-damage",   name:"Marksman Damage",                prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Rogue" },
    { id:"combo-damage",      name:"Damage per Combo Point",         prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Rogue" },
    { id:"trap-damage",       name:"Trap/Grenade Damage",            prisms:["aggressive"],           slots:["weapon","ring","amulet","gloves"],                                              class:"Rogue" },

    { id:"conjuration-damage",name:"Conjuration Damage",             prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Sorcerer" },
    { id:"pyromancy-damage",  name:"Pyromancy Damage",               prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Sorcerer" },
    { id:"frost-damage",      name:"Frost Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Sorcerer" },
    { id:"shock-damage",      name:"Shock Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Sorcerer" },
    { id:"mastery-damage",    name:"Mastery Skill Damage",           prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Sorcerer" },

    { id:"eagle-damage",      name:"Eagle Skill Damage",             prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Spiritborn" },
    { id:"gorilla-damage",    name:"Gorilla Skill Damage",           prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Spiritborn" },
    { id:"jaguar-damage",     name:"Jaguar Skill Damage",            prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Spiritborn" },
    { id:"centipede-damage",  name:"Centipede Skill Damage",         prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Spiritborn" },
    { id:"resolve-damage",    name:"Damage when Spending Resolve",   prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Spiritborn" },

    { id:"abyss-damage",      name:"Abyss Damage",                   prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Warlock" },
    { id:"demonology-damage", name:"Demonology Damage",              prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Warlock" },
    { id:"archfiend-damage",  name:"Archfiend Damage",               prisms:["aggressive"],           slots:["weapon","ring","amulet","offhand"],                                              class:"Warlock" },
    { id:"shadowform-damage", name:"Damage while Shadowform Active", prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Warlock" },
    { id:"demonform-damage",  name:"Demonform Damage Bonus",         prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Warlock" },
    { id:"arbiter-damage",    name:"Damage while in Arbiter Form",   prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Paladin" },
    { id:"juggernaut-damage", name:"Juggernaut Damage",              prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Paladin" },
    { id:"judged-damage",     name:"Damage to Judged Enemies",       prisms:["aggressive"],           slots:["weapon","ring","amulet"],                                                       class:"Paladin" },
    { id:"blood-orb-damage",  name:"Damage After Picking Up Blood Orb",prisms:["aggressive"],        slots:["weapon","ring","amulet"],                                                       class:"Necromancer" },

    // ══════════════════════════════════════════════════════════
    // ADEPT'S — Core Stats & Skill Ranks
    // Note: Core stats also appear in Aggressive pool (see above)!
    // ══════════════════════════════════════════════════════════

    // Core stats — available in BOTH Adept's and Aggressive pools
    { id:"strength",          name:"Strength",                       prisms:["adept","aggressive"],   slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Available in both Adept's and Aggressive pools — a key flexibility for conflict resolution!" },
    { id:"dexterity",         name:"Dexterity",                      prisms:["adept","aggressive"],   slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Available in both Adept's and Aggressive pools." },
    { id:"intelligence",      name:"Intelligence",                   prisms:["adept","aggressive"],   slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Available in both Adept's and Aggressive pools." },
    { id:"willpower",         name:"Willpower",                      prisms:["adept","aggressive"],   slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all", note:"Available in both Adept's and Aggressive pools." },

    // All-skill ranks — Adept's only, restricted slots
    { id:"all-skills",        name:"+Ranks to All Skills",           prisms:["adept"],                slots:["amulet"],                                                                       class:"all",         note:"Amulet only for the broad +All Skills bonus." },
    { id:"basic-skills",      name:"+Ranks to Basic Skills",         prisms:["adept"],                slots:["helm","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],          class:"all" },
    { id:"core-skills",       name:"+Ranks to Core Skills",          prisms:["adept"],                slots:["helm","chest","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },

    // Class-specific skill ranks — Adept's only
    { id:"weapon-mastery-skills",name:"+Ranks to Weapon Mastery",   prisms:["adept"],                slots:["helm","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],          class:"Barbarian" },
    { id:"shout-skills",      name:"+Ranks to Shout Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"brawling-skills",   name:"+Ranks to Brawling Skills",      prisms:["adept"],                slots:["helm","chest","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"companion-skills",  name:"+Ranks to Companion Skills",     prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Druid" },
    { id:"wrath-skills",      name:"+Ranks to Wrath Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Druid" },
    { id:"storm-skills",      name:"+Ranks to Storm Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Druid" },
    { id:"curse-skills",      name:"+Ranks to Curse Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Necromancer" },
    { id:"bone-skills",       name:"+Ranks to Bone Skills",          prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Necromancer" },
    { id:"blood-skills",      name:"+Ranks to Blood Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Necromancer" },
    { id:"imbuement-skills",  name:"+Ranks to Imbuement Skills",     prisms:["adept"],                slots:["helm","chest","amulet","weapon"],                                               class:"Rogue" },
    { id:"cutthroat-skills",  name:"+Ranks to Cutthroat Skills",     prisms:["adept"],                slots:["helm","chest","amulet","weapon"],                                               class:"Rogue" },
    { id:"marksman-skills",   name:"+Ranks to Marksman Skills",      prisms:["adept"],                slots:["helm","chest","amulet","weapon"],                                               class:"Rogue" },
    { id:"conjuration-skills",name:"+Ranks to Conjuration Skills",   prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Sorcerer" },
    { id:"pyromancy-skills",  name:"+Ranks to Pyromancy Skills",     prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Sorcerer" },
    { id:"frost-skills",      name:"+Ranks to Frost Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Sorcerer" },
    { id:"shock-skills",      name:"+Ranks to Shock Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Sorcerer" },
    { id:"mastery-skills",    name:"+Ranks to Mastery Skills",       prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Sorcerer" },
    { id:"eagle-skills",      name:"+Ranks to Eagle Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Spiritborn" },
    { id:"gorilla-skills",    name:"+Ranks to Gorilla Skills",       prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Spiritborn" },
    { id:"jaguar-skills",     name:"+Ranks to Jaguar Skills",        prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Spiritborn" },
    { id:"centipede-skills",  name:"+Ranks to Centipede Skills",     prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Spiritborn" },
    { id:"potency-skills",    name:"+Ranks to Potency Skills",       prisms:["adept"],                slots:["helm","amulet","weapon","offhand"],                                             class:"Spiritborn" },
    { id:"abyss-skills",      name:"+Ranks to Abyss Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Warlock" },
    { id:"demonology-skills", name:"+Ranks to Demonology Skills",    prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Warlock" },
    { id:"juggernaut-skills", name:"+Ranks to Juggernaut Skills",    prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Paladin" },
    { id:"faith-skills",      name:"+Ranks to Faith Skills",         prisms:["adept"],                slots:["helm","chest","amulet","weapon","offhand"],                                     class:"Paladin" },

    // ══════════════════════════════════════════════════════════
    // PROTECTOR'S — Defensive Affixes
    // ══════════════════════════════════════════════════════════

    { id:"max-life",          name:"Maximum Life",                   prisms:["protector"],            slots:["helm","chest","gloves","pants","ring","amulet","offhand"],                      class:"all",         note:"One of the most universally useful defensive stats." },
    { id:"armor",             name:"Armor",                          prisms:["protector"],            slots:["helm","chest","gloves","pants","boots","offhand"],                              class:"all" },
    { id:"life-regen",        name:"Life Regeneration",              prisms:["protector"],            slots:["helm","chest","ring","amulet"],                                                 class:"all" },
    { id:"life-on-hit",       name:"Life on Hit",                    prisms:["protector"],            slots:["helm","chest","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"life-on-kill",      name:"Life per Kill",                  prisms:["protector"],            slots:["ring","amulet","boots"],                                                       class:"all" },
    { id:"damage-reduction",  name:"Damage Reduction",               prisms:["protector"],            slots:["helm","chest","pants","offhand","amulet"],                                      class:"all" },
    { id:"dodge-chance",      name:"Dodge Chance",                   prisms:["protector"],            slots:["pants","boots","ring","amulet"],                                               class:"all" },
    // Resistance to All Elements — Protector's only (not Chromatic)
    { id:"all-resist",        name:"Resistance to All Elements",     prisms:["protector"],            slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Protector's for All Resist. Chromatic only targets individual resistances." },
    // Individual resistances — BOTH Protector's and Chromatic can target these
    { id:"fire-resist",       name:"Fire Resistance",                prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds. Protector's pool includes all resist types." },
    { id:"cold-resist",       name:"Cold Resistance",                prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds." },
    { id:"lightning-resist",  name:"Lightning Resistance",           prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds." },
    { id:"poison-resist",     name:"Poison Resistance",              prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds." },
    { id:"shadow-resist",     name:"Shadow Resistance",              prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds." },
    { id:"physical-resist",   name:"Physical Resistance",            prisms:["protector","chromatic"],slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],              class:"all",         note:"Use Chromatic for better targeting odds." },

    // ══════════════════════════════════════════════════════════
    // RESOURCEFUL — Resource Affixes
    // ══════════════════════════════════════════════════════════

    { id:"max-resource",      name:"Maximum Resource",               prisms:["resourceful"],          slots:["helm","chest","gloves","ring","amulet"],                                        class:"all" },
    { id:"resource-gen",      name:"Resource Generation",            prisms:["resourceful"],          slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],          class:"all" },
    { id:"resource-cost",     name:"Resource Cost Reduction",        prisms:["resourceful"],          slots:["helm","chest","gloves","ring","amulet","boots"],                                class:"all" },
    { id:"resource-on-kill",  name:"Resource per Kill",              prisms:["resourceful"],          slots:["ring","amulet","weapon","boots","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"resource-on-lh",   name:"Resource on Lucky Hit",          prisms:["resourceful"],          slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],          class:"all" },
    { id:"resource-regen",    name:"Resource per Second",            prisms:["resourceful"],          slots:["helm","chest","amulet"],                                                        class:"all",         note:"Specific resource type per class (e.g., Fury per Second for Barbarian)." },

    // ══════════════════════════════════════════════════════════
    // PRAGMATIC — Utility & Mobility Affixes
    // ══════════════════════════════════════════════════════════

    { id:"cdr",               name:"Cooldown Reduction",             prisms:["pragmatic"],            slots:["helm","chest","gloves","ring","amulet"],                                        class:"all" },
    { id:"lucky-hit-chance",  name:"Lucky Hit Chance",               prisms:["pragmatic"],            slots:["helm","gloves","boots","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"move-speed",        name:"Movement Speed",                 prisms:["pragmatic"],            slots:["boots","pants","amulet","ring"],                                               class:"all" },
    { id:"healing-received",  name:"Healing Received",               prisms:["pragmatic"],            slots:["helm","chest","pants","boots","ring","amulet"],                                 class:"all" },
    { id:"max-evade",         name:"Maximum Evade Charges",          prisms:["pragmatic"],            slots:["boots","pants","amulet"],                                                      class:"all" },
    { id:"evade-move-speed",  name:"Evade Grants Movement Speed",    prisms:["pragmatic"],            slots:["boots","amulet"],                                                              class:"all" },
    { id:"evade-cdr",         name:"Attacks Reduce Evade Cooldown",  prisms:["pragmatic"],            slots:["boots","gloves","amulet"],                                                     class:"all" },
    { id:"potion-capacity",   name:"Potion Capacity",                prisms:["pragmatic"],            slots:["pants","boots","ring"],                                                        class:"all" },
    { id:"impairment-reduction",name:"Impairment Reduction",         prisms:["pragmatic"],            slots:["helm","chest","pants","boots","amulet"],                                        class:"all",         note:"Reduces duration of stuns, slows, and other CC effects on you." },

    // ══════════════════════════════════════════════════════════
    // NO TUNING PRISM — Cannot be targeted (random only)
    // ══════════════════════════════════════════════════════════

    { id:"fortify-gen",       name:"Fortify Generation",             prisms:["none"],                 slots:["helm","chest","gloves","pants","boots","amulet"],                               class:"all",         note:"⚠️ CANNOT be targeted by any Tuning Prism. Rolls completely at random." },
    { id:"barrier-gen",       name:"Barrier Generation",             prisms:["none"],                 slots:["helm","chest","gloves","pants","boots","amulet"],                               class:"all",         note:"⚠️ CANNOT be targeted by any Tuning Prism. Rolls completely at random." },
  ],

  // ── INHERENT AFFIXES BY WEAPON TYPE ──────────────────────────
  // These affixes ALWAYS appear on the weapon — they don't need to be rolled.
  // Knowing this helps players understand they only need 2-3 rolled affixes on weapons.
  weaponInherents: {
    "1H Sword":        ["Critical Strike Damage"],
    "2H Sword":        ["Critical Strike Damage (×2 value)"],
    "1H Axe":          ["Damage Over Time"],
    "2H Axe":          ["Damage Over Time (×2 value)"],
    "1H Mace":         ["Overpower Damage"],
    "2H Mace":         ["Overpower Damage (×2 value)"],
    "Dagger":          ["Attack Speed"],
    "Wand":            ["Critical Strike Chance"],
    "Staff":           ["Critical Strike Chance + Damage"],
    "Bow":             ["Attack Speed"],
    "Crossbow":        ["Critical Strike Damage"],
    "Polearm":         ["Lucky Hit Chance"],
    "Glaive":          ["Critical Strike Chance"],
    "Flail":           ["Attack Speed"],
    "1H Scythe":       ["Overpower Damage"],
    "2H Scythe":       ["Overpower Damage (×2 value)"],
    "Focus":           ["Critical Strike Chance"],
    "Totem":           ["Critical Strike Chance"],
    "Shield":          ["Armor"],
    "Quarterstaff":    ["Attack Speed + Lucky Hit Chance"],
  },

};
