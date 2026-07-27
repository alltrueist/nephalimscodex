// ============================================================
// NEPHALEM'S CODEX — Horadric Cube Crafting Database
// Season 14: Death Awakening | Lord of Hatred Expansion
//
// SOURCES (confirmed per-slot data):
//   Game8.co — per-slot affix lists for each gear piece
//   D4Guides.gg — Tuning Prism pool descriptions
//   lexi.gg — per-slot affix lists grouped by class
//   D4Builds.gg/database/gear-affixes — affix type database
//
// SLOT IDs: helm chest gloves pants boots amulet ring
//           weapon offhand (non-Barbarian)
//           w2h-blunt w2h-slash w1h-main w1h-off (Barbarian Arsenal)
//
// PRISM IDs: aggressive adept protector resourceful pragmatic chromatic none
//
// KEY MECHANIC:
//   Focus Reroll RANDOMLY picks which affix of a prism category gets changed.
//   You CANNOT choose the specific slot — the Cube picks for you.
//   Only ONE lock (via Enchanter) can be active per item at any time.
// ============================================================

const CRAFTING_DB = {

  // ── TUNING PRISMS ─────────────────────────────────────────────
  prisms: {
    aggressive: {
      id:"aggressive", name:"Aggressive Tuning Prism", short:"Aggressive",
      icon:"⚔️", color:"#c0392b", bg:"rgba(192,57,43,0.15)", border:"rgba(192,57,43,0.4)",
      category:"Offensive",
      desc:"Targets offensive affixes: damage, crit, attack speed, and damage multipliers.",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    adept: {
      id:"adept", name:"Adept's Tuning Prism", short:"Adept's",
      icon:"📚", color:"#8e44ad", bg:"rgba(142,68,173,0.15)", border:"rgba(142,68,173,0.4)",
      category:"Skill Ranks & Core Stats",
      desc:"Targets +skill ranks and all four core stats (Str, Dex, Int, Will). Core stats also appear in the Aggressive pool — this gives them flexibility.",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    protector: {
      id:"protector", name:"Protector's Tuning Prism", short:"Protector's",
      icon:"🛡️", color:"#2980b9", bg:"rgba(41,128,185,0.15)", border:"rgba(41,128,185,0.4)",
      category:"Defensive",
      desc:"Targets defensive affixes: Maximum Life, Armor, resistances, Damage Reduction, Dodge Chance.",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    resourceful: {
      id:"resourceful", name:"Resourceful Tuning Prism", short:"Resourceful",
      icon:"💧", color:"#27ae60", bg:"rgba(39,174,96,0.15)", border:"rgba(39,174,96,0.4)",
      category:"Resource",
      desc:"Targets resource affixes: Maximum Resource, Resource Generation, Cost Reduction, Resource on Kill/Lucky Hit, and Resource per Second (class-specific regen like Mana/Fury/Energy per second).",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    pragmatic: {
      id:"pragmatic", name:"Pragmatic Tuning Prism", short:"Pragmatic",
      icon:"🏃", color:"#d68910", bg:"rgba(214,137,16,0.15)", border:"rgba(214,137,16,0.4)",
      category:"Utility & Mobility",
      desc:"Targets utility and mobility affixes: CDR, Lucky Hit Chance, Movement Speed, Healing Received, Evade bonuses, Potion Capacity, Impairment Reduction.",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    chromatic: {
      id:"chromatic", name:"Chromatic Tuning Prism", short:"Chromatic",
      icon:"🌈", color:"#16a085", bg:"rgba(22,160,133,0.15)", border:"rgba(22,160,133,0.4)",
      category:"Individual Resistances",
      desc:"Targets ONE specific elemental resistance. More focused than Protector's for single-resist goals. Cannot target All Resist.",
      farmNote:"War Plans Cache, Tree of Whispers, Elite Monsters.",
    },
    none: {
      id:"none", name:"No Tuning Prism", short:"Untargetable",
      icon:"❌", color:"#7f8c8d", bg:"rgba(127,140,141,0.1)", border:"rgba(127,140,141,0.3)",
      category:"Cannot Be Targeted",
      desc:"These affixes CANNOT be targeted by any Tuning Prism. They roll completely randomly.",
      farmNote:"Cannot be steered. Lock other stats and use Chaotic Reroll as a last resort.",
    },
  },

  // ── AFFIX DATABASE ────────────────────────────────────────────
  // Slot assignments confirmed from Game8.co per-slot lists and lexi.gg (July 2026)
  // prisms[] = which prism(s) can roll this affix (first = primary/most efficient)
  // slots[]  = confirmed slot list from per-slot databases
  // class    = "all" or specific class name
  // note     = extra context shown in the simulator
  affixes: [

    // ══════════════════════════════════════════════════════════
    // AGGRESSIVE — Offensive Affixes
    // ══════════════════════════════════════════════════════════

    // — Universal offensive stats (all slots they appear on per D4Builds/Game8) —
    { id:"crit-chance",       name:"Critical Strike Chance",         prisms:["aggressive"],
      slots:["helm","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"High priority stat. Available on Helm, Gloves, Ring, Amulet, and all weapons." },

    { id:"crit-damage",       name:"Critical Strike Damage",         prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"One of the highest-value offensive stats in the game." },

    { id:"attack-speed",      name:"Attack Speed",                   prisms:["aggressive"],
      slots:["helm","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"weapon-damage",     name:"Weapon Damage",                  prisms:["aggressive"],
      slots:["weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"Weapon slot only." },

    { id:"vulnerable-damage", name:"Vulnerable Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"all-damage",        name:"All Damage Multiplier",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"dot-damage",        name:"Damage Over Time",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"thorns",            name:"Thorns",                         prisms:["aggressive","pragmatic"],
      slots:["helm","chest","pants","ring","amulet"],
      class:"all", note:"Appears under both Aggressive and Pragmatic prism pools." },

    // — Situational / conditional damage —
    { id:"damage-cc",         name:"Damage to Crowd Controlled",     prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-close",      name:"Damage to Close Enemies",        prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-distant",    name:"Damage to Distant Enemies",      prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-injured",    name:"Damage to Injured Enemies",      prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-frozen",     name:"Damage to Frozen Enemies",       prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-weakened",   name:"Damage to Weakened Enemies",     prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"overpower-damage",  name:"Damage per Overpower Stack",     prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"resolve-damage",    name:"Damage when Spending Resolve",   prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },

    // — Elemental damage multipliers —
    { id:"fire-damage",       name:"Fire Damage",                    prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"cold-damage",       name:"Cold Damage",                    prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"lightning-damage",  name:"Lightning Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"physical-damage",   name:"Physical Damage",                prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"shadow-damage",     name:"Shadow Damage",                  prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"poison-damage",     name:"Poison Damage",                  prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"holy-damage",       name:"Holy Damage",                    prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },

    // — Class-specific offensive affixes —
    { id:"brawling-damage",   name:"Brawling Damage",                prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"2h-blunt-damage",   name:"2H Bludgeoning Weapon Damage",  prisms:["aggressive"],
      slots:["ring","amulet","w2h-blunt"], class:"Barbarian" },
    { id:"2h-slash-damage",   name:"2H Slashing Weapon Damage",     prisms:["aggressive"],
      slots:["ring","amulet","w2h-slash"], class:"Barbarian" },
    { id:"dual-wield-damage", name:"Damage with Dual-Wielded Weapons",prisms:["aggressive"],
      slots:["ring","amulet","w1h-main"], class:"Barbarian" },
    { id:"berserking-damage", name:"Damage while Berserking",        prisms:["aggressive"],
      slots:["gloves","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"ancient-damage",    name:"Ancient Damage",                 prisms:["aggressive"],
      slots:["gloves","ring","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },

    { id:"companion-damage",  name:"Companion Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Druid" },
    { id:"bone-damage",       name:"Bone Damage",                    prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },
    { id:"blood-damage",      name:"Blood Damage",                   prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },
    { id:"darkness-damage",   name:"Darkness Damage",                prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },

    { id:"agility-damage",    name:"Agility Damage",                 prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },
    { id:"cutthroat-damage",  name:"Cutthroat Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },
    { id:"combo-damage",      name:"Damage per Combo Point",         prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },

    { id:"conjuration-damage",name:"Conjuration Damage",             prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"pyromancy-damage",  name:"Pyromancy Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"frost-damage",      name:"Frost Damage",                   prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"shock-damage",      name:"Shock Damage",                   prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },

    { id:"eagle-damage",      name:"Eagle Skill Damage",             prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"gorilla-damage",    name:"Gorilla Skill Damage",           prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"jaguar-damage",     name:"Jaguar Skill Damage",            prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"centipede-damage",  name:"Centipede Skill Damage",         prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },

    { id:"abyss-damage",      name:"Abyss Damage",                   prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Warlock" },
    { id:"demonology-damage", name:"Demonology Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Warlock" },

    { id:"arbiter-damage",    name:"Damage while in Arbiter Form",   prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Paladin" },
    { id:"judged-damage",     name:"Damage to Judged Enemies",       prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Paladin" },

    // ══════════════════════════════════════════════════════════
    // ADEPT'S — Core Stats & Skill Ranks
    // !! Core stats also exist in Aggressive pool — see note !!
    // ══════════════════════════════════════════════════════════

    // Core stats (confirmed on all gear slots from lexi.gg / Game8)
    // Available in BOTH Adept's AND Aggressive — key flexibility for resolving conflicts!
    { id:"strength",    name:"Strength",     prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"★ Available from BOTH Adept's AND Aggressive prisms — powerful conflict resolver!" },
    { id:"dexterity",   name:"Dexterity",    prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"★ Available from BOTH Adept's AND Aggressive prisms." },
    { id:"intelligence",name:"Intelligence", prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"★ Available from BOTH Adept's AND Aggressive prisms." },
    { id:"willpower",   name:"Willpower",    prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"★ Available from BOTH Adept's AND Aggressive prisms." },

    // +Skill ranks — Adept's only, restricted slots (confirmed from Game8 per-slot)
    { id:"all-skills",           name:"+Ranks to All Skills",              prisms:["adept"], slots:["amulet"],                          class:"all" },
    { id:"basic-skills",         name:"+Ranks to Basic Skills",            prisms:["adept"], slots:["helm","amulet","weapon"],           class:"all" },
    { id:"core-skills",          name:"+Ranks to Core Skills",             prisms:["adept"], slots:["helm","chest","ring","amulet","weapon"], class:"all" },
    { id:"defensive-skills",     name:"+Ranks to Defensive Skills",        prisms:["adept"], slots:["chest","amulet"],                  class:"all" },
    { id:"subterfuge-skills",    name:"+Ranks to Subterfuge Skills",       prisms:["adept"], slots:["chest","amulet"],                  class:"all" },

    // Barbarian-specific skill ranks
    { id:"shout-skills",         name:"+Ranks to Shout Skills",            prisms:["adept"], slots:["helm","chest","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },
    { id:"brawling-skills",      name:"+Ranks to Brawling Skills",         prisms:["adept"], slots:["helm","chest","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },
    { id:"weapon-mastery-skills",name:"+Ranks to Weapon Mastery",          prisms:["adept"], slots:["helm","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },

    // Druid
    { id:"companion-skills",     name:"+Ranks to Companion Skills",        prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Druid" },
    { id:"storm-skills",         name:"+Ranks to Storm Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Druid" },

    // Necromancer
    { id:"curse-skills",         name:"+Ranks to Curse Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },
    { id:"bone-skills",          name:"+Ranks to Bone Skills",             prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },
    { id:"blood-skills",         name:"+Ranks to Blood Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },

    // Rogue
    { id:"imbuement-skills",     name:"+Ranks to Imbuement Skills",        prisms:["adept"], slots:["helm","chest","amulet","weapon"], class:"Rogue" },
    { id:"cutthroat-skills",     name:"+Ranks to Cutthroat Skills",        prisms:["adept"], slots:["helm","chest","amulet","weapon"], class:"Rogue" },
    { id:"marksman-skills",      name:"+Ranks to Marksman Skills",         prisms:["adept"], slots:["helm","chest","amulet","weapon"], class:"Rogue" },

    // Sorcerer
    { id:"conjuration-skills",   name:"+Ranks to Conjuration Skills",      prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"pyromancy-skills",     name:"+Ranks to Pyromancy Skills",        prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"frost-skills",         name:"+Ranks to Frost Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"shock-skills",         name:"+Ranks to Shock Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },

    // Spiritborn
    { id:"eagle-skills",         name:"+Ranks to Eagle Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"gorilla-skills",       name:"+Ranks to Gorilla Skills",          prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"jaguar-skills",        name:"+Ranks to Jaguar Skills",           prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"centipede-skills",     name:"+Ranks to Centipede Skills",        prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"potency-skills",       name:"+Ranks to Potency Skills",          prisms:["adept"], slots:["helm","amulet","weapon","offhand"],         class:"Spiritborn" },

    // Warlock / Paladin
    { id:"abyss-skills",         name:"+Ranks to Abyss Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Warlock" },
    { id:"juggernaut-skills",    name:"+Ranks to Juggernaut Skills",       prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },
    { id:"faith-skills",         name:"+Ranks to Faith Skills",            prisms:["adept"], slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },

    // ══════════════════════════════════════════════════════════
    // PROTECTOR'S — Defensive Affixes
    // Slot data confirmed from Game8 per-slot lists
    // ══════════════════════════════════════════════════════════

    // Maximum Life — confirmed on helm, chest, gloves, pants, BOOTS, ring, amulet (Game8)
    { id:"max-life",          name:"Maximum Life",             prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Available on most armor slots including Boots. Very commonly desired." },

    // Armor — confirmed on helm, chest, gloves, pants, boots, offhand (Game8)
    { id:"armor",             name:"Armor",                    prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","offhand"],
      class:"all" },

    // Life Regeneration (Life per Second) — confirmed on helm, CHEST, BOOTS, ring, amulet (Game8)
    { id:"life-regen",        name:"Life per Second",          prisms:["protector"],
      slots:["helm","chest","boots","ring","amulet"],
      class:"all", note:"AKA 'Life Regeneration'. Confirmed on Helm, Chest, Boots, Ring, Amulet." },

    // Life on Hit — confirmed on helm, chest, gloves, ring, amulet, weapon (Game8/D4Builds)
    { id:"life-on-hit",       name:"Life on Hit",              prisms:["protector"],
      slots:["helm","chest","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    // Life on Kill — confirmed on ring, amulet, boots (Game8)
    { id:"life-on-kill",      name:"Life per Kill",            prisms:["protector"],
      slots:["ring","amulet","boots"],
      class:"all" },

    // Damage Reduction — confirmed on helm, chest, pants, offhand, amulet (D4Builds)
    { id:"damage-reduction",  name:"Damage Reduction",         prisms:["protector"],
      slots:["helm","chest","pants","offhand","amulet"],
      class:"all" },

    // Dodge Chance — confirmed on pants, boots, ring, amulet (Game8/D4Builds)
    { id:"dodge-chance",      name:"Dodge Chance",             prisms:["protector"],
      slots:["pants","boots","ring","amulet"],
      class:"all" },

    // Resistance to All Elements — Protector's only (not Chromatic). Confirmed on most armor slots.
    { id:"all-resist",        name:"Resistance to All Elements",prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Protector's for All Resist. Chromatic only targets individual resistances." },

    // Individual resistances — BOTH Protector's AND Chromatic (Chromatic is more focused)
    { id:"fire-resist",       name:"Fire Resistance",          prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },
    { id:"cold-resist",       name:"Cold Resistance",          prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },
    { id:"lightning-resist",  name:"Lightning Resistance",     prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },
    { id:"poison-resist",     name:"Poison Resistance",        prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },
    { id:"shadow-resist",     name:"Shadow Resistance",        prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },
    { id:"physical-resist",   name:"Physical Resistance",      prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a specific resist." },

    // ══════════════════════════════════════════════════════════
    // RESOURCEFUL — Resource Affixes
    // Confirmed from Game8 per-slot lists and lexi.gg
    // ══════════════════════════════════════════════════════════

    // Max Resource — confirmed on helm, chest, gloves, ring, amulet
    { id:"max-resource",      name:"Maximum Resource",               prisms:["resourceful"],
      slots:["helm","chest","gloves","ring","amulet"],
      class:"all" },

    // Resource per Second (class-specific: Fury/Mana/Energy/Spirit/Essence/Vigor per second)
    // !! Owen's "Resource Regeneration" !!
    // Confirmed on Helm, CHEST, BOOTS from Game8 per-slot data (July 2026)
    { id:"resource-regen",    name:"Resource per Second",            prisms:["resourceful"],
      slots:["helm","chest","boots","amulet"],
      class:"all",
      note:"Your class's primary resource regen (Fury/Mana/Energy/Spirit etc per second). Confirmed on Helm, Chest, Boots, Amulet. NOT on Ring or Gloves." },

    { id:"resource-gen",      name:"Resource Generation",           prisms:["resourceful"],
      slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"resource-cost",     name:"Resource Cost Reduction",       prisms:["resourceful"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet"],
      class:"all" },

    { id:"resource-on-kill",  name:"Resource on Kill",              prisms:["resourceful"],
      slots:["ring","amulet","boots","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    { id:"resource-on-lh",    name:"Resource on Lucky Hit",         prisms:["resourceful"],
      slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    // ══════════════════════════════════════════════════════════
    // PRAGMATIC — Utility & Mobility
    // Confirmed from Game8 per-slot lists
    // ══════════════════════════════════════════════════════════

    // Cooldown Reduction — confirmed on helm, gloves, ring, amulet (Game8/D4Builds)
    { id:"cdr",               name:"Cooldown Reduction",             prisms:["pragmatic"],
      slots:["helm","gloves","ring","amulet"],
      class:"all", note:"Not available on chest or pants. Helm, Gloves, Ring, Amulet only." },

    // Lucky Hit Chance — confirmed on helm, gloves, boots, ring, amulet (Game8)
    { id:"lucky-hit-chance",  name:"Lucky Hit Chance",               prisms:["pragmatic"],
      slots:["helm","gloves","boots","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },

    // Movement Speed — confirmed on boots, pants, amulet, ring (Game8)
    { id:"move-speed",        name:"Movement Speed",                 prisms:["pragmatic"],
      slots:["boots","pants","amulet","ring"],
      class:"all" },

    // Healing Received — confirmed on helm, chest, pants, boots, ring, amulet (Game8)
    { id:"healing-received",  name:"Healing Received",               prisms:["pragmatic"],
      slots:["helm","chest","pants","boots","ring","amulet"],
      class:"all" },

    // Max Evade Charges — confirmed on boots, pants (Game8)
    { id:"max-evade",         name:"Maximum Evade Charges",          prisms:["pragmatic"],
      slots:["boots","pants","amulet"],
      class:"all" },

    // Evade Move Speed — confirmed on boots, amulet (Game8)
    { id:"evade-move-speed",  name:"Evade Grants Movement Speed",    prisms:["pragmatic"],
      slots:["boots","amulet"],
      class:"all" },

    // Attacks Reduce Evade CD — confirmed on boots, gloves, amulet (Game8)
    { id:"evade-cdr",         name:"Attacks Reduce Evade Cooldown",  prisms:["pragmatic"],
      slots:["boots","gloves","amulet"],
      class:"all" },

    // Potion Capacity — confirmed on pants, boots, ring (Game8)
    { id:"potion-capacity",   name:"Potion Capacity",                prisms:["pragmatic"],
      slots:["pants","boots","ring"],
      class:"all" },

    // Impairment Reduction — confirmed on helm, chest, pants, boots, amulet (lexi.gg)
    { id:"impairment-reduction",name:"Impairment Reduction",         prisms:["pragmatic"],
      slots:["helm","chest","pants","boots","amulet"],
      class:"all", note:"Reduces CC duration on you (stuns, slows, freezes, etc.)." },

    // ══════════════════════════════════════════════════════════
    // NO TUNING PRISM — Cannot be targeted (random only)
    // Confirmed from Game8 affix lists
    // ══════════════════════════════════════════════════════════

    { id:"fortify-gen",   name:"Fortify Generation",   prisms:["none"],
      slots:["helm","chest","gloves","pants","boots","amulet"],
      class:"all",
      note:"⚠️ Cannot be targeted by ANY Tuning Prism. Rolls randomly only." },

    { id:"barrier-gen",   name:"Barrier Generation",   prisms:["none"],
      slots:["helm","chest","gloves","pants","boots","amulet"],
      class:"all",
      note:"⚠️ Cannot be targeted by ANY Tuning Prism. Rolls randomly only." },

  ],

  // ── INHERENT AFFIXES BY WEAPON DISPLAY TYPE ──────────────────
  // Built-in affixes that always appear on certain weapon types.
  // They don't count as rollable affix slots.
  weaponInherents: {
    "1H Sword":       ["Critical Strike Damage"],
    "2H Sword":       ["Critical Strike Damage (2H bonus)"],
    "1H Axe":         ["Damage Over Time"],
    "2H Axe":         ["Damage Over Time (2H bonus)"],
    "1H Mace":        ["Overpower Damage"],
    "2H Mace":        ["Overpower Damage (2H bonus)"],
    "Dagger":         ["Attack Speed"],
    "Wand":           ["Critical Strike Chance"],
    "Staff":          ["Critical Strike Chance", "Critical Strike Damage"],
    "Bow":            ["Attack Speed"],
    "Crossbow":       ["Critical Strike Damage"],
    "Polearm":        ["Lucky Hit Chance"],
    "Glaive":         ["Critical Strike Chance"],
    "Flail":          ["Attack Speed"],
    "1H Scythe":      ["Overpower Damage"],
    "2H Scythe":      ["Overpower Damage (2H bonus)"],
    "Focus":          ["Critical Strike Chance"],
    "Totem":          ["Critical Strike Chance"],
    "Shield":         ["Armor"],
    "Quarterstaff":   ["Attack Speed", "Lucky Hit Chance"],
  },

};
