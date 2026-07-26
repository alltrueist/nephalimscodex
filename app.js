// ============================================================
// NEPHALEM'S CODEX — Application Logic
// GitHub: https://github.com/alltrueist/nephalimscodex
// Live:   https://alltrueist.github.io/nephalimscodex
// ============================================================

const STATE = {
  buildName: '',
  buildClass: '',
  gear: {},
  activeSlot: null
};

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderClassOptions();
  renderGearSlots();
  buildAutocomplete();
  renderGuide();
  attachSetupListeners();
});

// ── STORAGE ───────────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('d4_build', JSON.stringify({
    buildName:  STATE.buildName,
    buildClass: STATE.buildClass,
    gear:       STATE.gear
  }));
}

function loadFromStorage() {
  const saved = localStorage.getItem('d4_build');
  if (saved) {
    const parsed = JSON.parse(saved);
    STATE.buildName  = parsed.buildName  || '';
    STATE.buildClass = parsed.buildClass || '';
    STATE.gear       = parsed.gear       || {};
    document.getElementById('build-name').value  = STATE.buildName;
    document.getElementById('build-class').value = STATE.buildClass;
  }
}

// ── SETUP LISTENERS ───────────────────────────────────────────
function attachSetupListeners() {
  document.getElementById('build-name').addEventListener('input', e => {
    STATE.buildName = e.target.value;
    saveToStorage();
    renderGuide();
  });
  document.getElementById('build-class').addEventListener('change', e => {
    STATE.buildClass = e.target.value;
    saveToStorage();
    renderGuide();
  });
  document.getElementById('btn-clear-build').addEventListener('click',  clearBuild);
  document.getElementById('btn-copy-guide').addEventListener('click',   copyGuideToClipboard);
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

    let badgeClass = 'badge-empty', badgeText = 'Empty';
    if (item) {
      if (item.type === 'unique')    { badgeClass = 'badge-unique';    badgeText = 'Unique'; }
      if (item.type === 'legendary') { badgeClass = 'badge-legendary'; badgeText = 'Legendary'; }
      if (item.type === 'mythic')    { badgeClass = 'badge-mythic';    badgeText = 'Mythic'; }
    }

    card.innerHTML = `
      <div class="slot-icon">${slot.icon}</div>
      <div class="slot-info">
        <div class="slot-label">${slot.label}</div>
        <div class="slot-item-name ${item ? '' : 'empty'}">
          ${item ? (item.name || '(Unnamed item)') : 'Click to add item'}
        </div>
      </div>
      <div class="slot-type-badge ${badgeClass}">${badgeText}</div>
      <div class="slot-edit-btn">${item ? '✏️' : '+'}</div>
    `;
    grid.appendChild(card);
  });
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
  updateDbMatchBanner(item.name || '');

  document.getElementById('edit-panel').classList.add('open');
  document.getElementById('edit-item-name').focus();
}

function closeEditPanel() {
  document.getElementById('edit-panel').classList.remove('open');
  STATE.activeSlot = null;
}

function selectItemType(type) {
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active-legendary', 'active-unique', 'active-mythic');
    if (tab.dataset.type === type) tab.classList.add(`active-${type}`);
  });
  const legFields = document.getElementById('legendary-fields');
  if (type === 'unique' || type === 'mythic') {
    legFields.style.opacity = '0.5';
    legFields.style.pointerEvents = 'none';
  } else {
    legFields.style.opacity = '1';
    legFields.style.pointerEvents = 'auto';
  }
}

function getSelectedItemType() {
  const active = document.querySelector('.type-tab.active-legendary, .type-tab.active-unique, .type-tab.active-mythic');
  return active ? active.dataset.type : 'legendary';
}

function saveItem() {
  const slotId = STATE.activeSlot;
  if (!slotId) return;

  const name       = document.getElementById('edit-item-name').value.trim();
  if (!name) { showToast('Please enter an item name.'); return; }

  const type       = getSelectedItemType();
  const aspect     = document.getElementById('edit-aspect').value.trim();
  const affixesRaw = document.getElementById('edit-affixes').value.trim();
  const tempersRaw = document.getElementById('edit-tempers').value.trim();
  const mwPriority = document.getElementById('edit-mw-priority').value.trim();
  const notes      = document.getElementById('edit-notes').value.trim();

  const affixes = affixesRaw ? affixesRaw.split(',').map(a => a.trim()).filter(Boolean) : [];
  const tempers = tempersRaw ? tempersRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const dbEntry = lookupUniqueByName(name);

  STATE.gear[slotId] = { name, type, aspect, affixes, tempers, mwPriority, notes, slotId, dbEntry: dbEntry || null };

  saveToStorage();
  renderGearSlots();
  renderGuide();
  closeEditPanel();
  showToast(`✅ ${name} saved!`);
}

function deleteItem() {
  const slotId = STATE.activeSlot;
  if (!slotId || !STATE.gear[slotId]) { closeEditPanel(); return; }
  const name = STATE.gear[slotId].name;
  delete STATE.gear[slotId];
  saveToStorage();
  renderGearSlots();
  renderGuide();
  closeEditPanel();
  showToast(`🗑️ ${name} removed.`);
}

// ── AUTOCOMPLETE ──────────────────────────────────────────────
function buildAutocomplete() {
  const list = document.getElementById('item-names-list');
  const names = new Set();
  D4DB.uniques.forEach(u => names.add(u.name));
  D4DB.aspects.forEach(a => names.add(a.name));
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    list.appendChild(opt);
  });
}

function onItemNameInput(e) {
  updateDbMatchBanner(e.target.value.trim());
}

function updateDbMatchBanner(name) {
  const banner = document.getElementById('db-match-banner');
  if (!name) { banner.classList.remove('visible'); return; }
  const match = lookupUniqueByName(name);
  if (match) {
    banner.textContent = `✨ Found in database! Acquisition info will auto-populate in the guide.`;
    banner.classList.add('visible');
    selectItemType(match.id.includes('mythic') ? 'mythic' : (match.sources.some(s => s.type !== 'cube' && s.type !== 'pool') ? 'unique' : 'unique'));
  } else {
    banner.textContent = `📝 Not in database — enter details manually below.`;
    banner.classList.add('visible');
  }
}

function lookupUniqueByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return D4DB.uniques.find(u => u.name.toLowerCase() === lower) || null;
}

function lookupAspectByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return D4DB.aspects.find(a => a.name.toLowerCase() === lower) || null;
}

function lookupBossById(id) {
  return D4DB.bosses.find(b => b.id === id) || null;
}

// ── GUIDE RENDERING ───────────────────────────────────────────
function renderGuide() {
  const container  = document.getElementById('guide-output');
  const buildLabel = document.getElementById('build-name-display');

  buildLabel.textContent =
    (STATE.buildName || 'Untitled Build') +
    (STATE.buildClass ? ` — ${STATE.buildClass}` : '');

  const filledItems = Object.values(STATE.gear).filter(Boolean);
  if (filledItems.length === 0) { container.innerHTML = getEmptyStateHTML(); return; }

  const bossDrops = {};
  const poolDrops = [];
  const cubeItems = [];
  const aspects   = [];
  const legendaryBuilds = [];

  filledItems.forEach(item => {
    const slotDef   = D4DB.gearSlots.find(s => s.id === item.slotId);
    const slotLabel = slotDef ? slotDef.label : item.slotId;

    if (item.type === 'unique' || item.type === 'mythic') {
      const db = item.dbEntry || lookupUniqueByName(item.name);
      if (db) {
        db.sources.forEach(src => {
          if (src.type === 'boss') {
            if (!bossDrops[src.boss]) bossDrops[src.boss] = [];
            bossDrops[src.boss].push({ slotLabel, itemName: item.name, note: src.detail });
          } else if (src.type === 'pool') {
            poolDrops.push({ slotLabel, itemName: item.name, notes: db.notes });
          } else if (src.type === 'cube') {
            cubeItems.push({ slotLabel, itemName: item.name, recipe: src.detail, cubeNote: db.notes, isCubeTransmute: true });
          }
        });
      } else {
        poolDrops.push({ slotLabel, itemName: item.name, notes: 'Not in database — verify boss source on Maxroll.gg' });
      }
    }

    if (item.type === 'legendary') {
      if (item.aspect) {
        const dbAspect = lookupAspectByName(item.aspect);
        aspects.push({ aspectName: item.aspect, slotLabel, dbAspect });
      }
      if (item.affixes && item.affixes.length > 0) {
        legendaryBuilds.push({ item, slotLabel });
      }
    }
  });

  let html = '<div class="guide-sections">';
  if (Object.keys(bossDrops).length > 0 || poolDrops.length > 0) html += renderBossSection(bossDrops, poolDrops);
  if (cubeItems.length > 0 || legendaryBuilds.length > 0)        html += renderCubeSection(cubeItems, legendaryBuilds);
  if (aspects.length > 0)                                         html += renderAspectsSection(aspects);
  if (legendaryBuilds.length > 0)                                 html += renderLegendaryBuildSection(legendaryBuilds);
  html += renderCubeReference();
  html += '</div>';
  container.innerHTML = html;
}

function getEmptyStateHTML() {
  return `
    <div class="guide-empty">
      <div class="guide-empty-icon">📜</div>
      <h2>Your Acquisition Guide Awaits</h2>
      <p>Add gear items to your build using the slots on the left. The guide will automatically fill in
      <strong>boss farm targets, Horadric Cube recipes, aspect sources,</strong> and a
      <strong>step-by-step crafting plan</strong> for each piece.</p>
      <br>
      <p style="color:var(--text-dim);font-size:11px;">💡 Unique items auto-fill from the database.
      For Legendaries, enter the aspect, affixes, tempers, and masterwork priority from your build guide.</p>
    </div>
  `;
}

function renderBossSection(bossDrops, poolDrops) {
  const total = Object.keys(bossDrops).length + (poolDrops.length > 0 ? 1 : 0);
  let html = `
    <div class="guide-section">
      <div class="guide-section-header">
        <div class="guide-section-icon">💀</div>
        <div class="guide-section-title">Boss Farm Targets</div>
        <div class="guide-section-count">${total} boss${total !== 1 ? 'es' : ''}</div>
      </div>
      <div class="guide-section-body">
  `;
  Object.entries(bossDrops).forEach(([bossId, drops]) => {
    const boss = lookupBossById(bossId);
    if (!boss) return;
    html += `
      <div class="boss-card">
        <div class="boss-card-header">
          <div class="boss-name">💀 ${boss.name}</div>
          <div class="boss-tier-badge tier-${boss.tier.toLowerCase()}">${boss.tier}</div>
        </div>
        <div class="boss-key-info">
          <strong>Key Material:</strong> ${boss.keyMaterial} &nbsp;|&nbsp; <strong>Source:</strong> ${boss.keySource}
        </div>
        <div>
          <div class="boss-drops-label">Targeted drops from this boss:</div>
          ${drops.map(d => `
            <div class="drop-item">
              <span class="drop-slot-tag">${d.slotLabel}</span>
              <span class="drop-item-name">${d.itemName}</span>
            </div>
          `).join('')}
          ${boss.notes ? `<div style="font-size:10px;color:var(--text-dim);margin-top:6px;">💡 ${boss.notes}</div>` : ''}
        </div>
      </div>
    `;
  });
  if (poolDrops.length > 0) {
    html += `
      <div class="boss-card">
        <div class="boss-card-header">
          <div class="boss-name">🎲 General Unique Pool</div>
          <div class="boss-tier-badge tier-initiate">Any Boss</div>
        </div>
        <div class="boss-key-info">
          These items have <strong>no dedicated boss</strong>. Best method: <strong>Horadric Cube 3-to-1 Transmutation</strong>.
          Any Lair Boss can also drop them at a low rate.
        </div>
        <div>
          <div class="boss-drops-label">Use Horadric Cube 3-to-1 for these items:</div>
          ${poolDrops.map(d => `
            <div class="drop-item">
              <span class="drop-slot-tag">${d.slotLabel}</span>
              <span class="drop-item-name">${d.itemName}</span>
              ${d.notes ? `<span style="font-size:10px;color:var(--text-dim);">— ${d.notes}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  html += `</div></div>`;
  return html;
}

function renderCubeSection(cubeItems, legendaryBuilds) {
  const total = cubeItems.length + legendaryBuilds.length;
  let html = `
    <div class="guide-section">
      <div class="guide-section-header">
        <div class="guide-section-icon">🟫</div>
        <div class="guide-section-title">Horadric Cube Crafting</div>
        <div class="guide-section-count">${total} recipe${total !== 1 ? 's' : ''}</div>
      </div>
      <div class="guide-section-body">
  `;
  if (cubeItems.length > 0) {
    html += `<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📦 Item Transmutation — Use 3-to-1 for items with no dedicated boss:</div>`;
    cubeItems.forEach(ci => {
      html += `
        <div class="cube-card">
          <div class="cube-card-header">
            <span>3️⃣→1️⃣</span>
            <span class="cube-recipe-name">3-to-1 Transmutation</span>
            <span style="color:var(--text-dim)">→</span>
            <span class="cube-item-name">${ci.itemName} <span style="color:var(--text-dim)">[${ci.slotLabel}]</span></span>
          </div>
          <div class="cube-recipe-detail">${ci.recipe}</div>
          ${ci.cubeNote ? `<div class="cube-tip">💡 ${ci.cubeNote}</div>` : ''}
        </div>
      `;
    });
  }
  if (legendaryBuilds.length > 0) {
    html += `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;margin-bottom:4px;">⚗️ Gear Modification — Use these recipes to build your Legendary items:</div>`;
    legendaryBuilds.forEach(lb => {
      const { item, slotLabel } = lb;
      html += `
        <div class="cube-card" style="border-left-color:var(--gold);">
          <div class="cube-card-header">
            <span class="cube-recipe-name">${item.name || slotLabel + ' piece'}</span>
            <span style="color:var(--text-dim)">[${slotLabel}]</span>
          </div>
          <div class="cube-recipe-detail">
            <strong style="color:var(--text-label)">Affixes to roll:</strong>
            ${item.affixes.map(a => `<span class="affix-tag">${a}</span>`).join(' ')}
          </div>
          <div class="cube-tip" style="color:var(--blue-bright);">🔵 Steps: Add Affix → Focus Reroll (bad stats) → Remove Affix (if needed). Use Tuning Prisms to target correct affix category.</div>
        </div>
      `;
    });
  }
  html += `</div></div>`;
  return html;
}

function renderAspectsSection(aspects) {
  const seen = new Set();
  const unique = aspects.filter(a => { if (seen.has(a.aspectName)) return false; seen.add(a.aspectName); return true; });
  let html = `
    <div class="guide-section">
      <div class="guide-section-header">
        <div class="guide-section-icon">📖</div>
        <div class="guide-section-title">Aspects to Collect</div>
        <div class="guide-section-count">${unique.length}</div>
      </div>
      <div class="guide-section-body">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
          ⚠️ Since <strong style="color:var(--gold-light)">Lord of Hatred</strong>, aspects are <strong>drop-driven</strong> — no dungeon guarantees them.
          Salvage Legendary items at the Blacksmith to unlock them in your Codex of Power. Then imprint at the <strong>Occultist</strong>.
        </div>
  `;
  unique.forEach(a => {
    const db = a.dbAspect || lookupAspectByName(a.aspectName);
    html += `
      <div class="aspect-card">
        <div class="aspect-name">📜 ${a.aspectName}</div>
        <div class="aspect-slot">Slot: ${a.slotLabel}${db ? ' | Valid on: ' + db.slots.join(', ') : ''}</div>
        ${db ? `<div class="aspect-effect">"${db.effect}"</div>` : ''}
        <div class="aspect-source"><strong>Source:</strong> ${db ? db.source : 'Salvage Legendary drops / check Codex of Power'}</div>
      </div>
    `;
  });
  html += `</div></div>`;
  return html;
}

function renderLegendaryBuildSection(legendaryBuilds) {
  let html = `
    <div class="guide-section">
      <div class="guide-section-header">
        <div class="guide-section-icon">🔨</div>
        <div class="guide-section-title">Gear Building Steps</div>
        <div class="guide-section-count">${legendaryBuilds.length} piece${legendaryBuilds.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="guide-section-body">
  `;
  legendaryBuilds.forEach(lb => {
    const { item, slotLabel } = lb;
    html += `
      <div class="gear-build-card">
        <div class="gear-build-header">
          <span class="gear-build-slot">${slotLabel}</span>
          <span class="gear-build-name">${item.name || '(Legendary ' + slotLabel + ')'}</span>
          <span class="slot-type-badge badge-legendary">Legendary</span>
        </div>
        <div class="gear-build-steps">
    `;
    D4DB.legendaryWorkflow.forEach(step => {
      let extra = '';
      if (step.step === 2 && item.affixes?.length)
        extra = `<div class="step-affix-list">${item.affixes.map(a => `<span class="affix-tag">${a}</span>`).join('')}</div>`;
      if (step.step === 3 && item.aspect)
        extra = `<div style="margin-top:4px;"><span class="affix-tag" style="background:rgba(200,147,42,0.2);color:var(--gold-light);">📜 ${item.aspect}</span></div>`;
      if (step.step === 4 && item.tempers?.length)
        extra = `<div class="step-affix-list">${item.tempers.map(t => `<span class="temper-tag">🔵 ${t}</span>`).join('')}</div>`;
      if (step.step === 5 && item.mwPriority)
        extra = `<div style="margin-top:4px;"><span class="mw-tag">⭐ ${item.mwPriority}</span></div>`;
      html += `
        <div class="gear-build-step">
          <div class="step-number">${step.step}</div>
          <div>
            <div class="step-text">${step.icon} <strong>${step.name}</strong></div>
            <div class="step-detail">${step.detail}</div>
            ${extra}
          </div>
        </div>
      `;
    });
    if (item.notes) {
      html += `<div style="margin-top:8px;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:4px;font-size:11px;color:var(--text-muted);border-left:2px solid var(--border-bright);">📝 Note: ${item.notes}</div>`;
    }
    html += `</div></div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderCubeReference() {
  const all = [...D4DB.cubeRecipes.gearModification, ...D4DB.cubeRecipes.itemTransmutation];
  let html = `
    <div class="guide-section">
      <div class="guide-section-header">
        <div class="guide-section-icon">📚</div>
        <div class="guide-section-title">Horadric Cube Quick Reference</div>
      </div>
      <div class="guide-section-body">
        <div class="reference-grid">
          ${all.map(r => `
            <div class="ref-card">
              <div class="ref-card-title"><span>${r.icon}</span><span style="color:var(--text-label)">${r.name}</span></div>
              <div class="ref-card-desc">${r.description}</div>
              <div class="ref-card-mat">📦 Materials: ${r.materials}</div>
              <div class="ref-card-tip">💡 ${r.tip}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;">
          <div class="section-title" style="margin-bottom:10px;">🎨 Tuning Prisms Guide</div>
          <div class="reference-grid">
            ${D4DB.tuningPrisms.map(p => `
              <div class="ref-card">
                <div class="ref-card-title">${p.icon} ${p.name}</div>
                <div class="ref-card-desc">Controls: <strong style="color:var(--text-label)">${p.controls}</strong></div>
                <div class="ref-card-mat">Examples: ${p.examples}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  return html;
}

// ── ACTIONS ───────────────────────────────────────────────────
function clearBuild() {
  if (!confirm('Clear this entire build? This cannot be undone.')) return;
  STATE.buildName = ''; STATE.buildClass = ''; STATE.gear = {};
  document.getElementById('build-name').value  = '';
  document.getElementById('build-class').value = '';
  localStorage.removeItem('d4_build');
  renderGearSlots();
  renderGuide();
  showToast('🗑️ Build cleared.');
}

function copyGuideToClipboard() {
  const filledItems = Object.values(STATE.gear).filter(Boolean);
  if (filledItems.length === 0) { showToast('Nothing to copy yet!'); return; }
  let text = `=== NEPHALEM'S CODEX ===\n${STATE.buildName || 'Build'} — ${STATE.buildClass || 'Unknown Class'} | Season 14\n\n`;
  filledItems.forEach(item => {
    const slot = D4DB.gearSlots.find(s => s.id === item.slotId);
    text += `[${slot ? slot.label.toUpperCase() : item.slotId.toUpperCase()}] ${item.name} (${item.type})\n`;
    const db = item.dbEntry || lookupUniqueByName(item.name);
    if (db) { db.sources.forEach(s => { text += `  Source: ${s.label} — ${s.detail}\n`; }); }
    if (item.aspect)        text += `  Aspect: ${item.aspect}\n`;
    if (item.affixes?.length) text += `  Affixes: ${item.affixes.join(', ')}\n`;
    if (item.tempers?.length) text += `  Tempers: ${item.tempers.join(', ')}\n`;
    if (item.mwPriority)    text += `  MW Priority: ${item.mwPriority}\n`;
    if (item.notes)         text += `  Note: ${item.notes}\n`;
    text += '\n';
  });
  navigator.clipboard.writeText(text).then(() => showToast('📋 Guide copied to clipboard!'));
}

// ── UTILITIES ─────────────────────────────────────────────────
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}
