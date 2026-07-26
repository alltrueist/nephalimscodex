// ============================================================
// NEPHALEM'S CODEX — Crafting Simulator Logic
// Horadric Cube step-by-step crafting planner
// ============================================================

const CraftSim = {
  // Active state
  slot:     null,   // app slot ID (e.g., "weapon", "helm")
  cls:      null,   // class name
  picks:    [],     // array of affix IDs (max 4)
  plan:     null,   // last generated plan

  // ── INIT ───────────────────────────────────────────────────
  init() {
    this.slot = null;
    this.cls  = STATE.buildClass || null;
    this.picks = [];
    this.plan  = null;
    this.renderSlotSelector();
    this.renderClassSelector();
    this.renderAfixPicker();
    this.renderPlan();
    this.attachListeners();
  },

  attachListeners() {
    const slotSel  = document.getElementById('cs-slot');
    const clsSel   = document.getElementById('cs-class');
    const clearBtn = document.getElementById('cs-clear');
    if (slotSel)  slotSel.addEventListener('change',  () => { this.slot = slotSel.value;  this.picks = []; this.renderAfixPicker(); this.renderSelected(); this.renderPlan(); });
    if (clsSel)   clsSel.addEventListener('change',   () => { this.cls  = clsSel.value;  this.picks = []; this.renderAfixPicker(); this.renderSelected(); this.renderPlan(); });
    if (clearBtn) clearBtn.addEventListener('click',  () => { this.picks = []; this.plan = null; this.renderSelected(); this.renderAfixPicker(); this.renderPlan(); });
  },

  // ── SELECTORS ──────────────────────────────────────────────
  renderSlotSelector() {
    const sel = document.getElementById('cs-slot');
    if (!sel) return;
    // Build from the app's current slot list
    const slots = getGearSlots();
    sel.innerHTML = '<option value="">Choose a slot...</option>';
    slots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.icon} ${s.label}`;
      if (s.id === this.slot) opt.selected = true;
      sel.appendChild(opt);
    });
  },

  renderClassSelector() {
    const sel = document.getElementById('cs-class');
    if (!sel) return;
    sel.innerHTML = '<option value="">All Classes</option>';
    D4DB.classes.forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = cls;
      if (cls === this.cls) opt.selected = true;
      sel.appendChild(opt);
    });
  },

  // ── AFFIX PICKER ───────────────────────────────────────────
  getAvailableAffixes() {
    if (!this.slot) return [];
    return CRAFTING_DB.affixes.filter(a => {
      // Slot check
      if (!a.slots.includes(this.slot)) return false;
      // Class check
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  renderAfixPicker() {
    const container = document.getElementById('cs-affix-picker');
    if (!container) return;

    if (!this.slot) {
      container.innerHTML = `<div class="cs-placeholder">Select a slot above to see available affixes.</div>`;
      return;
    }

    const available = this.getAvailableAffixes();
    if (!available.length) {
      container.innerHTML = `<div class="cs-placeholder">No affixes found for this slot${this.cls ? ' and class' : ''}.</div>`;
      return;
    }

    // Group by first (primary) prism
    const groups = {};
    available.forEach(a => {
      const primaryPrism = a.prisms[0];
      if (!groups[primaryPrism]) groups[primaryPrism] = [];
      groups[primaryPrism].push(a);
    });

    // Order: aggressive, adept, protector, resourceful, pragmatic, chromatic, none
    const prismOrder = ['aggressive','adept','protector','resourceful','pragmatic','chromatic','none'];

    let html = '';
    prismOrder.forEach(prismId => {
      if (!groups[prismId] || !groups[prismId].length) return;
      const prism = CRAFTING_DB.prisms[prismId];
      html += `<div class="cs-prism-group">
        <div class="cs-prism-header" style="background:${prism.bg};border-color:${prism.border};">
          <span class="cs-prism-icon">${prism.icon}</span>
          <span class="cs-prism-name">${prism.name}</span>
          <span class="cs-prism-category">${prism.category}</span>
        </div>
        <div class="cs-affix-pills">`;
      groups[prismId].forEach(a => {
        const isPicked   = this.picks.includes(a.id);
        const isFull     = this.picks.length >= 4 && !isPicked;
        const isFlexible = a.prisms.length > 1;
        const disabledCls = isFull ? ' cs-pill-disabled' : '';
        const pickedCls   = isPicked ? ' cs-pill-picked' : '';
        const flexCls     = isFlexible ? ' cs-pill-flexible' : '';
        html += `<button
          class="cs-affix-pill${pickedCls}${disabledCls}${flexCls}"
          onclick="CraftSim.toggleAffix('${a.id}')"
          title="${a.note || a.name}${isFlexible ? ' ★ Flexible: also available from ' + a.prisms.slice(1).map(p => CRAFTING_DB.prisms[p].short).join('/') : ''}"
          ${isFull && !isPicked ? 'disabled' : ''}>
          ${isPicked ? '✅ ' : ''}${a.name}${isFlexible ? ' <span class="cs-flex-star">★</span>' : ''}
        </button>`;
      });
      html += `</div></div>`;
    });

    container.innerHTML = html;
  },

  // ── PICKS ──────────────────────────────────────────────────
  toggleAffix(affixId) {
    const idx = this.picks.indexOf(affixId);
    if (idx >= 0) {
      this.picks.splice(idx, 1);
    } else if (this.picks.length < 4) {
      this.picks.push(affixId);
    } else {
      showToast('⚠️ You already have 4 affixes selected. Remove one first.');
      return;
    }
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },

  renderSelected() {
    const bar = document.getElementById('cs-selected-bar');
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

  // ── CRAFTING PLAN ENGINE ───────────────────────────────────
  generatePlan() {
    if (!this.picks.length) return null;

    // 1. Gather affix objects for each pick
    const desired = this.picks.map(id => {
      const a = CRAFTING_DB.affixes.find(x => x.id === id);
      return a ? { ...a, assigned: null } : null;
    }).filter(Boolean);

    // 2. Optimize prism assignments: minimize max affixes per prism
    // Phase A: Lock affixes that have only one prism option
    const prismCounts = {};
    desired.forEach(a => {
      const craftable = a.prisms.filter(p => p !== 'none');
      if (craftable.length === 1) {
        a.assigned = craftable[0];
        prismCounts[a.assigned] = (prismCounts[a.assigned] || 0) + 1;
      }
    });

    // Phase B: Assign flexible affixes to least-loaded valid prism
    desired.forEach(a => {
      if (a.assigned) return;
      const craftable = a.prisms.filter(p => p !== 'none');
      if (!craftable.length) { a.assigned = 'none'; return; }
      // Sort options by current load, pick least-loaded
      const best = craftable.reduce((bestP, p) => {
        return (prismCounts[p] || 0) < (prismCounts[bestP] || 0) ? p : bestP;
      }, craftable[0]);
      a.assigned = best;
      prismCounts[best] = (prismCounts[best] || 0) + 1;
    });

    // 3. Group by assigned prism
    const groups = {};
    desired.forEach(a => {
      if (!groups[a.assigned]) groups[a.assigned] = [];
      groups[a.assigned].push(a);
    });

    // 4. Calculate enchanting locks needed
    let locksNeeded = 0;
    Object.values(groups).forEach(g => {
      if (g.length > 1) locksNeeded += g.length - 1;
    });

    // 5. Determine rolling order
    // Priority: most conflicted (largest groups) FIRST within craftable prisms
    // "none" prisms are noted but handled separately (no Cube targeting)
    const sortedGroups = Object.entries(groups)
      .filter(([prismId]) => prismId !== 'none')
      .sort(([,a], [,b]) => b.length - a.length);  // descending size

    const noneGroup = groups['none'] || [];

    // 6. Generate steps
    const steps = [];

    // Note any weapon inherents to set context
    const inherentSlotDisplay = this.getInherentForSlot();
    if (inherentSlotDisplay) {
      steps.push({
        type: 'info',
        icon: '📌',
        title: 'Inherent Affix',
        body:  `Your weapon has a built-in <strong>${inherentSlotDisplay}</strong> inherent affix that doesn't need to be rolled. You only need to add the affixes above.`,
      });
    }

    sortedGroups.forEach(([prismId, group]) => {
      const prism = CRAFTING_DB.prisms[prismId];
      // Within each conflict group: inflexible affixes (single prism) first
      const sortedGroup = [...group].sort((a, b) => a.prisms.length - b.prisms.length);

      sortedGroup.forEach((a, idx) => {
        const isFirstInGroup   = idx === 0;
        const isLastInGroup    = idx === sortedGroup.length - 1;
        const needsLockAfter   = !isLastInGroup;
        const isLocked         = idx > 0; // a previous stat has been locked

        // If this affix was flexibly assigned (has alternatives), note the alternatives
        const alternativePrisms = a.prisms
          .filter(p => p !== 'none' && p !== a.assigned)
          .map(p => CRAFTING_DB.prisms[p].short);

        steps.push({
          type:        'roll',
          icon:        '🎲',
          prismId,
          prismName:   prism.name,
          prismColor:  prism.color,
          prismBg:     prism.bg,
          prismIcon:   prism.icon,
          seeking:     a.name,
          isConflict:  group.length > 1,
          conflictIdx: idx,
          conflictTotal: group.length,
          lockBefore:  idx > 0 ? sortedGroup.slice(0, idx).map(x => x.name) : [],
          needsLockAfter,
          flexible:    a.prisms.length > 1 && alternativePrisms.length > 0,
          altPrisms:   alternativePrisms,
          // Pool hint: all affixes available from this prism + slot + class
          pool: this.getAfixPoolForPrism(prismId).map(x => x.name),
          note: a.note || null,
        });

        if (needsLockAfter) {
          steps.push({
            type:     'lock',
            icon:     '🔒',
            statName: a.name,
            nextStat: sortedGroup[idx + 1]?.name,
          });
        }
      });
    });

    // Handle untargetable affixes
    if (noneGroup.length) {
      steps.push({
        type:   'random',
        icon:   '🎰',
        affixes: noneGroup.map(a => a.name),
      });
    }

    // Completion step
    steps.push({
      type:  'done',
      icon:  '✅',
      picks: desired.map(a => a.name),
    });

    return {
      desired,
      groups,
      sortedGroups,
      locksNeeded,
      steps,
      hasConflict:    Object.values(groups).some(g => g.length > 1),
      hasUntargetable: noneGroup.length > 0,
      hasFlexible:    desired.some(a => a.prisms.length > 1),
    };
  },

  getAfixPoolForPrism(prismId) {
    if (!this.slot) return [];
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.prisms.includes(prismId)) return false;
      if (!a.slots.includes(this.slot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  getInherentForSlot() {
    // Find slotDisplay for the current slot
    const slotDef = getGearSlots().find(s => s.id === this.slot);
    if (!slotDef) return null;
    // Check saved gear for this slot to get slotDisplay
    const savedItem = STATE.gear[this.slot];
    if (savedItem && savedItem.slotDisplay) {
      return CRAFTING_DB.weaponInherents[savedItem.slotDisplay] || null;
    }
    return null;
  },

  // ── PLAN RENDERER ─────────────────────────────────────────────
  renderPlan() {
    const container = document.getElementById('cs-plan-output');
    if (!container) return;

    if (!this.picks.length) {
      container.innerHTML = `<div class="cs-plan-empty">
        <div style="font-size:40px;margin-bottom:12px;">🟫</div>
        <div style="font-family:'Cinzel',serif;font-size:14px;color:var(--text-muted);margin-bottom:8px;">Select up to 4 affixes above</div>
        <div style="font-size:12px;color:var(--text-dim);max-width:280px;line-height:1.6;">
          Your step-by-step Horadric Cube crafting plan will appear here, including when to use the Enchanter to lock stats.
        </div>
      </div>`;
      return;
    }

    this.plan = this.generatePlan();
    if (!this.plan) { container.innerHTML = ''; return; }
    const plan = this.plan;

    let html = '';

    // ── Summary banner ──
    const conflictColor = plan.hasConflict ? 'var(--orange-bright)' : 'var(--green-bright)';
    html += `<div class="cs-plan-summary">
      <div class="cs-plan-summary-row">
        <span class="cs-plan-label">Enchanting Locks Needed:</span>
        <span style="color:${conflictColor};font-weight:700;">${plan.locksNeeded === 0 ? '✅ None — no conflicts!' : `🔒 ${plan.locksNeeded} lock${plan.locksNeeded > 1 ? 's' : ''}`}</span>
      </div>
      ${plan.hasConflict ? `<div class="cs-plan-summary-row">
        <span class="cs-plan-label">Conflict Strategy:</span>
        <span style="color:var(--text-muted);font-size:11px;">Roll conflicting affixes first. Lock each with the Enchanter before rolling the next from the same prism.</span>
      </div>` : ''}
      ${plan.hasFlexible ? `<div class="cs-plan-summary-row">
        <span class="cs-plan-label">★ Flexible Affixes:</span>
        <span style="color:var(--gold);font-size:11px;">One or more affixes have multiple prism options. We've assigned them to minimize conflicts.</span>
      </div>` : ''}
      ${plan.hasUntargetable ? `<div class="cs-plan-summary-row">
        <span class="cs-plan-label">❌ Untargetable Affixes:</span>
        <span style="color:var(--red-bright);font-size:11px;">One or more affixes cannot be targeted by any prism — they roll randomly. Plan accordingly.</span>
      </div>` : ''}
    </div>`;

    // ── Steps ──
    html += `<div class="cs-steps">`;
    let stepNum = 0;
    plan.steps.forEach(step => {
      if (step.type === 'info') {
        html += `<div class="cs-step cs-step-info">
          <div class="cs-step-num">📌</div>
          <div class="cs-step-body">
            <div class="cs-step-title">${step.title}</div>
            <div class="cs-step-desc">${step.body}</div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'roll') {
        stepNum++;
        const prism    = CRAFTING_DB.prisms[step.prismId];
        const poolHtml = step.pool.length
          ? `<div class="cs-pool-hint">
              <span class="cs-pool-label">Full prism pool for this slot:</span>
              <span class="cs-pool-list">${step.pool.map(n => `<span class="cs-pool-item ${step.seeking === n ? 'cs-pool-target' : ''}">${n}</span>`).join('')}</span>
            </div>`
          : '';
        const lockWarning = step.lockBefore.length
          ? `<div class="cs-lock-warning">⚠️ Lock ${step.lockBefore.join(' and ')} at the Enchanter before this step!</div>`
          : '';
        const flexNote = step.flexible
          ? `<div class="cs-flex-note">★ Flexible: <strong>${step.seeking}</strong> could also come from <strong>${step.altPrisms.join(' or ')}</strong> — assigned here to minimize conflicts.</div>`
          : '';
        const conflictNote = step.isConflict
          ? `<div class="cs-conflict-note">Roll ${step.conflictIdx + 1} of ${step.conflictTotal} from this prism</div>`
          : '';

        html += `<div class="cs-step cs-step-roll" style="border-left-color:${step.prismColor};">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            ${lockWarning}
            <div class="cs-step-header">
              <span class="cs-step-prism-badge" style="background:${prism.bg};border-color:${prism.border};color:${prism.color};">
                ${prism.icon} ${prism.name}
              </span>
              ${conflictNote}
            </div>
            <div class="cs-step-title">Seeking: <strong>${step.seeking}</strong></div>
            ${step.note ? `<div class="cs-step-desc" style="color:var(--gold);">💡 ${step.note}</div>` : ''}
            ${flexNote}
            ${poolHtml}
          </div>
        </div>`;
        return;
      }

      if (step.type === 'lock') {
        stepNum++;
        html += `<div class="cs-step cs-step-lock">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">🔒 Enchant-Lock <strong>"${step.statName}"</strong></div>
            <div class="cs-step-desc">
              Visit the <strong>Occultist</strong> → open the <strong>Enchanting</strong> tab →
              find <strong>${step.statName}</strong> → click the <strong>lock icon</strong>.
              This prevents the Cube from touching this stat when you roll for
              <strong>${step.nextStat || 'the next affix'}</strong>.
            </div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'random') {
        stepNum++;
        html += `<div class="cs-step cs-step-random">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">🎰 Random Roll — No Prism Available</div>
            <div class="cs-step-desc">
              <strong style="color:var(--red-bright);">${step.affixes.join(', ')}</strong>
              cannot be targeted by any Tuning Prism. Roll without a prism and hope for the best.
              <br><br>
              💡 <strong>Tip:</strong> Roll all your targeted affixes first, then lock them all, and use
              Chaotic Reroll on the remaining slot(s) to fish for this stat.
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
            <div class="cs-step-desc">
              <strong>${step.picks.join(', ')}</strong><br><br>
              Next steps:
              <ol style="margin-top:8px;padding-left:18px;font-size:11px;line-height:2.0;">
                <li>🔓 Unlock all Enchanting locks at the Occultist</li>
                <li>📖 Imprint your Legendary Aspect at the Occultist</li>
                <li>🔨 Apply both Tempers at the Blacksmith</li>
                <li>⭐ Masterwork to Rank 12 at the Blacksmith</li>
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

  // ── PRE-FILL FROM GEAR PLANNER ─────────────────────────────
  // Called when a user clicks "Plan This Craft" from a gear slot
  prefillFromSlot(slotId) {
    this.slot = slotId;
    this.cls  = STATE.buildClass || null;
    const item = STATE.gear[slotId];
    if (item && item.affixes && item.affixes.length) {
      // Try to match affix names to DB IDs
      const matchedIds = [];
      item.affixes.forEach(name => {
        const match = CRAFTING_DB.affixes.find(a =>
          a.name.toLowerCase() === name.toLowerCase() ||
          a.name.toLowerCase().includes(name.toLowerCase())
        );
        if (match && matchedIds.length < 4) matchedIds.push(match.id);
      });
      this.picks = matchedIds;
    } else {
      this.picks = [];
    }
    // Switch to crafting tab
    document.getElementById('tab-crafting')?.click();
    // Update selectors
    const slotSel = document.getElementById('cs-slot');
    if (slotSel) slotSel.value = slotId;
    const clsSel  = document.getElementById('cs-class');
    if (clsSel && this.cls) clsSel.value = this.cls;
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },
};
