// ============================================================
// NEPHALEM'S CODEX — Horadric Cube Crafting Database
// Season 14: Death Awakening | Lord of Hatred Expansion
//
// SOURCES:
//   Game8.co — per-slot affix lists for each gear piece (May 2026)
//   D4Guides.gg — 506 affixes with type/class/slot data (Jul 22, 2026)
//   DiabloBytes — primary stat per class (Jul 2026)
//   Icy Veins Auradin guide — Paladin skill rank affixes confirmed
//   Maxroll Auradin guide — Fanaticism/Defiance/Holy Light Aura affixes confirmed
//
// PRIMARY STAT ASSIGNMENTS (confirmed from DiabloBytes class guide):
//   Strength     → Barbarian, Paladin
//   Intelligence → Necromancer, Sorcerer
//   Willpower    → Druid, Warlock
//   Dexterity    → Rogue, Spiritborn
//
// SLOT IDs (match app.js gear slot IDs):
//   helm chest gloves pants boots amulet ring
//   weapon offhand (non-Barbarian weapon slots)
//   w2h-blunt w2h-slash w1h-main w1h-off (Barbarian Arsenal)
//
// PRISM IDs: aggressive adept protector resourceful pragmatic chromatic none
// ============================================================

const CRAFTING_DB = {

  prisms: {
    aggressive: { id:"aggressive", name:"Aggressive Tuning Prism", short:"Aggressive",
      icon:"⚔️", color:"#c0392b", bg:"rgba(192,57,43,0.15)", border:"rgba(192,57,43,0.4)",
      category:"Offensive",
      desc:"Targets offensive affixes: damage, crit, attack speed, element damage, and damage multipliers.",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    adept: { id:"adept", name:"Adept's Tuning Prism", short:"Adept's",
      icon:"📚", color:"#8e44ad", bg:"rgba(142,68,173,0.15)", border:"rgba(142,68,173,0.4)",
      category:"Skill Ranks & Core Stats",
      desc:"Targets +Ranks to skills and your class's primary core stat. Core stats also appear in the Aggressive pool, giving them flexibility.",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    protector: { id:"protector", name:"Protector's Tuning Prism", short:"Protector's",
      icon:"🛡️", color:"#2980b9", bg:"rgba(41,128,185,0.15)", border:"rgba(41,128,185,0.4)",
      category:"Defensive",
      desc:"Targets defensive affixes: Maximum Life, Armor, resistances, Damage Reduction, Dodge Chance.",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    resourceful: { id:"resourceful", name:"Resourceful Tuning Prism", short:"Resourceful",
      icon:"💧", color:"#27ae60", bg:"rgba(39,174,96,0.15)", border:"rgba(39,174,96,0.4)",
      category:"Resource",
      desc:"Targets resource affixes: Maximum Resource, Resource Generation, Cost Reduction, Resource per Second (class-specific flat regen), Resource on Kill/Lucky Hit.",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    pragmatic: { id:"pragmatic", name:"Pragmatic Tuning Prism", short:"Pragmatic",
      icon:"🏃", color:"#d68910", bg:"rgba(214,137,16,0.15)", border:"rgba(214,137,16,0.4)",
      category:"Utility & Mobility",
      desc:"Targets utility and mobility affixes: CDR, Lucky Hit Chance, Movement Speed, Healing Received, Evade bonuses, Potion Capacity, Impairment Reduction, Thorns.",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    chromatic: { id:"chromatic", name:"Chromatic Tuning Prism", short:"Chromatic",
      icon:"🌈", color:"#16a085", bg:"rgba(22,160,133,0.15)", border:"rgba(22,160,133,0.4)",
      category:"Individual Resistances",
      desc:"Targets ONE specific elemental resistance. More focused than Protector's for single-resist goals. Cannot target All Resist (use Protector's for that).",
      farmNote:"War Plans Cache, Tree of Whispers rewards, Elite Monsters." },
    none: { id:"none", name:"No Tuning Prism", short:"Untargetable",
      icon:"❌", color:"#7f8c8d", bg:"rgba(127,140,141,0.1)", border:"rgba(127,140,141,0.3)",
      category:"Cannot Be Targeted",
      desc:"These affixes CANNOT be targeted by any Tuning Prism. They roll completely randomly.",
      farmNote:"Cannot be steered. Lock other stats and use Chaotic Reroll as a last resort." },
  },

  affixes: [

    // ══════════════════════════════════════════════════════════
    // AGGRESSIVE — Offensive Affixes
    // ══════════════════════════════════════════════════════════

    // Universal offensive (no chest — confirmed by Game8 per-slot list)
    { id:"crit-chance",       name:"Critical Strike Chance",    prisms:["aggressive"],
      slots:["helm","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"Common on gloves, ring, helm, and weapons. NOT available on chest, pants, or boots." },
    { id:"crit-damage",       name:"Critical Strike Damage",    prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"attack-speed",      name:"Attack Speed",              prisms:["aggressive"],
      slots:["helm","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"weapon-damage",     name:"Weapon Damage",             prisms:["aggressive"],
      slots:["weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all", note:"Weapon slot only. Inherent on some weapon types." },
    { id:"vulnerable-damage", name:"Vulnerable Damage",         prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"all-damage",        name:"All Damage Multiplier",     prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"dot-damage",        name:"Damage Over Time",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    // Thorns — both Aggressive AND Pragmatic, appears on chest (confirmed Game8)
    { id:"thorns",            name:"Thorns",                    prisms:["aggressive","pragmatic"],
      slots:["helm","chest","pants","ring","amulet"],
      class:"all", note:"Appears in both Aggressive and Pragmatic prism pools." },
    // Elemental damage
    { id:"fire-damage",       name:"Fire Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"cold-damage",       name:"Cold Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"lightning-damage",  name:"Lightning Damage",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"physical-damage",   name:"Physical Damage",           prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"shadow-damage",     name:"Shadow Damage",             prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"poison-damage",     name:"Poison Damage",             prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"holy-damage",       name:"Holy Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    // Situational damage
    { id:"damage-cc",         name:"Damage to Crowd Controlled",prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-close",      name:"Damage to Close Enemies",   prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-distant",    name:"Damage to Distant Enemies", prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-injured",    name:"Damage to Injured Enemies", prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-frozen",     name:"Damage to Frozen Enemies",  prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"damage-weakened",   name:"Damage to Weakened Enemies",prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"overpower-damage",  name:"Damage per Overpower Stack",prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"resolve-damage",    name:"Damage when Spending Resolve",prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    // Barbarian-specific
    { id:"brawling-damage",   name:"Brawling Damage",           prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    { id:"2h-blunt-damage",   name:"2H Bludgeoning Weapon Damage",prisms:["aggressive"],
      slots:["ring","amulet","w2h-blunt"], class:"Barbarian" },
    { id:"2h-slash-damage",   name:"2H Slashing Weapon Damage", prisms:["aggressive"],
      slots:["ring","amulet","w2h-slash"], class:"Barbarian" },
    { id:"dual-wield-damage", name:"Dual-Wielded Weapon Damage",prisms:["aggressive"],
      slots:["ring","amulet","w1h-main"], class:"Barbarian" },
    { id:"berserking-damage", name:"Damage while Berserking",   prisms:["aggressive"],
      slots:["gloves","ring","amulet","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"Barbarian" },
    // Druid
    { id:"companion-damage",  name:"Companion Damage",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Druid" },
    // Necromancer
    { id:"bone-damage",       name:"Bone Damage",               prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },
    { id:"blood-damage",      name:"Blood Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },
    { id:"darkness-damage",   name:"Darkness Damage",           prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Necromancer" },
    // Rogue
    { id:"agility-damage",    name:"Agility Damage",            prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },
    { id:"cutthroat-damage",  name:"Cutthroat Damage",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },
    { id:"combo-damage",      name:"Damage per Combo Point",    prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Rogue" },
    // Sorcerer
    { id:"conjuration-damage",name:"Conjuration Damage",        prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"pyromancy-damage",  name:"Pyromancy Damage",          prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"frost-damage",      name:"Frost Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    { id:"shock-damage",      name:"Shock Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Sorcerer" },
    // Spiritborn
    { id:"eagle-damage",      name:"Eagle Skill Damage",        prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"gorilla-damage",    name:"Gorilla Skill Damage",      prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"jaguar-damage",     name:"Jaguar Skill Damage",       prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    { id:"centipede-damage",  name:"Centipede Skill Damage",    prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Spiritborn" },
    // Warlock
    { id:"abyss-damage",      name:"Abyss Damage",              prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Warlock" },
    { id:"demonology-damage", name:"Demonology Damage",         prisms:["aggressive"],
      slots:["gloves","ring","amulet","offhand","weapon"], class:"Warlock" },
    // Paladin
    { id:"arbiter-damage",    name:"Damage while in Arbiter Form",prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Paladin" },
    { id:"judged-damage",     name:"Damage to Judged Enemies",  prisms:["aggressive"],
      slots:["gloves","ring","amulet","weapon"], class:"Paladin" },

    // ══════════════════════════════════════════════════════════
    // ADEPT'S — Primary Stats (class-restricted) + Skill Ranks
    //
    // PRIMARY STAT ASSIGNMENTS (confirmed from DiabloBytes, Season 14):
    //   Strength     → Barbarian, Paladin
    //   Intelligence → Necromancer, Sorcerer
    //   Willpower    → Druid, Warlock
    //   Dexterity    → Rogue, Spiritborn
    //
    // Each class can ONLY roll its own primary stat, not the others.
    // Core stats also appear in the Aggressive pool — giving them flexibility
    // when you have conflicts between Aggressive affixes.
    // ══════════════════════════════════════════════════════════

    // Strength — Barbarian and Paladin only
    { id:"strength",          name:"Strength",                  prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"Barbarian,Paladin",
      note:"Primary stat for Barbarian and Paladin. Also rollable via Aggressive prism — useful for avoiding conflicts." },

    // Intelligence — Necromancer and Sorcerer only
    { id:"intelligence",      name:"Intelligence",              prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"Necromancer,Sorcerer",
      note:"Primary stat for Necromancer and Sorcerer. Also rollable via Aggressive prism." },

    // Willpower — Druid and Warlock only
    { id:"willpower",         name:"Willpower",                 prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"Druid,Warlock",
      note:"Primary stat for Druid and Warlock. Also rollable via Aggressive prism." },

    // Dexterity — Rogue and Spiritborn only
    { id:"dexterity",         name:"Dexterity",                 prisms:["adept","aggressive"],
      slots:["helm","chest","gloves","pants","boots","amulet","ring","weapon","offhand","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"Rogue,Spiritborn",
      note:"Primary stat for Rogue and Spiritborn. Also rollable via Aggressive prism." },

    // ── All-class skill ranks (Adept's only) ──────────────────
    { id:"all-skills",        name:"+Ranks to All Skills",      prisms:["adept"],
      slots:["amulet"], class:"all" },
    { id:"basic-skills",      name:"+Ranks to Basic Skills",    prisms:["adept"],
      slots:["helm","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"core-skills",       name:"+Ranks to Core Skills",     prisms:["adept"],
      slots:["helm","chest","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"defensive-skills",  name:"+Ranks to Defensive Skills",prisms:["adept"],
      slots:["chest","amulet"], class:"all",
      note:"Confirmed on Chest for all classes (Game8 chest list)." },
    { id:"subterfuge-skills", name:"+Ranks to Subterfuge Skills",prisms:["adept"],
      slots:["chest","amulet"], class:"all",
      note:"Confirmed on Chest for all classes (Game8 chest list)." },

    // ── Barbarian skill ranks (confirmed on chest, helm, amulet, weapon via Game8) ──
    { id:"shout-skills",      name:"+Ranks to Shout Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },
    { id:"brawling-skills",   name:"+Ranks to Brawling Skills", prisms:["adept"],
      slots:["helm","chest","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },
    { id:"weapon-mastery-skills",name:"+Ranks to Weapon Mastery",prisms:["adept"],
      slots:["helm","amulet","w2h-blunt","w2h-slash"], class:"Barbarian" },
    // Specific Barbarian chest skills (confirmed Game8 chest list)
    { id:"war-cry-ranks",     name:"+Ranks to War Cry",         prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Barbarian" },
    { id:"iron-skin-ranks",   name:"+Ranks to Iron Skin",       prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Barbarian" },
    { id:"challenging-shout-ranks",name:"+Ranks to Challenging Shout",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Barbarian" },
    { id:"ground-stomp-ranks",name:"+Ranks to Ground Stomp",    prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Barbarian" },
    { id:"rallying-cry-ranks",name:"+Ranks to Rallying Cry",    prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Barbarian" },

    // ── Druid skill ranks (confirmed Game8 chest list) ────────
    { id:"companion-skills",  name:"+Ranks to Companion Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Druid" },
    { id:"storm-skills",      name:"+Ranks to Storm Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Druid" },
    { id:"blood-howl-ranks",  name:"+Ranks to Blood Howl",      prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Druid",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"earthen-bulwark-ranks",name:"+Ranks to Earthen Bulwark",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Druid",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"cyclone-armor-ranks",name:"+Ranks to Cyclone Armor",  prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Druid",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"debilitating-roar-ranks",name:"+Ranks to Debilitating Roar",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Druid",
      note:"Confirmed on Chest (Game8 chest list)." },

    // ── Necromancer skill ranks (confirmed Game8 chest list) ──
    { id:"curse-skills",      name:"+Ranks to Curse Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },
    { id:"bone-skills",       name:"+Ranks to Bone Skills",     prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },
    { id:"blood-skills",      name:"+Ranks to Blood Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Necromancer" },
    { id:"skeletal-mage-mastery",name:"+Ranks to Skeletal Mage Mastery",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"skeletal-warrior-mastery",name:"+Ranks to Skeletal Warrior Mastery",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"golem-mastery",     name:"+Ranks to Golem Mastery",   prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"blood-mist-ranks",  name:"+Ranks to Blood Mist",      prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"bone-prison-ranks", name:"+Ranks to Bone Prison",     prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"corpse-explosion-ranks",name:"+Ranks to Corpse Explosion",prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Necromancer",
      note:"Confirmed on Chest (Game8 chest list)." },

    // ── Paladin skill ranks (confirmed Icy Veins Auradin + Maxroll guides) ──
    { id:"juggernaut-skills", name:"+Ranks to Juggernaut Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },
    { id:"faith-skills",      name:"+Ranks to Faith Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },
    { id:"disciple-skills",   name:"+Ranks to Disciple Skills", prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },
    { id:"zealot-skills",     name:"+Ranks to Zealot Skills",   prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin" },
    // Aura-specific ranks (confirmed Icy Veins Auradin guide + Maxroll Auradin)
    { id:"aura-skills",       name:"+Ranks to All Aura Skills", prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin",
      note:"Confirmed in Auradin builds (Icy Veins/Maxroll). Core stat for Aura-based Paladins." },
    { id:"holy-light-aura-ranks",name:"+Ranks to Holy Light Aura",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin",
      note:"Key affix for Auradin builds. Confirmed in Icy Veins/Maxroll Auradin guide." },
    { id:"fanaticism-aura-ranks",name:"+Ranks to Fanaticism Aura",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin",
      note:"Confirmed in Maxroll Auradin guide. Provides Attack Speed and Crit Chance." },
    { id:"defiance-aura-ranks",name:"+Ranks to Defiance Aura",  prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Paladin",
      note:"Confirmed in Icy Veins Auradin guide." },

    // ── Rogue skill ranks (confirmed Game8 chest list) ────────
    { id:"imbuement-skills",  name:"+Ranks to Imbuement Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon"], class:"Rogue" },
    { id:"cutthroat-skills",  name:"+Ranks to Cutthroat Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon"], class:"Rogue" },
    { id:"marksman-skills",   name:"+Ranks to Marksman Skills", prisms:["adept"],
      slots:["helm","chest","amulet","weapon"], class:"Rogue" },
    { id:"poison-trap-ranks", name:"+Ranks to Poison Trap",     prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Rogue",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"dark-shroud-ranks", name:"+Ranks to Dark Shroud",     prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Rogue",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"concealment-ranks", name:"+Ranks to Concealment",     prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Rogue",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"smoke-grenade-ranks",name:"+Ranks to Smoke Grenade",  prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Rogue",
      note:"Confirmed on Chest (Game8 chest list)." },

    // ── Sorcerer skill ranks (confirmed Game8 chest list) ─────
    { id:"conjuration-skills",name:"+Ranks to Conjuration Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"pyromancy-skills",  name:"+Ranks to Pyromancy Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"frost-skills",      name:"+Ranks to Frost Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"shock-skills",      name:"+Ranks to Shock Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Sorcerer" },
    { id:"ice-armor-ranks",   name:"+Ranks to Ice Armor",       prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Sorcerer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"frost-nova-ranks",  name:"+Ranks to Frost Nova",      prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Sorcerer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"teleport-ranks",    name:"+Ranks to Teleport",        prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Sorcerer",
      note:"Confirmed on Chest (Game8 chest list)." },
    { id:"flame-shield-ranks",name:"+Ranks to Flame Shield",    prisms:["adept"],
      slots:["helm","chest","amulet"], class:"Sorcerer",
      note:"Confirmed on Chest (Game8 chest list)." },

    // ── Spiritborn skill ranks ─────────────────────────────────
    { id:"eagle-skills",      name:"+Ranks to Eagle Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"gorilla-skills",    name:"+Ranks to Gorilla Skills",  prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"jaguar-skills",     name:"+Ranks to Jaguar Skills",   prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"centipede-skills",  name:"+Ranks to Centipede Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Spiritborn" },
    { id:"potency-skills",    name:"+Ranks to Potency Skills",  prisms:["adept"],
      slots:["helm","amulet","weapon","offhand"], class:"Spiritborn" },

    // ── Warlock skill ranks ────────────────────────────────────
    { id:"abyss-skills",      name:"+Ranks to Abyss Skills",    prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Warlock" },
    { id:"demonology-skills", name:"+Ranks to Demonology Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Warlock" },
    { id:"destruction-skills",name:"+Ranks to Destruction Skills",prisms:["adept"],
      slots:["helm","chest","amulet","weapon","offhand"], class:"Warlock" },

    // ══════════════════════════════════════════════════════════
    // PROTECTOR'S — Defensive Affixes
    // Slot data confirmed from Game8 per-slot lists
    // ══════════════════════════════════════════════════════════

    // Maximum Life (confirmed on chest, boots, gloves, etc. — Game8)
    { id:"max-life",          name:"Maximum Life",              prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all" },
    { id:"armor",             name:"Armor",                     prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","offhand"], class:"all" },
    // Life Regeneration — confirmed on chest and boots (Game8)
    { id:"life-regen",        name:"Life per Second",           prisms:["protector"],
      slots:["helm","chest","boots","ring","amulet"],
      class:"all", note:"AKA Life Regeneration. Confirmed on Helm, Chest, Boots, Ring, Amulet." },
    { id:"life-on-hit",       name:"Life on Hit",               prisms:["protector"],
      slots:["helm","chest","gloves","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"life-on-kill",      name:"Life per Kill",             prisms:["protector"],
      slots:["ring","amulet","boots"], class:"all" },
    { id:"damage-reduction",  name:"Damage Reduction",          prisms:["protector"],
      slots:["helm","chest","pants","offhand","amulet"], class:"all" },
    { id:"dodge-chance",      name:"Dodge Chance",              prisms:["protector"],
      slots:["pants","boots","ring","amulet"], class:"all" },
    // Resistance to All — Protector's only (not Chromatic)
    { id:"all-resist",        name:"Resistance to All Elements",prisms:["protector"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Protector's for All Resist. Chromatic only targets individual resistances." },
    // Individual resistances — both Protector's AND Chromatic
    { id:"fire-resist",       name:"Fire Resistance",           prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"],
      class:"all", note:"Use Chromatic for better odds on a single resistance." },
    { id:"cold-resist",       name:"Cold Resistance",           prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"], class:"all" },
    { id:"lightning-resist",  name:"Lightning Resistance",      prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"], class:"all" },
    { id:"poison-resist",     name:"Poison Resistance",         prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"], class:"all" },
    { id:"shadow-resist",     name:"Shadow Resistance",         prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"], class:"all" },
    { id:"physical-resist",   name:"Physical Resistance",       prisms:["protector","chromatic"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet","offhand"], class:"all" },

    // ══════════════════════════════════════════════════════════
    // RESOURCEFUL — Resource Affixes
    // ══════════════════════════════════════════════════════════

    { id:"max-resource",      name:"Maximum Resource",          prisms:["resourceful"],
      slots:["helm","chest","gloves","ring","amulet"], class:"all" },
    // Resource Per Second — confirmed on chest AND boots (corrected from Owen's report)
    { id:"resource-regen",    name:"Resource per Second",       prisms:["resourceful"],
      slots:["helm","chest","boots","amulet"],
      class:"all",
      note:"Your class's primary resource regen per second (Fury/Mana/Energy/Spirit etc.). Confirmed on Helm, Chest, Boots, Amulet." },
    { id:"resource-gen",      name:"Resource Generation",       prisms:["resourceful"],
      slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"resource-cost",     name:"Resource Cost Reduction",   prisms:["resourceful"],
      slots:["helm","chest","gloves","pants","boots","ring","amulet"], class:"all" },
    { id:"resource-on-kill",  name:"Resource on Kill",          prisms:["resourceful"],
      slots:["ring","amulet","boots","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },
    { id:"resource-on-lh",    name:"Resource on Lucky Hit",     prisms:["resourceful"],
      slots:["ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"], class:"all" },

    // ══════════════════════════════════════════════════════════
    // PRAGMATIC — Utility & Mobility
    // ══════════════════════════════════════════════════════════

    // CDR — confirmed on helm, gloves, ring, amulet (NOT chest)
    { id:"cdr",               name:"Cooldown Reduction",        prisms:["pragmatic"],
      slots:["helm","gloves","ring","amulet"],
      class:"all", note:"Confirmed on Helm, Gloves, Ring, Amulet. Not available on chest, pants, or boots." },
    { id:"lucky-hit-chance",  name:"Lucky Hit Chance",          prisms:["pragmatic"],
      slots:["helm","gloves","boots","ring","amulet","weapon","w2h-blunt","w2h-slash","w1h-main","w1h-off"],
      class:"all" },
    { id:"move-speed",        name:"Movement Speed",            prisms:["pragmatic"],
      slots:["boots","pants","amulet","ring"], class:"all" },
    { id:"healing-received",  name:"Healing Received",          prisms:["pragmatic"],
      slots:["helm","chest","pants","boots","ring","amulet"], class:"all" },
    { id:"max-evade",         name:"Maximum Evade Charges",     prisms:["pragmatic"],
      slots:["boots","pants","amulet"], class:"all" },
    { id:"evade-move-speed",  name:"Evade Grants Movement Speed",prisms:["pragmatic"],
      slots:["boots","amulet"], class:"all" },
    { id:"evade-cdr",         name:"Attacks Reduce Evade Cooldown",prisms:["pragmatic"],
      slots:["boots","gloves","amulet"], class:"all" },
    { id:"potion-capacity",   name:"Potion Capacity",           prisms:["pragmatic"],
      slots:["pants","boots","ring"], class:"all" },
    { id:"impairment-reduction",name:"Impairment Reduction",    prisms:["pragmatic"],
      slots:["helm","chest","pants","boots","amulet"],
      class:"all", note:"Reduces duration of stuns, slows, freezes, and other CC effects on you." },

    // ══════════════════════════════════════════════════════════
    // NO TUNING PRISM — Cannot be targeted (random only)
    // ══════════════════════════════════════════════════════════

    { id:"fortify-gen",       name:"Fortify Generation",        prisms:["none"],
      slots:["helm","chest","gloves","pants","boots","amulet"],
      class:"all",
      note:"⚠️ Cannot be targeted by ANY Tuning Prism. Rolls randomly only." },
    { id:"barrier-gen",       name:"Barrier Generation",        prisms:["none"],
      slots:["helm","chest","gloves","pants","boots","amulet"],
      class:"all",
      note:"⚠️ Cannot be targeted by ANY Tuning Prism. Rolls randomly only." },

  ],

  // ── Inherent Affixes by Weapon Type ──────────────────────────
  // Built-in affixes that always appear — don't count as a rollable slot.
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
