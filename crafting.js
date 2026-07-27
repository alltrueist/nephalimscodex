// ============================================================
// NEPHALEM'S CODEX — Crafting Simulator Logic
// ============================================================
// KEY MECHANIC:
//   Focus Reroll with a Tuning Prism RANDOMLY picks WHICH affix
//   of that prism's category gets changed. You do NOT choose.
//   Only ONE affix can be locked at a time (via the Enchanter).
//   Class is auto-synced from the Build & Gear tab — no separate selector.
//
// RING BUG FIX: ring1/ring2 slot IDs are normalized to "ring"
//   before checking a.slots.includes() in the crafting DB.
// ============================================================

const CraftSim = {
  slot:     null,
  cls:      null,   // synced from STATE.buildClass — never set independently
  picks:    [],
  plan:     null,

  // ── SLOT NORMALIZATION (fixes ring1/ring2 bug) ────────────
  // crafting-db.js uses "ring", app uses "ring1"/"ring2"
  // This maps any app slot ID to the crafting DB's slot vocabulary
  getEffectiveSlot() {
    if (!this.slot) return null;
    // Use D4DB.slotCategoryMap for ring1→ring, ring2→ring etc.
    return D4DB.slotCategoryMap[this.slot] || this.slot;
  },

  // ── INIT ──────────────────────────────────────────────────
  init() {
    this.slot  = null;
    this.cls   = STATE.buildClass || null;
    this.picks = [];
    this.plan  = null;
    this.renderSlotSelector();
    this.showClassStatus();
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
    this.attachListeners();
  },

  attachListeners() {
    const slotSel  = document.getElementById('cs-slot');
    const clearBtn = document.getElementById('cs-clear');
    if (slotSel) slotSel.addEventListener('change', () => {
      this.slot  = slotSel.value || null;
      this.picks = [];
      this.renderAfixPicker();
      this.renderSelected();
      this.renderPlan();
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      this.picks = []; this.plan = null;
      this.renderSelected();
      this.renderAfixPicker();
      this.renderPlan();
    });
  },

  // ── CLASS STATUS (replaces the class selector) ────────────
  showClassStatus() {
    const el = document.getElementById('cs-class-status');
    if (!el) return;
    this.cls = STATE.buildClass || null;
    if (this.cls) {
      el.innerHTML = `<span class="cs-class-active">⚔️ ${this.cls}</span> — items and affixes filtered to your class.`;
      el.className = 'cs-class-status has-class';
    } else {
      el.innerHTML = `⚠️ No class selected. <strong>Select your class in the Gear tab</strong> to filter affixes correctly.`;
      el.className = 'cs-class-status no-class';
    }
  },

  // ── SLOT SELECTOR ─────────────────────────────────────────
  renderSlotSelector() {
    const sel = document.getElementById('cs-slot');
    if (!sel) return;
    const current = this.slot;
    const slots   = getGearSlots();
    sel.innerHTML = '<option value="">Choose a slot...</option>';
    slots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.icon} ${s.label}`;
      if (s.id === current) opt.selected = true;
      sel.appendChild(opt);
    });
  },

  // ── AFFIX FILTERING (uses normalized slot) ────────────────
  getAvailableAffixes() {
    if (!this.slot) return [];
    const effectiveSlot = this.getEffectiveSlot(); // ← THE FIX
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.slots.includes(effectiveSlot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  getPoolForPrism(prismId) {
    if (!this.slot) return [];
    const effectiveSlot = this.getEffectiveSlot(); // ← FIX here too
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.prisms.includes(prismId)) return false;
      if (!a.slots.includes(effectiveSlot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  // ── AFFIX PICKER ──────────────────────────────────────────
  renderAfixPicker() {
    const container = document.getElementById('cs-affix-picker');
    if (!container) return;

    if (!this.slot) {
      container.innerHTML = `<div class="cs-placeholder">Select a slot above to see available affixes.</div>`;
      return;
    }
    if (!this.cls) {
      container.innerHTML = `<div class="cs-placeholder">Select your class in the Gear tab to see class-filtered affixes.</div>`;
      return;
    }

    const available = this.getAvailableAffixes();
    if (!available.length) {
      container.innerHTML = `<div class="cs-placeholder">No affixes found for this slot and class.</div>`;
      return;
    }

    // Group by first (primary) prism
    const groups = {};
    available.forEach(a => {
      const key = a.prisms[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    const prismOrder = ['aggressive','adept','protector','resourceful','pragmatic','chromatic','none'];
    let html = '';
    prismOrder.forEach(prismId => {
      if (!groups[prismId] || !groups[prismId].length) return;
      const prism = CRAFTING_DB.prisms[prismId];
      const pickedFromGroup = groups[prismId].filter(a => this.picks.includes(a.id)).length;
      const conflictWarn = pickedFromGroup >= 2
        ? `<span class="cs-group-warning">⚠️ ${pickedFromGroup} conflicts!</span>` : '';
      html += `<div class="cs-prism-group">
        <div class="cs-prism-header" style="background:${prism.bg};border-color:${prism.border};">
          <span class="cs-prism-icon">${prism.icon}</span>
          <span class="cs-prism-name">${prism.name}</span>
          <span class="cs-prism-category">${prism.category}</span>
          ${conflictWarn}
        </div>
        <div class="cs-affix-pills">`;
      groups[prismId].forEach(a => {
        const isPicked   = this.picks.includes(a.id);
        const isFull     = this.picks.length >= 4 && !isPicked;
        const isFlexible = a.prisms.length > 1;
        html += `<button
          class="cs-affix-pill${isPicked?' cs-pill-picked':''}${isFull?' cs-pill-disabled':''}${isFlexible?' cs-pill-flexible':''}"
          onclick="CraftSim.toggleAffix('${a.id}')"
          title="${a.note||a.name}${isFlexible ? (' ★ Also from: '+a.prisms.slice(1).map(p=>CRAFTING_DB.prisms[p].short).join('/')) : ''}"
          ${isFull&&!isPicked?'disabled':''}>
          ${isPicked?'✅ ':''}${a.name}${isFlexible?' <span class="cs-flex-star">★</span>':''}
        </button>`;
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
  },

  // ── PICKS ─────────────────────────────────────────────────
  toggleAffix(affixId) {
    const idx = this.picks.indexOf(affixId);
    if (idx >= 0) {
      this.picks.splice(idx, 1);
    } else if (this.picks.length < 4) {
      this.picks.push(affixId);
    } else {
      showToast('⚠️ Already 4 affixes selected. Remove one first.');
      return;
    }
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },

  renderSelected() {
    const bar   = document.getElementById('cs-selected-bar');
    const label = document.querySelector('.selected-label');
    if (label) label.textContent = `Selected Affixes (${this.picks.length}/4)`;
    if (!bar) return;
    if (!this.picks.length) {
      bar.innerHTML = `<span class="cs-selected-empty">Click affixes below to add them (max 4)</span>`;
      return;
    }
    bar.innerHTML = this.picks.map(id => {
      const a = CRAFTING_DB.affixes.find(x => x.id === id);
      if (!a) return '';
      const prism = CRAFTING_DB.prisms[a.prisms[0]];
      return `<span class="cs-selected-pill" style="border-color:${prism.color};color:${prism.color};"
        onclick="CraftSim.toggleAffix('${a.id}')" title="Click to remove">
        ${prism.icon} ${a.name} <span class="cs-remove-x">×</span>
      </span>`;
    }).join('');
  },

  // ── PLAN ENGINE ───────────────────────────────────────────
  // Correctly models: Focus Reroll randomly picks which affix of that
  // prism category gets changed. Only ONE lock available at a time.
  generatePlan() {
    if (!this.picks.length) return null;

    const desired = this.picks.map(id => {
      const a = CRAFTING_DB.affixes.find(x => x.id === id);
      return a ? { ...a } : null;
    }).filter(Boolean);

    // Assign prisms optimally (minimize max per prism)
    const forced   = desired.filter(a => a.prisms.filter(p=>p!=='none').length <= 1);
    const flexible = desired.filter(a => a.prisms.filter(p=>p!=='none').length >  1);
    const prismCounts = {};
    forced.forEach(a => {
      const p = a.prisms.find(x => x !== 'none') || 'none';
      a.assigned = p;
      prismCounts[p] = (prismCounts[p] || 0) + 1;
    });
    flexible.forEach(a => {
      const options = a.prisms.filter(p => p !== 'none');
      const best    = options.reduce((b,p) => (prismCounts[p]||0) < (prismCounts[b]||0) ? p : b, options[0]);
      a.assigned    = best;
      prismCounts[best] = (prismCounts[best] || 0) + 1;
    });

    const groups = {};
    desired.forEach(a => {
      if (!groups[a.assigned]) groups[a.assigned] = [];
      groups[a.assigned].push(a);
    });

    const maxConflict = Math.max(
      ...Object.values(groups).filter(g=>g[0].assigned!=='none').map(g=>g.length), 1
    );
    const noneGroup = groups['none'] || [];

    let diffLabel, diffColor;
    if (maxConflict === 1) { diffLabel='✅ Easy — no prism conflicts'; diffColor='var(--green-bright)'; }
    else if (maxConflict === 2) { diffLabel='⚠️ Moderate — 2 stats share a prism, 1 lock needed'; diffColor='var(--gold)'; }
    else if (maxConflict === 3) { diffLabel='💀 Hard — 3 stats share a prism; ~50% chance per roll hits target'; diffColor='var(--orange-bright)'; }
    else { diffLabel='☠️ Extreme — 4 stats share a prism; largely luck-based'; diffColor='var(--red-bright)'; }

    const craftableGroups = Object.entries(groups)
      .filter(([p]) => p !== 'none')
      .sort(([,a],[,b]) => b.length - a.length);

    const steps = [];

    craftableGroups.forEach(([prismId, group]) => {
      const prism    = CRAFTING_DB.prisms[prismId];
      const poolSize = this.getPoolForPrism(prismId).length;
      const count    = group.length;

      if (count === 1) {
        const a = group[0];
        steps.push({ type:'roll', prismId, prism, seeking:[a.name],
          difficulty:'easy', poolSize, conflict:1, note:a.note||null,
          flexible:a.prisms.length>1,
          altPrisms:a.prisms.filter(p=>p!=='none'&&p!==a.assigned).map(p=>CRAFTING_DB.prisms[p].short),
          pool:this.getPoolForPrism(prismId).map(x=>x.name) });
      } else if (count === 2) {
        steps.push({ type:'roll', prismId, prism,
          seeking:[group[0].name, group[1].name],
          seekingHint:'Roll until you get either one of these two.',
          difficulty:'easy', poolSize, conflict:2, pool:this.getPoolForPrism(prismId).map(x=>x.name) });
        steps.push({ type:'lock',
          lockWhat:`Whichever of "${group[0].name}" or "${group[1].name}" you just rolled`,
          lockWhy:`You have 1 of 2 needed ${prism.short} stats. Lock it so the next Focus Reroll cannot accidentally overwrite it.` });
        steps.push({ type:'roll', prismId, prism,
          seeking:[`the other ${prism.short} stat`],
          seekingHint:`Roll until you get the one you didn't get the first time. Your locked stat is protected.`,
          difficulty:'moderate', poolSize, conflict:2, isSecond:true,
          pool:this.getPoolForPrism(prismId).map(x=>x.name) });
      } else {
        // 3 or 4 conflict — explain honestly, no fake multiple locks
        steps.push({ type:'roll', prismId, prism,
          seeking:group.map(a=>a.name),
          seekingHint:count===3
            ?'Roll until you land any one target → lock it → continue. ~50% chance each roll hits a remaining target.'
            :'All 4 stats share a prism. Lock 1 at a time — each roll has a random chance of hitting any unlocked slot.',
          difficulty:count===3?'hard':'extreme', poolSize, conflict:count,
          pool:this.getPoolForPrism(prismId).map(x=>x.name) });
        steps.push({ type:'conflict-warning', count, prism, targets:group.map(a=>a.name) });
      }
    });

    if (noneGroup.length) steps.push({ type:'untargetable', affixes:noneGroup.map(a=>a.name) });
    steps.push({ type:'done', picks:desired.map(a=>a.name) });

    return { desired, groups, maxConflict, diffLabel, diffColor, steps,
             hasConflict:maxConflict>=2, hasUntargetable:noneGroup.length>0 };
  },

  // ── PLAN RENDERER ─────────────────────────────────────────
  renderPlan() {
    const container = document.getElementById('cs-plan-output');
    if (!container) return;
    if (!this.picks.length) {
      container.innerHTML = `<div class="cs-plan-empty">
        <div style="font-size:36px;margin-bottom:10px;">🟫</div>
        <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Select a slot and up to 4 affixes</div>
        <div style="font-size:11px;color:var(--text-dim);max-width:280px;line-height:1.6;text-align:center;">
          Your step-by-step Horadric Cube rolling plan will appear here, including when to use the Enchanter's single stat lock.
        </div>
      </div>`;
      return;
    }
    this.plan = this.generatePlan();
    if (!this.plan) return;
    const plan = this.plan;
    let html = '';

    // Difficulty + key rule banner
    html += `<div class="cs-plan-summary">
      <div style="font-size:13px;font-weight:700;color:${plan.diffColor};margin-bottom:8px;">${plan.diffLabel}</div>
      <div class="cs-key-rule">
        🔒 <strong>Lock rule:</strong> You can lock <strong>ONE affix per item</strong> at any time (at the Enchanter/Occultist).
        Focus Reroll with a Tuning Prism <strong>randomly picks which affix of that category gets rerolled</strong> — the lock protects your chosen stat from being overwritten.
      </div>
      ${plan.hasUntargetable?`<div class="cs-key-rule" style="border-left-color:var(--red-bright);color:var(--red-bright);">❌ One or more affixes cannot be targeted by any prism — they roll randomly.</div>`:''}
    </div>`;

    html += `<div class="cs-steps">`;
    let stepNum = 0;

    plan.steps.forEach(step => {
      if (step.type === 'roll') {
        stepNum++;
        const diffColor = {easy:'var(--green-bright)',moderate:'var(--gold)',hard:'var(--orange-bright)',extreme:'var(--red-bright)'}[step.difficulty]||'var(--text-muted)';
        const diffLabel = {easy:'✅ Straightforward',moderate:'⚠️ Lock required',hard:'💀 Difficult',extreme:'☠️ Luck-based'}[step.difficulty]||'';
        const poolHtml  = step.pool.length
          ? `<details class="cs-pool-details"><summary class="cs-pool-summary">${step.prism.short} pool for this slot (${step.poolSize} affixes)</summary>
              <div class="cs-pool-list">${step.pool.map(n=>`<span class="cs-pool-item ${step.seeking.some(s=>n.includes(s)||s.includes(n))?'cs-pool-target':''}">${n}</span>`).join('')}</div>
            </details>` : '';
        const flexNote  = step.flexible&&step.altPrisms?.length
          ? `<div class="cs-flex-note">★ Flexible — also available from <strong>${step.altPrisms.join(' or ')}</strong>. Assigned here to minimize conflicts.</div>` : '';
        html += `<div class="cs-step cs-step-roll" style="border-left-color:${step.prism.color};">
          <div class="cs-step-num" style="background:${step.prism.bg};border-color:${step.prism.border};color:${step.prism.color};">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-header">
              <span class="cs-step-prism-badge" style="background:${step.prism.bg};border-color:${step.prism.border};color:${step.prism.color};">${step.prism.icon} ${step.prism.name}</span>
              <span style="font-size:10px;color:${diffColor};font-weight:600;">${diffLabel}</span>
              ${step.conflict>1?`<span style="font-size:10px;color:var(--text-dim);">(${step.conflict} stats from this prism)</span>`:''}
            </div>
            <div class="cs-step-title">Seeking: <strong>${step.seeking.join(' / ')}</strong></div>
            ${step.seekingHint?`<div class="cs-step-hint">${step.seekingHint}</div>`:''}
            ${step.note?`<div class="cs-step-desc" style="color:var(--gold);margin-top:4px;">💡 ${step.note}</div>`:''}
            ${flexNote}${poolHtml}
          </div>
        </div>`;
        return;
      }

      if (step.type === 'lock') {
        stepNum++;
        html += `<div class="cs-step cs-step-lock">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">🔒 Lock: <strong>${step.lockWhat}</strong></div>
            <div class="cs-step-desc">${step.lockWhy}<br><br>
              <strong>How:</strong> Occultist → Enchant Item → click the 🔒 icon next to the stat.<br>
              <span style="color:var(--red-bright);font-weight:600;">⚠️ This is your ONE and only lock.</span>
              Unlock it at the Occultist when you no longer need protection.
            </div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'conflict-warning') {
        const { count, prism, targets } = step;
        html += `<div class="cs-step cs-step-conflict" style="border-left-color:${count===3?'var(--orange-bright)':'var(--red-bright)'};">
          <div class="cs-step-num">${count===3?'⚠️':'☠️'}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">${count}-Prism Conflict — ${count===3?'Difficult':'Mostly Luck-Based'}</div>
            <div class="cs-step-desc">
              You need <strong>${count} stats from ${prism.name}</strong>: <strong>${targets.join(', ')}</strong>.<br><br>
              ${count===3
                ? `Strategy: Roll for any target → lock it → continue rolling for the next (${Math.round(100/(count-1))}% chance per roll hits a remaining target vs the locked one). Once 2 are placed: lock one, accept the other is exposed, roll for the 3rd. Some exposure risk is unavoidable.`
                : `With only 1 lock, 3 stats are always exposed at any time. Roll, lock the most important, and treat this item as "good enough" when you get close — Masterworking will amplify what you land on.`}
            </div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'untargetable') {
        stepNum++;
        html += `<div class="cs-step cs-step-random">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">🎰 Untargetable — Random Only</div>
            <div class="cs-step-desc"><strong style="color:var(--red-bright);">${step.affixes.join(', ')}</strong> cannot be targeted by any Tuning Prism.<br><br>
              💡 Roll all targeted affixes first (using appropriate prisms), lock them all as needed, then use <strong>Chaotic Reroll</strong> (no prism) to cycle through all affix types until this stat appears.
            </div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'done') {
        html += `<div class="cs-step cs-step-done">
          <div class="cs-step-num">✅</div>
          <div class="cs-step-body">
            <div class="cs-step-title">All affixes acquired!</div>
            <div class="cs-step-desc"><strong>${step.picks.join(', ')}</strong><br><br>
              Next steps:<ol style="margin-top:8px;padding-left:18px;font-size:11px;line-height:2.2;">
                <li>🔓 Remove all Enchanting locks (Occultist)</li>
                <li>📖 Imprint Legendary Aspect (Occultist)</li>
                <li>🔨 Apply both Temper slots (Blacksmith — limited re-rolls!)</li>
                <li>⭐ Masterwork to Rank 12 (Blacksmith)</li>
              </ol>
            </div>
          </div>
        </div>`;
        return;
      }
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  // ── PRE-FILL FROM GEAR PLANNER ────────────────────────────
  prefillFromSlot(slotId) {
    this.slot = slotId;
    this.cls  = STATE.buildClass || null;
    this.picks = [];

    // Switch to craft tab
    switchRightTab('craft');
    setMobileTab('craft');

    const slotSel = document.getElementById('cs-slot');
    if (slotSel) slotSel.value = slotId;

    this.showClassStatus();
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },
};
