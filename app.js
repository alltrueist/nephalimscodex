// ============================================================
// NEPHALEM'S CODEX — Application Logic
// GitHub: https://github.com/alltrueist/nephalimscodex
// Live:   https://alltrueist.github.io/nephalimscodex
// ============================================================

const STATE = { buildName:'', buildClass:'', gear:{}, activeSlot:null };

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderClassOptions();
  renderGearSlots();
  buildAspectAutocomplete();
  renderGuide();
  attachListeners();
});

// ── STORAGE ───────────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('d4_build', JSON.stringify({
    buildName:STATE.buildName, buildClass:STATE.buildClass, gear:STATE.gear
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

// ── SLOT UTILITIES ────────────────────────────────────────────
function getSlotCategory(slotId) {
  return D4DB.slotCategoryMap[slotId] || slotId;
}
function getFilteredUniques(slotId) {
  const cat = getSlotCategory(slotId);
  const cls = STATE.buildClass;
  return D4DB.uniques.filter(item => {
    const slotOk  = item.slot === cat;
    const classOk = item.class === 'all' || !cls || item.class === cls;
    return slotOk && classOk;
  });
}
// Multi-class support: class field can be "all", "Rogue", or "Rogue,Druid"
function classMatches(itemClass, selectedClass) {
  if (!selectedClass)             return true;
  if (itemClass === 'all')        return true;
  return itemClass.split(',').map(c => c.trim()).includes(selectedClass);
}
function getFilteredAspects() {
  if (!D4DB.aspects || !D4DB.aspects.length) return [];
  const cls = STATE.buildClass;
  if (!cls) return D4DB.aspects;
  return D4DB.aspects.filter(a => classMatches(a.class, cls));
}

// ── LISTENERS ─────────────────────────────────────────────────
function attachListeners() {
  document.getElementById('build-name').addEventListener('input', e => {
    STATE.buildName = e.target.value; saveToStorage(); renderGuide();
  });
  document.getElementById('build-class').addEventListener('change', e => {
    STATE.buildClass = e.target.value;
    saveToStorage(); renderGearSlots(); renderGuide();
    buildAspectAutocomplete();  // re-filter aspect list to new class
    if (STATE.activeSlot) { updateItemAutocomplete(STATE.activeSlot); renderQuickPick(STATE.activeSlot); }
  });
  document.getElementById('btn-clear-build').addEventListener('click',  clearBuild);
  document.getElementById('btn-copy-guide').addEventListener('click',   copyGuide);
  document.getElementById('btn-save-item').addEventListener('click',    saveItem);
  document.getElementById('btn-delete-item').addEventListener('click',  deleteItem);
  document.getElementById('btn-close-panel').addEventListener('click',  closeEditPanel);
  document.getElementById('edit-item-name').addEventListener('input',   onItemNameInput);
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => selectItemType(tab.dataset.type));
  });
}

function renderClassOptions() {
  const sel = document.getElementById('build-class');
  sel.innerHTML = '<option value="">Select Class...</option>';
  D4DB.classes.forEach(cls => {
    const opt = document.createElement('option');
    opt.value = cls; opt.textContent = cls;
    if (cls === STATE.buildClass) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ── GEAR SLOTS ────────────────────────────────────────────────
function renderGearSlots() {
  const grid = document.getElementById('gear-grid');
  grid.innerHTML = '';
  D4DB.gearSlots.forEach(slot => {
    const item = STATE.gear[slot.id];
    const card = document.createElement('div');
    card.className = 'gear-slot-card' + (item ? ' is-filled is-' + item.type : '');
    card.dataset.slot = slot.id;
    card.addEventListener('click', () => openEditPanel(slot.id));
    let bc = 'badge-empty', bt = 'Empty';
    if (item) {
      if (item.type === 'unique')    { bc = 'badge-unique';    bt = 'Unique'; }
      if (item.type === 'legendary') { bc = 'badge-legendary'; bt = 'Legendary'; }
      if (item.type === 'mythic')    { bc = 'badge-mythic';    bt = 'Mythic'; }
    }
    const avail = getFilteredUniques(slot.id).length;
    const hint  = STATE.buildClass
      ? `<span class="slot-available-hint">${avail} items</span>` : '';
    card.innerHTML = `
      <div class="slot-icon">${slot.icon}</div>
      <div class="slot-info">
        <div class="slot-label">${slot.label} ${hint}</div>
        <div class="slot-item-name ${item ? '' : 'empty'}">
          ${item ? (item.name || '(Unnamed)') : 'Click to add item'}
        </div>
      </div>
      <div class="slot-type-badge ${bc}">${bt}</div>
      <div class="slot-edit-btn">${item ? '✏️' : '+'}</div>`;
    grid.appendChild(card);
  });
}

// ── AUTOCOMPLETE ──────────────────────────────────────────────
function updateItemAutocomplete(slotId) {
  const list = document.getElementById('item-names-list');
  list.innerHTML = '';
  getFilteredUniques(slotId).forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    list.appendChild(opt);
  });
}
function buildAspectAutocomplete() {
  const list = document.getElementById('aspect-names-list');
  list.innerHTML = '';
  const seen = new Set();
  getFilteredAspects().forEach(a => {
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
    countEl.textContent = '(0 items)';
    container.innerHTML = `<div style="font-size:11px;color:var(--text-dim);padding:8px 10px;">
      No items for this slot${STATE.buildClass ? ' and class' : ''}.
      ${!STATE.buildClass ? ' Select a class above to filter.' : ''}
    </div>`;
    return;
  }
  countEl.textContent = `(${items.length} available)`;
  const mythics   = items.filter(i => i.itemType === 'mythic');
  const bossItems = items.filter(i => i.itemType === 'unique' && i.sources.some(s => s.type === 'boss'));
  const poolItems = items.filter(i => i.itemType === 'unique' && i.sources.every(s => s.type === 'pool'));
  let html = '';
  if (mythics.length)   { html += `<div class="qp-group-label">⚜️ Mythic Uniques</div>`;  mythics.forEach(i => { html += qpItem(i); }); }
  if (bossItems.length) { html += `<div class="qp-group-label">💀 Boss Drops</div>`;      bossItems.forEach(i => { html += qpItem(i); }); }
  if (poolItems.length) { html += `<div class="qp-group-label">🎲 General Pool</div>`;   poolItems.forEach(i => { html += qpItem(i); }); }
  container.innerHTML = html;
}
function qpItem(item) {
  const src  = item.sources.find(s => s.type === 'boss' || s.type === 'mythic') || item.sources[0];
  const tc   = item.itemType === 'mythic' ? 'qp-badge-mythic' : 'qp-badge-unique';
  const tn   = item.itemType === 'mythic' ? 'Mythic' : 'Unique';
  const name = item.name.replace(/'/g, "\\'");
  return `<div class="quick-pick-item" onclick="selectQP('${name}','${item.itemType}')">
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
function selectQP(name, type) {
  document.getElementById('edit-item-name').value = name;
  selectItemType(type || 'unique');
  updateDbMatchBanner(name);
}

// ── EDIT PANEL ────────────────────────────────────────────────
function openEditPanel(slotId) {
  STATE.activeSlot = slotId;
  const slot = D4DB.gearSlots.find(s => s.id === slotId);
  const item = STATE.gear[slotId] || {};
  document.getElementById('edit-slot-label').textContent = `${slot.icon} ${slot.label}`;
  document.getElementById('edit-item-name').value   = item.name || '';
  document.getElementById('edit-aspect').value      = item.aspect || '';
  document.getElementById('edit-affixes').value     = (item.affixes || []).join(', ');
  document.getElementById('edit-tempers').value     = (item.tempers || []).join(', ');
  document.getElementById('edit-mw-priority').value = item.mwPriority || '';
  document.getElementById('edit-notes').value       = item.notes || '';
  selectItemType(item.type || 'legendary');
  updateItemAutocomplete(slotId);
  updateDbMatchBanner(item.name || '');
  renderQuickPick(slotId);
  document.getElementById('edit-panel').classList.add('open');
  document.getElementById('edit-item-name').focus();
}
function closeEditPanel() {
  document.getElementById('edit-panel').classList.remove('open');
  STATE.activeSlot = null;
}
function selectItemType(type) {
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active-legendary','active-unique','active-mythic');
    if (tab.dataset.type === type) tab.classList.add(`active-${type}`);
  });
  const lf = document.getElementById('legendary-fields');
  const off = type === 'unique' || type === 'mythic';
  lf.style.opacity = off ? '0.4' : '1';
  lf.style.pointerEvents = off ? 'none' : 'auto';
}
function getSelectedType() {
  const a = document.querySelector('.type-tab[class*="active-"]');
  return a ? a.dataset.type : 'legendary';
}
function onItemNameInput(e) { updateDbMatchBanner(e.target.value.trim()); }
function updateDbMatchBanner(name) {
  const banner = document.getElementById('db-match-banner');
  if (!name) { banner.classList.remove('visible'); return; }
  const match = lookupUniqueByName(name);
  if (match) {
    const src = match.sources.find(s => s.type === 'boss' || s.type === 'mythic');
    banner.textContent = `✨ Found in database! Source: ${src ? src.label : 'General Pool / Cube'}. Guide will auto-populate.`;
    banner.classList.add('visible');
    selectItemType(match.itemType || 'unique');
  } else {
    banner.textContent = `📝 Not in database — enter details manually. (You can still save it!)`;
    banner.classList.add('visible');
  }
}
function saveItem() {
  const slotId = STATE.activeSlot;
  if (!slotId) return;
  const name = document.getElementById('edit-item-name').value.trim();
  if (!name) { showToast('Please enter an item name.'); return; }
  const type       = getSelectedType();
  const aspect     = document.getElementById('edit-aspect').value.trim();
  const affixesRaw = document.getElementById('edit-affixes').value.trim();
  const tempersRaw = document.getElementById('edit-tempers').value.trim();
  const mwPriority = document.getElementById('edit-mw-priority').value.trim();
  const notes      = document.getElementById('edit-notes').value.trim();
  const affixes = affixesRaw ? affixesRaw.split(',').map(a => a.trim()).filter(Boolean) : [];
  const tempers = tempersRaw ? tempersRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  STATE.gear[slotId] = {
    name, type, aspect, affixes, tempers, mwPriority, notes, slotId,
    dbEntry: lookupUniqueByName(name) || null
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

  const filled = Object.values(STATE.gear).filter(Boolean);
  if (!filled.length) { container.innerHTML = emptyStateHTML(); return; }

  const bossDrops = {}, poolDrops = [], mythicDrops = [], cubeItems = [], aspects = [], legendaryBuilds = [];

  filled.forEach(item => {
    const slotDef   = D4DB.gearSlots.find(s => s.id === item.slotId);
    const slotLabel = slotDef ? slotDef.label : item.slotId;
    if (item.type === 'unique' || item.type === 'mythic') {
      const db = item.dbEntry || lookupUniqueByName(item.name);
      if (db) {
        db.sources.forEach(src => {
          if (src.type === 'mythic') {
            if (!mythicDrops.find(m => m.itemName === item.name))
              mythicDrops.push({ slotLabel, itemName:item.name });
          } else if (src.type === 'boss') {
            if (!bossDrops[src.boss]) bossDrops[src.boss] = [];
            bossDrops[src.boss].push({ slotLabel, itemName:item.name });
          } else if (src.type === 'pool') {
            if (!poolDrops.find(p => p.itemName === item.name))
              poolDrops.push({ slotLabel, itemName:item.name, notes:db.notes });
          }
        });
      } else {
        poolDrops.push({ slotLabel, itemName:item.name, notes:'⚠️ Not in database — verify source on Maxroll.gg' });
      }
    }
    if (item.type === 'legendary') {
      if (item.aspect) aspects.push({ aspectName:item.aspect, slotLabel, dbAspect:lookupAspectByName(item.aspect) });
      if (item.affixes && item.affixes.length) legendaryBuilds.push({ item, slotLabel });
    }
  });

  let html = '<div class="guide-sections">';
  if (mythicDrops.length)                                    html += sectionMythic(mythicDrops);
  if (Object.keys(bossDrops).length || poolDrops.length)    html += sectionBosses(bossDrops, poolDrops);
  if (cubeItems.length || legendaryBuilds.length)           html += sectionCube(cubeItems, legendaryBuilds);
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
    <p>Click any gear slot on the left to add items. The guide will show
    <strong>boss farm targets, Cube recipes, aspects, and step-by-step crafting plans.</strong></p>
    <br><p style="color:var(--text-dim);font-size:11px;">
    💡 Select a <strong>Class</strong> first — the Quick Pick browser will filter to what your class can use.</p>
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
        ⚜️ <strong style="color:var(--purple-bright)">Mythic Uniques</strong> drop from any Tormented Boss.
        <strong style="color:var(--orange-bright)">Belial (Exalted Boss)</strong> has the highest chance.
        Key material: <strong>Betrayer's Husk ×2</strong> (from Greater Lair Bosses).
      </div>
      ${drops.map(d => `<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span>
        <span class="drop-item-name" style="color:var(--purple-bright);">⚜️ ${d.itemName}</span></div>`).join('')}
      <div style="font-size:10px;color:var(--text-dim);">
        💡 Farm chain: Initiate Bosses → Greater Boss keys → Greater Bosses → Betrayer's Husks → Belial
      </div>
    </div>
  </div>`;
}

function sectionBosses(bossDrops, poolDrops) {
  const total = Object.keys(bossDrops).length + (poolDrops.length ? 1 : 0);
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">💀</div>
      <div class="guide-section-title">Boss Farm Targets</div>
      <div class="guide-section-count">${total} boss${total !== 1 ? 'es' : ''}</div>
    </div>
    <div class="guide-section-body">`;
  Object.entries(bossDrops).forEach(([bossId, drops]) => {
    const boss = lookupBossById(bossId); if (!boss) return;
    html += `<div class="boss-card">
      <div class="boss-card-header">
        <div class="boss-name">💀 ${boss.name}</div>
        <div class="boss-tier-badge tier-${boss.tier.toLowerCase()}">${boss.tier}</div>
      </div>
      <div class="boss-key-info"><strong>Key Material:</strong> ${boss.keyMaterial} &nbsp;|&nbsp; <strong>Source:</strong> ${boss.keySource}</div>
      <div><div class="boss-drops-label">Targeted drops from this boss:</div>
        ${drops.map(d => `<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span><span class="drop-item-name">${d.itemName}</span></div>`).join('')}
        ${boss.notes ? `<div style="font-size:10px;color:var(--text-dim);margin-top:6px;">💡 ${boss.notes}</div>` : ''}
      </div>
    </div>`;
  });
  if (poolDrops.length) {
    html += `<div class="boss-card">
      <div class="boss-card-header"><div class="boss-name">🎲 General Unique Pool</div><div class="boss-tier-badge tier-initiate">Any Boss</div></div>
      <div class="boss-key-info">No dedicated boss. Best method: <strong>Horadric Cube 3-to-1 Transmutation</strong>. Any Lair Boss can drop these at a low rate.</div>
      <div><div class="boss-drops-label">Use Cube 3-to-1 for these:</div>
        ${poolDrops.map(d => `<div class="drop-item"><span class="drop-slot-tag">${d.slotLabel}</span><span class="drop-item-name">${d.itemName}</span>${d.notes?`<span style="font-size:10px;color:var(--text-dim);">— ${d.notes}</span>`:''}</div>`).join('')}
      </div>
    </div>`;
  }
  html += `</div></div>`;
  return html;
}

function sectionCube(cubeItems, legendaryBuilds) {
  const total = cubeItems.length + legendaryBuilds.length;
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">🟫</div>
      <div class="guide-section-title">Horadric Cube Crafting</div>
      <div class="guide-section-count">${total} recipe${total !== 1 ? 's' : ''}</div>
    </div>
    <div class="guide-section-body">`;
  if (legendaryBuilds.length) {
    html += `<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">⚗️ Gear Modification — build your Legendary pieces:</div>`;
    legendaryBuilds.forEach(lb => {
      const { item, slotLabel } = lb;
      html += `<div class="cube-card" style="border-left-color:var(--gold);">
        <div class="cube-card-header">
          <span class="cube-recipe-name">${item.name || slotLabel+' piece'}</span>
          <span style="color:var(--text-dim)">[${slotLabel}]</span>
        </div>
        <div class="cube-recipe-detail"><strong style="color:var(--text-label)">Affixes to roll:</strong> ${item.affixes.map(a=>`<span class="affix-tag">${a}</span>`).join(' ')}</div>
        <div class="cube-tip" style="color:var(--blue-bright);">🔵 Add Affix (from scratch) or Focus Reroll (replace bad stats). Use Tuning Prisms to target the correct affix category.</div>
      </div>`;
    });
  }
  html += `</div></div>`;
  return html;
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
        ⚠️ Since <strong style="color:var(--gold-light)">Lord of Hatred</strong>, aspects are <strong>drop-driven</strong> — no dungeon guarantees.
        Salvage Legendaries at the Blacksmith to unlock in your Codex, then imprint at the <strong>Occultist</strong>.
      </div>`;
  uniq.forEach(a => {
    const db = a.dbAspect;
    html += `<div class="aspect-card">
      <div class="aspect-name">📜 ${a.aspectName}</div>
      <div class="aspect-slot">Slot: ${a.slotLabel}${db && db.slots ? ' | Valid on: ' + db.slots.join(', ') : ''}</div>
      ${db ? `<div class="aspect-effect">"${db.effect}"</div>` : ''}
      <div class="aspect-source"><strong>Source:</strong> ${db ? db.source : 'Salvage Legendary drops — check Codex of Power'}</div>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function sectionLegendarySteps(legendaryBuilds) {
  let html = `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">🔨</div>
      <div class="guide-section-title">Gear Building Steps</div>
      <div class="guide-section-count">${legendaryBuilds.length} piece${legendaryBuilds.length !== 1 ? 's' : ''}</div>
    </div>
    <div class="guide-section-body">`;
  legendaryBuilds.forEach(lb => {
    const { item, slotLabel } = lb;
    html += `<div class="gear-build-card">
      <div class="gear-build-header">
        <span class="gear-build-slot">${slotLabel}</span>
        <span class="gear-build-name">${item.name || '(Legendary ' + slotLabel + ')'}</span>
        <span class="slot-type-badge badge-legendary">Legendary</span>
      </div>
      <div class="gear-build-steps">`;
    D4DB.legendaryWorkflow.forEach(step => {
      let extra = '';
      if (step.step === 2 && item.affixes?.length)
        extra = `<div class="step-affix-list">${item.affixes.map(a=>`<span class="affix-tag">${a}</span>`).join('')}</div>`;
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
  html += `</div></div>`;
  return html;
}

function sectionCubeRef() {
  const all = [...D4DB.cubeRecipes.gearModification, ...D4DB.cubeRecipes.itemTransmutation];
  return `<div class="guide-section">
    <div class="guide-section-header">
      <div class="guide-section-icon">📚</div>
      <div class="guide-section-title">Horadric Cube Quick Reference</div>
    </div>
    <div class="guide-section-body">
      <div class="reference-grid">
        ${all.map(r => `<div class="ref-card">
          <div class="ref-card-title"><span>${r.icon}</span><span style="color:var(--text-label)">${r.name}</span></div>
          <div class="ref-card-desc">${r.description}</div>
          <div class="ref-card-mat">📦 Materials: ${r.materials}</div>
          <div class="ref-card-tip">💡 ${r.tip}</div>
        </div>`).join('')}
      </div>
      <div style="margin-top:16px;">
        <div class="section-title" style="margin-bottom:10px;">🎨 Tuning Prisms</div>
        <div class="reference-grid">
          ${D4DB.tuningPrisms.map(p => `<div class="ref-card">
            <div class="ref-card-title">${p.icon} ${p.name}</div>
            <div class="ref-card-desc">Controls: <strong style="color:var(--text-label)">${p.controls}</strong></div>
            <div class="ref-card-mat">Examples: ${p.examples}</div>
          </div>`).join('')}
        </div>
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
  renderGearSlots(); renderGuide();
  showToast('🗑️ Build cleared.');
}
function copyGuide() {
  const filled = Object.values(STATE.gear).filter(Boolean);
  if (!filled.length) { showToast('Nothing to copy yet!'); return; }
  let text = `=== NEPHALEM'S CODEX ===\n${STATE.buildName||'Build'} — ${STATE.buildClass||'Unknown Class'} | Season 14\n\n`;
  filled.forEach(item => {
    const slot = D4DB.gearSlots.find(s => s.id === item.slotId);
    text += `[${slot ? slot.label.toUpperCase() : item.slotId.toUpperCase()}] ${item.name} (${item.type})\n`;
    const db = item.dbEntry || lookupUniqueByName(item.name);
    if (db) db.sources.forEach(s => { text += `  Source: ${s.label} — ${s.detail}\n`; });
    if (item.aspect)          text += `  Aspect: ${item.aspect}\n`;
    if (item.affixes?.length) text += `  Affixes: ${item.affixes.join(', ')}\n`;
    if (item.tempers?.length) text += `  Tempers: ${item.tempers.join(', ')}\n`;
    if (item.mwPriority)      text += `  MW Priority: ${item.mwPriority}\n`;
    if (item.notes)           text += `  Note: ${item.notes}\n`;
    text += '\n';
  });
  navigator.clipboard.writeText(text).then(() => showToast('📋 Guide copied to clipboard!'));
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
