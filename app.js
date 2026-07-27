// ============================================================
// NEPHALEM'S CODEX — Application Logic
// GitHub: https://github.com/alltrueist/nephalimscodex
// ============================================================

const STATE = {
  buildName:       '',
  buildClass:      '',
  gear:            {},
  activeSlot:      null,
  pendingItemName: null,  // tracks name selected via Quick Pick (unique/mythic)
  mobileTab:       'build',
};

// ── GEAR SLOT DEFINITIONS ─────────────────────────────────────
const BASE_SLOTS = [
  { id:"helm",   label:"Helm",    icon:"🪖", itemSlot:"helm",    aspectSlot:"helm"    },
  { id:"chest",  label:"Chest",   icon:"🛡️", itemSlot:"chest",   aspectSlot:"chest"   },
  { id:"gloves", label:"Gloves",  icon:"🧤", itemSlot:"gloves",  aspectSlot:"gloves"  },
  { id:"pants",  label:"Pants",   icon:"👖", itemSlot:"pants",   aspectSlot:"pants"   },
  { id:"boots",  label:"Boots",   icon:"👢", itemSlot:"boots",   aspectSlot:"boots"   },
  { id:"amulet", label:"Amulet",  icon:"📿", itemSlot:"amulet",  aspectSlot:"amulet"  },
  { id:"ring1",  label:"Ring 1",  icon:"💍", itemSlot:"ring",    aspectSlot:"ring"    },
  { id:"ring2",  label:"Ring 2",  icon:"💍", itemSlot:"ring",    aspectSlot:"ring"    },
];
const BARBARIAN_WEAPON_SLOTS = [
  { id:"w2h-blunt", label:"2H Bludgeoning", icon:"🔨",
    note:"Mace / Hammer / Scythe — Overpower and Stagger skills",
    itemSlot:"weapon", aspectSlot:"weapon" },
  { id:"w2h-slash", label:"2H Slashing",    icon:"⚔️",
    note:"Sword / Axe / Polearm / Glaive — Bleed and Cleave skills",
    itemSlot:"weapon", aspectSlot:"weapon" },
  { id:"w1h-main",  label:"1H Weapon",      icon:"🗡️",
    note:"Main hand — Fury generation, fast attacks",
    itemSlot:"weapon", aspectSlot:"weapon" },
  { id:"w1h-off",   label:"1H Off-Hand",    icon:"🤺",
    note:"Second one-hander (Arsenal dual-wield)",
    itemSlot:"weapon", aspectSlot:"weapon" },
];
const DEFAULT_WEAPON_SLOTS = [
  { id:"weapon",  label:"Weapon",   icon:"⚔️",
    note:"1H or 2H — equipping 2H blocks the Off-Hand slot",
    itemSlot:"weapon",  aspectSlot:"weapon"  },
  { id:"offhand", label:"Off-Hand", icon:"🛡️",
    note:"Shield / Focus / Totem — only usable with 1H Weapon",
    itemSlot:"offhand", aspectSlot:"offhand" },
];
const TWO_HANDED_DISPLAYS = [
  "2H Sword","2H Axe","2H Mace","2H Scythe",
  "Staff","Bow","Crossbow","Polearm","Glaive","Quarterstaff"
];

function getGearSlots() {
  const weaponSlots = STATE.buildClass === 'Barbarian'
    ? BARBARIAN_WEAPON_SLOTS : DEFAULT_WEAPON_SLOTS;
  return [...BASE_SLOTS, ...weaponSlots];
}
function weaponSlotIs2H() {
  const item = STATE.gear['weapon'];
  if (!item) return false;
  const d = (item.slotDisplay || '').trim();
  return TWO_HANDED_DISPLAYS.some(t => d === t) || d.startsWith('2H');
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderClassOptions();
  renderGearSlots();
  buildAspectAutocomplete(null);
  renderGuide();
  attachListeners();
  updateClassGate();
  // Initialise mobile: show first tab
  if (window.innerWidth <= 900) setMobileTab('build');
});

// ── STORAGE ───────────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('d4_build', JSON.stringify({
    buildName:  STATE.buildName,
    buildClass: STATE.buildClass,
    gear:       STATE.gear,
  }));
}
function loadFromStorage() {
  const s = localStorage.getItem('d4_build');
  if (!s) return;
  const p = JSON.parse(s);
  STATE.buildName  = p.buildName  || '';
  STATE.buildClass = p.buildClass || '';
  STATE.gear       = p.gear       || {};
  document.getElementById('build-name').value  = STATE.buildName;
  document.getElementById('build-class').value = STATE.buildClass;
}

// ── CLASS GATE ────────────────────────────────────────────────
function updateClassGate() {
  const gate = document.getElementById('class-gate');
  if (!gate) return;
  gate.style.display = STATE.buildClass ? 'none' : 'flex';
}

// ── MOBILE TABS ───────────────────────────────────────────────
function setMobileTab(tabName) {
  STATE.mobileTab = tabName;
  const build = document.getElementById('panel-build');
  const right  = document.getElementById('panel-right');

  // On desktop, mobile tab switching just delegates to the right panel sub-tabs
  if (window.innerWidth > 900) {
    if (tabName === 'guide' || tabName === 'craft') switchRightTab(tabName);
    return;
  }

  // Mobile: show one panel at a time
  if (tabName === 'build') {
    build.style.display = 'flex';
    right.style.display  = 'none';
  } else {
    build.style.display = 'none';
    right.style.display  = 'block';
    switchRightTab(tabName);
  }

  document.querySelectorAll('.mob-tab').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById('mobtab-' + tabName);
  if (btn) btn.classList.add('active');
}

function switchRightTab(tab) {
  const guide = document.getElementById('panel-guide');
  const craft = document.getElementById('panel-craft');
  if (guide) guide.style.display = tab === 'guide' ? 'block' : 'none';
  if (craft) craft.style.display = tab === 'craft' ? 'block' : 'none';
  document.getElementById('rtab-guide')?.classList.toggle('active', tab === 'guide');
  document.getElementById('rtab-craft')?.classList.toggle('active', tab === 'craft');

  if (tab === 'craft') {
    // Sync class to crafting sim whenever the craft tab is opened
    CraftSim.cls  = STATE.buildClass || null;
    CraftSim.renderSlotSelector();
    CraftSim.showClassStatus();
    CraftSim.renderAfixPicker();
    CraftSim.renderSelected();
    CraftSim.renderPlan();
  }
}

// ── LISTENERS ─────────────────────────────────────────────────
function attachListeners() {
  document.getElementById('build-name').addEventListener('input', e => {
    STATE.buildName = e.target.value;
    saveToStorage(); renderGuide();
  });

  document.getElementById('build-class').addEventListener('change', e => {
    const prev = STATE.buildClass;
    STATE.buildClass = e.target.value;

    if (prev !== STATE.buildClass) {
      // Remove incompatible weapon slots when switching to/from Barbarian
      if (prev === 'Barbarian') ['w2h-blunt','w2h-slash','w1h-main','w1h-off'].forEach(id => delete STATE.gear[id]);
      else if (STATE.buildClass === 'Barbarian') ['weapon','offhand'].forEach(id => delete STATE.gear[id]);
    }

    saveToStorage();
    updateClassGate();
    renderGearSlots();
    renderGuide();
    buildAspectAutocomplete(STATE.activeSlot);

    // Sync crafting sim
    CraftSim.cls   = STATE.buildClass || null;
    CraftSim.picks = [];
    CraftSim.renderSlotSelector();
    CraftSim.showClassStatus();
    CraftSim.renderAfixPicker();
    CraftSim.renderSelected();
    CraftSim.renderPlan();

    if (STATE.activeSlot) {
      updateItemAutocomplete(STATE.activeSlot);
      renderQuickPick(STATE.activeSlot);
    }
  });

  document.getElementById('btn-clear-build').addEventListener('click',   clearBuild);
  document.getElementById('btn-copy-guide').addEventListener('click',    copyGuide);
  document.getElementById('btn-save-item').addEventListener('click',     saveItem);
  document.getElementById('btn-delete-item').addEventListener('click',   deleteItem);
  document.getElementById('btn-close-panel').addEventListener('click',   closeEditPanel);
  document.getElementById('btn-plan-craft')?.addEventListener('click',   () => {
    if (STATE.activeSlot) CraftSim.prefillFromSlot(STATE.activeSlot);
  });

  // Auto-name legendary items from aspect field
  document.getElementById('edit-aspect').addEventListener('input', () => {
    // No separate display needed — the aspect IS the name at save time
  });

  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => selectItemType(tab.dataset.type));
  });
}

function renderClassOptions() {
  const sel = document.getElementById('build-class');
  // Keep the first "Select class..." option, then add classes
  while (sel.options.length > 1) sel.remove(1);
  D4DB.classes.forEach(cls => {
    const opt = document.createElement('option');
    opt.value = cls; opt.textContent = cls;
    if (cls === STATE.buildClass) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ── FILTERING ─────────────────────────────────────────────────
function classMatches(itemClass, selectedClass) {
  if (!selectedClass)       return true;
  if (itemClass === 'all')  return true;
  return itemClass.split(',').map(c => c.trim()).includes(selectedClass);
}

function getFilteredUniques(slotId) {
  const slotDef  = getGearSlots().find(s => s.id === slotId);
  const itemSlot = slotDef ? slotDef.itemSlot : (D4DB.slotCategoryMap[slotId] || slotId);
  const cls      = STATE.buildClass;
  return D4DB.uniques.filter(item =>
    item.slot === itemSlot && classMatches(item.class, cls)
  );
}

function getFilteredAspects(slotId) {
  if (!D4DB.aspects || !D4DB.aspects.length) return [];
  const cls = STATE.buildClass;
  let aspectSlot = null;
  if (slotId) {
    const slotDef = getGearSlots().find(s => s.id === slotId);
    aspectSlot    = slotDef ? slotDef.aspectSlot : slotId;
    if (slotId === 'ring1' || slotId === 'ring2') aspectSlot = 'ring';
  }
  return D4DB.aspects.filter(a => {
    if (!classMatches(a.class, cls)) return false;
    if (aspectSlot && a.slots && a.slots.length > 0) return a.slots.includes(aspectSlot);
    return true;
  });
}

// ── GEAR SLOTS ────────────────────────────────────────────────
function renderGearSlots() {
  const grid = document.getElementById('gear-grid');
  grid.innerHTML = '';

  getGearSlots().forEach(slot => {
    const item = STATE.gear[slot.id];
    const isBlocked = slot.id === 'offhand'
      && STATE.buildClass !== 'Barbarian'
      && weaponSlotIs2H();

    const card = document.createElement('div');
    let cls = 'gear-slot-card';
    if (isBlocked)  cls += ' is-blocked';
    else if (item)  cls += ' is-filled is-' + item.type;
    card.className    = cls;
    card.dataset.slot = slot.id;

    card.addEventListener('click', () => {
      if (!STATE.buildClass) {
        showToast('⚠️ Select your class first!');
        document.getElementById('build-class').focus();
        return;
      }
      if (isBlocked) {
        showToast('⚠️ Off-Hand unavailable — 2H Weapon is equipped.');
        return;
      }
      openEditPanel(slot.id);
    });

    let bc = 'badge-empty', bt = 'Empty';
    if (isBlocked) { bc = 'badge-blocked'; bt = '2H Only'; }
    else if (item) {
      if (item.type === 'unique')    { bc = 'badge-unique';    bt = 'Unique'; }
      if (item.type === 'legendary') { bc = 'badge-legendary'; bt = 'Legendary'; }
      if (item.type === 'mythic')    { bc = 'badge-mythic';    bt = 'Mythic'; }
    }

    const avail    = (STATE.buildClass && !isBlocked) ? getFilteredUniques(slot.id).length : 0;
    const hintHtml = (STATE.buildClass && !isBlocked && avail > 0)
      ? `<span class="slot-available-hint">${avail}</span>` : '';

    const nameText = isBlocked
      ? '🚫 Unavailable with 2H'
      : (item ? (item.name || item.aspect || '(Unnamed)') : 'Click to add');

    const noteHtml = (slot.note && !item && !isBlocked)
      ? `<div class="slot-note">${slot.note}</div>` : '';

    card.innerHTML = `
      <div class="slot-icon">${slot.icon}</div>
      <div class="slot-info">
        <div class="slot-label">${slot.label} ${hintHtml}</div>
        <div class="slot-item-name ${(item && !isBlocked) ? '' : 'empty'}">${nameText}</div>
        ${noteHtml}
      </div>
      <div class="slot-type-badge ${bc}">${bt}</div>
      <div class="slot-edit-btn">${(item && !isBlocked) ? '✏️' : (isBlocked ? '' : '+')}</div>`;
    grid.appendChild(card);
  });
}

// ── AUTOCOMPLETE ──────────────────────────────────────────────
function updateItemAutocomplete(slotId) {
  // Not used for display but kept for Quick Pick filtering
  // Quick Pick renders directly via renderQuickPick()
}

function buildAspectAutocomplete(slotId) {
  const list = document.getElementById('aspect-names-list');
  if (!list) return;
  list.innerHTML = '';
  const seen = new Set();
  getFilteredAspects(slotId).forEach(a => {
    if (seen.has(a.name)) return;
    seen.add(a.name);
    const opt = document.createElement('option');
    opt.value = a.name;
    list.appendChild(opt);
  });
}

// ── QUICK PICK ────────────────────────────────────────────────
function renderQuickPick(slotId) {
  const container = document.getElementById('quick-pick-list');
  const countEl   = document.getElementById('qp-count');
  const items     = getFilteredUniques(slotId);

  if (!items.length) {
    countEl.textContent  = '(0 items)';
    container.innerHTML  = `<div style="font-size:11px;color:var(--text-dim);padding:8px 10px;">
      No items for this slot${STATE.buildClass ? ' and class' : ''}.
    </div>`;
    return;
  }
  countEl.textContent = `(${items.length})`;

  const mythics   = items.filter(i => i.itemType === 'mythic');
  const bossItems = items.filter(i => i.itemType === 'unique' && i.sources.some(s => s.type === 'boss'));
  const poolItems = items.filter(i => i.itemType === 'unique' && i.sources.every(s => s.type === 'pool'));

  let html = '';
  if (mythics.length)   { html += `<div class="qp-group-label">⚜️ Mythic</div>`;      mythics.forEach(i   => { html += qpItemHTML(i); }); }
  if (bossItems.length) { html += `<div class="qp-group-label">💀 Boss Drops</div>`;  bossItems.forEach(i => { html += qpItemHTML(i); }); }
  if (poolItems.length) { html += `<div class="qp-group-label">🎲 General Pool</div>`;poolItems.forEach(i => { html += qpItemHTML(i); }); }
  container.innerHTML = html;
}

function qpItemHTML(item) {
  const src  = item.sources.find(s => s.type === 'boss' || s.type === 'mythic') || item.sources[0];
  const tc   = item.itemType === 'mythic' ? 'qp-badge-mythic' : 'qp-badge-unique';
  const tn   = item.itemType === 'mythic' ? 'Mythic' : 'Unique';
  const name = item.name.replace(/'/g, "\\'");
  return `
    <div class="quick-pick-item" onclick="selectQP('${name}','${item.itemType}','${item.slotDisplay || ''}')">
      <div class="qp-info">
        <span class="qp-name">${item.name}</span>
        <span class="qp-slot-display">${item.slotDisplay}</span>
      </div>
      <div class="qp-right">
        <span class="qp-source">${src ? src.label : '—'}</span>
        <span class="qp-badge ${tc}">${tn}</span>
      </div>
    </div>`;
}

function selectQP(name, type, slotDisplay) {
  STATE.pendingItemName = name;
  const nameEl  = document.getElementById('sd-name');
  const badgeEl = document.getElementById('sd-badge');
  if (nameEl)  nameEl.textContent  = name;
  if (badgeEl) {
    badgeEl.textContent  = type === 'mythic' ? 'Mythic' : 'Unique';
    badgeEl.className    = 'sd-badge ' + (type === 'mythic' ? 'sd-badge-mythic' : 'sd-badge-unique');
  }
  selectItemType(type || 'unique');
}

// ── EDIT PANEL ────────────────────────────────────────────────
function openEditPanel(slotId) {
  STATE.activeSlot     = slotId;
  STATE.pendingItemName = null;
  const slot = getGearSlots().find(s => s.id === slotId);
  const item = STATE.gear[slotId] || {};

  document.getElementById('edit-slot-label').textContent =
    `${slot ? slot.icon : ''} ${slot ? slot.label : slotId}`;

  const type = item.type || 'legendary';
  selectItemType(type);

  if (type === 'legendary') {
    document.getElementById('edit-aspect').value      = item.aspect || item.name || '';
    document.getElementById('edit-tempers').value     = (item.tempers || []).join(', ');
    document.getElementById('edit-mw-priority').value = item.mwPriority || '';
    document.getElementById('edit-notes-leg').value   = item.notes || '';
  } else {
    // Unique/Mythic — restore selected name display
    STATE.pendingItemName = item.name || null;
    const nameEl  = document.getElementById('sd-name');
    const badgeEl = document.getElementById('sd-badge');
    if (nameEl) nameEl.textContent = item.name || 'None — click an item below';
    if (badgeEl) {
      badgeEl.textContent = item.type === 'mythic' ? 'Mythic' : (item.type === 'unique' ? 'Unique' : '');
      badgeEl.className = 'sd-badge' + (item.type === 'mythic' ? ' sd-badge-mythic' : item.type === 'unique' ? ' sd-badge-unique' : '');
    }
    document.getElementById('edit-notes-unique').value = item.notes || '';
  }

  buildAspectAutocomplete(slotId);
  renderQuickPick(slotId);
  document.getElementById('edit-panel').classList.add('open');

  if (type === 'legendary') document.getElementById('edit-aspect').focus();
}

function closeEditPanel() {
  document.getElementById('edit-panel').classList.remove('open');
  STATE.activeSlot      = null;
  STATE.pendingItemName = null;
}

function selectItemType(type) {
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active-legendary', 'active-unique', 'active-mythic');
    if (tab.dataset.type === type) tab.classList.add(`active-${type}`);
  });
  const legView    = document.getElementById('view-legendary');
  const uniView    = document.getElementById('view-unique');
  const planBtn    = document.getElementById('btn-plan-craft');
  const isLeg      = type === 'legendary';
  if (legView) legView.style.display = isLeg ? 'block' : 'none';
  if (uniView) uniView.style.display = isLeg ? 'none'  : 'block';
  if (planBtn) planBtn.style.display = isLeg ? 'block' : 'none';
}

function getSelectedType() {
  const a = document.querySelector('.type-tab[class*="active-"]');
  return a ? a.dataset.type : 'legendary';
}

// ── SAVE / DELETE ─────────────────────────────────────────────
function saveItem() {
  const slotId = STATE.activeSlot;
  if (!slotId) return;
  if (!STATE.buildClass) {
    showToast('⚠️ Select your class first!');
    return;
  }

  const type = getSelectedType();
  let name, aspect, tempers, mwPriority, notes;

  if (type === 'legendary') {
    aspect = document.getElementById('edit-aspect').value.trim();
    if (!aspect) { showToast('Enter a Legendary Aspect — it becomes the item name.'); return; }
    name       = aspect; // aspect IS the name for legendaries
    tempers    = document.getElementById('edit-tempers').value.trim()
                  .split(',').map(s => s.trim()).filter(Boolean);
    mwPriority = document.getElementById('edit-mw-priority').value.trim();
    notes      = document.getElementById('edit-notes-leg').value.trim();
  } else {
    // Unique or Mythic — name comes from Quick Pick (STATE.pendingItemName)
    name = STATE.pendingItemName;
    if (!name) { showToast('Select an item from the Quick Pick list.'); return; }
    aspect = ''; tempers = []; mwPriority = '';
    notes  = document.getElementById('edit-notes-unique').value.trim();
  }

  const dbEntry = lookupUniqueByName(name) || null;

  // 2H weapon → auto-clear off-hand for non-Barbarian
  if (slotId === 'weapon' && STATE.gear['offhand'] && STATE.buildClass !== 'Barbarian') {
    const disp = dbEntry ? (dbEntry.slotDisplay || '') : '';
    if (TWO_HANDED_DISPLAYS.some(t => disp === t) || disp.startsWith('2H')) {
      delete STATE.gear['offhand'];
      showToast('⚠️ 2H Weapon equipped — Off-Hand cleared automatically.');
    }
  }
  // Block saving to a locked off-hand
  if (slotId === 'offhand' && STATE.buildClass !== 'Barbarian' && weaponSlotIs2H()) {
    showToast('⚠️ Off-Hand unavailable — remove or replace the 2H Weapon first.');
    return;
  }

  STATE.gear[slotId] = {
    name, type, aspect, tempers, mwPriority, notes, slotId,
    slotDisplay: dbEntry ? (dbEntry.slotDisplay || '') : '',
    dbEntry,
    affixes: [], // affixes now handled by crafting simulator
  };

  saveToStorage(); renderGearSlots(); renderGuide(); closeEditPanel();
  showToast(`✅ ${name} saved!`);
}

function deleteItem() {
  const slotId = STATE.activeSlot;
  if (!slotId || !STATE.gear[slotId]) { closeEditPanel(); return; }
  const name = STATE.gear[slotId].name;
  delete STATE.gear[slotId];
  saveToStorage(); renderGearSlots(); renderGuide(); closeEditPanel();
  showToast(`🗑️ ${name} removed.`);
}

// ── DB LOOKUPS ────────────────────────────────────────────────
function lookupUniqueByName(name) {
  if (!name) return null;
  const l = name.toLowerCase();
  return D4DB.uniques.find(u => u.name.toLowerCase() === l) || null;
}
function lookupAspectByName(name) {
  if (!name || !D4DB.aspects) return null;
  const l = name.toLowerCase();
  return D4DB.aspects.find(a => a.name.toLowerCase() === l) || null;
}
function lookupBossById(id) { return D4DB.bosses.find(b => b.id === id) || null; }

// ── GUIDE RENDERING ───────────────────────────────────────────
function renderGuide() {
  const container  = document.getElementById('guide-output');
  const buildLabel = document.getElementById('build-name-display');
  buildLabel.textContent =
    (STATE.buildName || 'Untitled Build') +
    (STATE.buildClass ? ` — ${STATE.buildClass}` : '');

  const slots  = getGearSlots();
  const filled = Object.values(STATE.gear).filter(Boolean);
  if (!filled.length) { container.innerHTML = emptyStateHTML(); return; }

  const bossDrops = {}, poolDrops = [], mythicDrops = [],
        aspects = [], legendaryBuilds = [];

  filled.forEach(item => {
    const slotDef   = slots.find(s => s.id === item.slotId);
    const slotLabel = slotDef ? slotDef.label : item.slotId;

    if (item.type === 'unique' || item.type === 'mythic') {
      const db = item.dbEntry || lookupUniqueByName(item.name);
      if (db) {
        db.sources.forEach(src => {
          if (src.type === 'mythic') {
            if (!mythicDrops.find(m => m.itemName === item.name))
              mythicDrops.push({ slotLabel, itemName: item.name });
          } else if (src.type === 'boss') {
            if (!bossDrops[src.boss]) bossDrops[src.boss] = [];
            bossDrops[src.boss].push({ slotLabel, itemName: item.name });
          } else if (src.type === 'pool') {
            if (!poolDrops.find(p => p.itemName === item.name))
              poolDrops.push({ slotLabel, itemName: item.name, notes: db.notes });
          }
        });
      } else {
        poolDrops.push({ slotLabel, itemName: item.name, notes: '⚠️ Not in DB — verify on Maxroll.gg' });
      }
    }

    if (item.type === 'legendary') {
      if (item.aspect) aspects.push({ aspectName: item.aspect, slotLabel, dbAspect: lookupAspectByName(item.aspect) });
      if (item.tempers && item.tempers.length) legendaryBuilds.push({ item, slotLabel });
    }
  });

  let html = '<div class="guide-sections">';
  if (mythicDrops.length)                                    html += sectionMythic(mythicDrops);
  if (Object.keys(bossDrops).length || poolDrops.length)    html += sectionBosses(bossDrops, poolDrops);
  if (aspects.length)                                        html += sectionAspects(aspects);
  if (legendaryBuilds.length)                               html += sectionLegendarySteps(legendaryBuilds);
  html += sectionCubeRef();
  html += '</div>';
  container.innerHTML = html;
}

function emptyStateHTML() {
  return `<div class="guide-empty">
    <div class="guide-empty-icon">📜</div>
    <h2>Your Acquisition Guide Awaits</h2>
    <p>Add items to your gear slots${STATE.buildClass ? '' : ' (select your class first)'} and the guide will show boss farm targets, aspect sources, and step-by-step crafting plans.</p>
  </div>`;
}

function sectionMythic(drops) {
  return `<div class="guide-section" style="border-color:rgba(155,89,182,0.4);">
    <div class="guide-section-header" style="background:linear-gradient(135deg,rgba(90,45,130,0.15),transparent);">
      <div class="guide-section-icon">⚜️</div>
      <div class="guide-section-title" style="color:var(--purple-bright);">Mythic Unique Targets</div>
      <div class="guide-section-count" style="background:rgba(90,45,130,0.3);color:var(--purple-bright);">${drops.length}</div>
    </div>
    <div class="guide-section-body">
      <div style="font-size:11px;color:var(--text-muted);padding:8px 10px;background:rgba(90,45,130,0.1);border-radius:4px;border-left:2px solid var(--purple-bright);">
        ⚜️ Any Tormented Boss can drop Mythics. <strong style="color:var(--orange-bright)">Belial (Exalted)</strong> has the highest chance.
        Key: <strong>Betrayer's Husk ×2</strong> from Greater Lair Bosses.
      </div>
      ${drops.map(d => `<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span><span class="drop-item-name" style="color:var(--purple-bright);">⚜️ ${d.itemName}</span></div>`).join('')}
    </div>
  </div>`;
}

function sectionBosses(bossDrops, poolDrops) {
  const total = Object.keys(bossDrops).length + (poolDrops.length ? 1 : 0);
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">💀</div>
      <div class="guide-section-title">Boss Farm Targets</div>
      <div class="guide-section-count">${total}</div>
    </div>
    <div class="guide-section-body">`;
  Object.entries(bossDrops).forEach(([bossId, drops]) => {
    const boss = lookupBossById(bossId); if (!boss) return;
    html += `<div class="boss-card">
      <div class="boss-card-header"><div class="boss-name">💀 ${boss.name}</div><div class="boss-tier-badge tier-${boss.tier.toLowerCase()}">${boss.tier}</div></div>
      <div class="boss-key-info"><strong>Key:</strong> ${boss.keyMaterial} &nbsp;|&nbsp; <strong>Source:</strong> ${boss.keySource}</div>
      <div>${drops.map(d=>`<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span><span class="drop-item-name">${d.itemName}</span></div>`).join('')}
        ${boss.notes ? `<div style="font-size:10px;color:var(--text-dim);margin-top:5px;">💡 ${boss.notes}</div>` : ''}
      </div>
    </div>`;
  });
  if (poolDrops.length) {
    html += `<div class="boss-card">
      <div class="boss-card-header"><div class="boss-name">🎲 General Pool</div><div class="boss-tier-badge tier-initiate">Any Boss</div></div>
      <div class="boss-key-info">No dedicated boss. Use <strong>Horadric Cube 3-to-1 Transmutation</strong> for best results.</div>
      <div>${poolDrops.map(d=>`<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span><span class="drop-item-name">${d.itemName}</span></div>`).join('')}</div>
    </div>`;
  }
  html += `</div></div>`; return html;
}

function sectionAspects(aspects) {
  const seen = new Set();
  const uniq = aspects.filter(a => { if (seen.has(a.aspectName)) return false; seen.add(a.aspectName); return true; });
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">📖</div>
      <div class="guide-section-title">Aspects to Collect</div>
      <div class="guide-section-count">${uniq.length}</div>
    </div>
    <div class="guide-section-body">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
        ⚠️ Since <strong style="color:var(--gold-light)">Lord of Hatred</strong>, aspects are drop-driven — no dungeon guarantee.
        Salvage Legendaries at the Blacksmith to unlock, then imprint at the <strong>Occultist</strong>.
      </div>`;
  uniq.forEach(a => {
    const db = a.dbAspect;
    html += `<div class="aspect-card">
      <div class="aspect-name">📜 ${a.aspectName}</div>
      <div class="aspect-slot">Equipping on: ${a.slotLabel}${db && db.slots ? ' | Valid slots: ' + db.slots.join(', ') : ''}</div>
      ${db ? `<div class="aspect-effect">"${db.effect}"</div>` : ''}
      <div class="aspect-source"><strong>Source:</strong> ${db ? db.source : 'Salvage Legendary drops'}</div>
    </div>`;
  });
  html += `</div></div>`; return html;
}

function sectionLegendarySteps(legendaryBuilds) {
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">🔨</div>
      <div class="guide-section-title">Gear Building Steps</div>
      <div class="guide-section-count">${legendaryBuilds.length}</div>
    </div>
    <div class="guide-section-body">`;
  legendaryBuilds.forEach(lb => {
    const { item, slotLabel } = lb;
    html += `<div class="gear-build-card">
      <div class="gear-build-header">
        <span class="gear-build-slot">${slotLabel}</span>
        <span class="gear-build-name">${item.name}</span>
        <span class="slot-type-badge badge-legendary">Legendary</span>
      </div>
      <div class="gear-build-steps">`;
    D4DB.legendaryWorkflow.forEach(step => {
      let extra = '';
      if (step.step === 3 && item.aspect)
        extra = `<div style="margin-top:4px;"><span class="affix-tag" style="background:rgba(200,147,42,0.2);color:var(--gold-light);">📜 ${item.aspect}</span></div>`;
      if (step.step === 4 && item.tempers?.length)
        extra = `<div class="step-affix-list">${item.tempers.map(t=>`<span class="temper-tag">🔵 ${t}</span>`).join('')}</div>`;
      if (step.step === 5 && item.mwPriority)
        extra = `<div style="margin-top:4px;"><span class="mw-tag">⭐ ${item.mwPriority}</span></div>`;
      html += `<div class="gear-build-step">
        <div class="step-number">${step.step}</div>
        <div><div class="step-text">${step.icon} <strong>${step.name}</strong></div>
          <div class="step-detail">${step.detail}</div>${extra}</div>
      </div>`;
    });
    if (item.notes) html += `<div style="margin-top:8px;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:4px;font-size:11px;color:var(--text-muted);border-left:2px solid var(--border-bright);">📝 ${item.notes}</div>`;
    html += `</div></div>`;
  });
  html += `</div></div>`; return html;
}

function sectionCubeRef() {
  const all = [...D4DB.cubeRecipes.gearModification, ...D4DB.cubeRecipes.itemTransmutation];
  return `<div class="guide-section">
    <div class="guide-section-header"><div class="guide-section-icon">📚</div><div class="guide-section-title">Horadric Cube Quick Reference</div></div>
    <div class="guide-section-body">
      <div class="reference-grid">${all.map(r=>`<div class="ref-card">
        <div class="ref-card-title"><span>${r.icon}</span><span style="color:var(--text-label)">${r.name}</span></div>
        <div class="ref-card-desc">${r.description}</div>
        <div class="ref-card-mat">📦 ${r.materials}</div>
        <div class="ref-card-tip">💡 ${r.tip}</div>
      </div>`).join('')}</div>
      <div style="margin-top:14px;">
        <div class="section-title-bar" style="margin-bottom:8px;">🎨 Tuning Prisms</div>
        <div class="reference-grid">${D4DB.tuningPrisms.map(p=>`<div class="ref-card">
          <div class="ref-card-title">${p.icon} ${p.name}</div>
          <div class="ref-card-desc">Controls: <strong style="color:var(--text-label)">${p.controls}</strong></div>
          <div class="ref-card-mat">${p.examples}</div>
        </div>`).join('')}</div>
      </div>
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────
function clearBuild() {
  if (!confirm('Clear this entire build? This cannot be undone.')) return;
  STATE.buildName = ''; STATE.buildClass = ''; STATE.gear = {};
  document.getElementById('build-name').value  = '';
  document.getElementById('build-class').value = '';
  localStorage.removeItem('d4_build');
  updateClassGate();
  renderGearSlots(); renderGuide();
  showToast('🗑️ Build cleared.');
}

function copyGuide() {
  const filled = Object.values(STATE.gear).filter(Boolean);
  if (!filled.length) { showToast('Nothing to copy yet!'); return; }
  const slots = getGearSlots();
  let text = `=== NEPHALEM'S CODEX ===\n${STATE.buildName||'Build'} — ${STATE.buildClass||'Unknown'} | Season 14\n\n`;
  filled.forEach(item => {
    const slot = slots.find(s => s.id === item.slotId);
    text += `[${slot ? slot.label.toUpperCase() : item.slotId.toUpperCase()}] ${item.name} (${item.type})\n`;
    const db = item.dbEntry || lookupUniqueByName(item.name);
    if (db) db.sources.forEach(s => { text += `  Source: ${s.label} — ${s.detail}\n`; });
    if (item.aspect)          text += `  Aspect: ${item.aspect}\n`;
    if (item.tempers?.length) text += `  Tempers: ${item.tempers.join(', ')}\n`;
    if (item.mwPriority)      text += `  MW Priority: ${item.mwPriority}\n`;
    if (item.notes)           text += `  Note: ${item.notes}\n`;
    text += '\n';
  });
  navigator.clipboard.writeText(text).then(() => showToast('📋 Copied to clipboard!'));
}

// ── UTILITIES ─────────────────────────────────────────────────
function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}
