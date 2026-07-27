// ============================================================
// NEPHALEM'S CODEX — Crafting Simulator Logic
// Horadric Cube step-by-step crafting planner
// ============================================================
// KEY MECHANIC (corrected):
//   Focus Reroll with a Tuning Prism RANDOMLY picks which affix
//   of that prism's category to change. You do NOT choose the slot.
//   Only ONE affix can be locked at a time (via the Enchanter).
//   This means:
//     2 same-prism stats → lock one, fish freely for the second (easy)
//     3 same-prism stats → lock one, 50/50 chance reroll hits what you want (hard)
//     4 same-prism stats → lock one, 33% chance of hitting target (luck-based)
// ============================================================

const CraftSim = {
  slot:     null,
  cls:      null,
  picks:    [],
  plan:     null,

  init() {
    this.slot  = null;
    this.cls   = STATE.buildClass || null;
    this.picks = [];
    this.plan  = null;
    this.renderSlotSelector();
    this.renderClassSelector();
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
    this.attachListeners();
  },

  attachListeners() {
    const slotSel  = document.getElementById('cs-slot');
    const clsSel   = document.getElementById('cs-class');
    const clearBtn = document.getElementById('cs-clear');
    if (slotSel)  slotSel.addEventListener('change',  () => {
      this.slot  = slotSel.value;
      this.picks = [];
      this.renderAfixPicker();
      this.renderSelected();
      this.renderPlan();
    });
    if (clsSel)   clsSel.addEventListener('change',   () => {
      this.cls   = clsSel.value;
      this.picks = [];
      this.renderAfixPicker();
      this.renderSelected();
      this.renderPlan();
    });
    if (clearBtn) clearBtn.addEventListener('click',  () => {
      this.picks = [];
      this.plan  = null;
      this.renderSelected();
      this.renderAfixPicker();
      this.renderPlan();
    });
  },

  // ── SELECTORS ──────────────────────────────────────────────
  renderSlotSelector() {
    const sel = document.getElementById('cs-slot');
    if (!sel) return;
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

  // ── AFFIX FILTERING ────────────────────────────────────────
  getAvailableAffixes() {
    if (!this.slot) return [];
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.slots.includes(this.slot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  getPoolForPrism(prismId) {
    if (!this.slot) return [];
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.prisms.includes(prismId)) return false;
      if (!a.slots.includes(this.slot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  // ── AFFIX PICKER ───────────────────────────────────────────
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
      // Count how many from this group are already picked
      const pickedFromGroup = groups[prismId].filter(a => this.picks.includes(a.id)).length;
      const conflictWarning = pickedFromGroup >= 2
        ? `<span class="cs-group-warning">⚠️ ${pickedFromGroup} from same prism — conflicts!</span>` : '';
      html += `<div class="cs-prism-group">
        <div class="cs-prism-header" style="background:${prism.bg};border-color:${prism.border};">
          <span class="cs-prism-icon">${prism.icon}</span>
          <span class="cs-prism-name">${prism.name}</span>
          <span class="cs-prism-category">${prism.category}</span>
          ${conflictWarning}
        </div>
        <div class="cs-affix-pills">`;
      groups[prismId].forEach(a => {
        const isPicked   = this.picks.includes(a.id);
        const isFull     = this.picks.length >= 4 && !isPicked;
        const isFlexible = a.prisms.length > 1;
        html += `<button
          class="cs-affix-pill${isPicked ? ' cs-pill-picked' : ''}${isFull ? ' cs-pill-disabled' : ''}${isFlexible ? ' cs-pill-flexible' : ''}"
          onclick="CraftSim.toggleAffix('${a.id}')"
          title="${a.note ? a.note + ' ' : ''}${isFlexible ? '★ Also available from: ' + a.prisms.slice(1).map(p => CRAFTING_DB.prisms[p].short).join('/') : ''}"
          ${isFull && !isPicked ? 'disabled' : ''}>
          ${isPicked ? '✅ ' : ''}${a.name}${isFlexible ? ' <span class="cs-flex-star">★</span>' : ''}
        </button>`;
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
  },

  toggleAffix(affixId) {
    const idx = this.picks.indexOf(affixId);
    if (idx >= 0) {
      this.picks.splice(idx, 1);
    } else if (this.picks.length < 4) {
      this.picks.push(affixId);
    } else {
      showToast('⚠️ Already have 4 affixes selected. Remove one first.');
      return;
    }
    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },

  renderSelected() {
    const bar    = document.getElementById('cs-selected-bar');
    const label  = document.querySelector('.cs-selected-label');
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

  // ── PLAN ENGINE ────────────────────────────────────────────
  // !! CORRECTED MECHANIC !!
  // Focus Reroll randomly picks WHICH affix of the prism type gets changed.
  // You can only lock ONE affix at a time (via the Enchanter).
  // Strategy: assign flexible affixes to minimize prism conflicts.
  // Then build steps with honest difficulty ratings.
  generatePlan() {
    if (!this.picks.length) return null;

    const desired = this.picks.map(id => {
      const a = CRAFTING_DB.affixes.find(x => x.id === id);
      return a ? { ...a } : null;
    }).filter(Boolean);

    // ── Step 1: Assign prisms optimally ──────────────────────
    // Separate single-prism (forced) from flexible affixes
    const forced   = desired.filter(a => a.prisms.filter(p => p !== 'none').length === 1 || a.prisms[0] === 'none');
    const flexible = desired.filter(a => a.prisms.filter(p => p !== 'none').length > 1);

    const prismCounts = {};
    forced.forEach(a => {
      const p = a.prisms.find(x => x !== 'none') || 'none';
      a.assigned = p;
      prismCounts[p] = (prismCounts[p] || 0) + 1;
    });

    // Assign flexible affixes to the least-loaded valid prism
    flexible.forEach(a => {
      const options = a.prisms.filter(p => p !== 'none');
      const best = options.reduce((b, p) => (prismCounts[p] || 0) < (prismCounts[b] || 0) ? p : b, options[0]);
      a.assigned = best;
      prismCounts[best] = (prismCounts[best] || 0) + 1;
    });

    // ── Step 2: Group by assigned prism ──────────────────────
    const groups = {};
    desired.forEach(a => {
      if (!groups[a.assigned]) groups[a.assigned] = [];
      groups[a.assigned].push(a);
    });

    // ── Step 3: Determine overall difficulty ─────────────────
    const maxConflict = Math.max(...Object.values(groups).filter(g => g[0].assigned !== 'none').map(g => g.length));
    const hasConflict = maxConflict >= 2;
    const noneGroup   = groups['none'] || [];
    const hasUntargetable = noneGroup.length > 0;

    let difficultyLabel, difficultyColor;
    if (maxConflict === 1) {
      difficultyLabel = '✅ Easy — no prism conflicts, 1 lock max needed';
      difficultyColor = 'var(--green-bright)';
    } else if (maxConflict === 2) {
      difficultyLabel = '⚠️ Moderate — 2 stats share a prism, 1 lock needed';
      difficultyColor = 'var(--gold)';
    } else if (maxConflict === 3) {
      difficultyLabel = '💀 Hard — 3 stats share a prism, 50/50 chance per roll hits your target';
      difficultyColor = 'var(--orange-bright)';
    } else {
      difficultyLabel = '☠️ Extremely Difficult — 4 stats share a prism, mostly luck-based';
      difficultyColor = 'var(--red-bright)';
    }

    // ── Step 4: Build ordered steps ──────────────────────────
    // Sort groups: no-conflict (size 1) last, largest conflicts first
    // Exception: "none" group is always last
    const craftableGroups = Object.entries(groups)
      .filter(([p]) => p !== 'none')
      .sort(([, a], [, b]) => b.length - a.length);

    const steps = [];
    let lockUsed = false;

    craftableGroups.forEach(([prismId, group]) => {
      const prism    = CRAFTING_DB.prisms[prismId];
      const poolSize = this.getPoolForPrism(prismId).length;
      const count    = group.length;

      if (count === 1) {
        // No conflict — straightforward roll
        const a = group[0];
        steps.push({
          type:      'roll',
          prismId,
          prism,
          seeking:   [a.name],
          difficulty: 'easy',
          poolSize,
          conflict:  1,
          note:      a.note || null,
          flexible:  a.prisms.length > 1,
          altPrisms: a.prisms.filter(p => p !== 'none' && p !== a.assigned).map(p => CRAFTING_DB.prisms[p].short),
          pool:      this.getPoolForPrism(prismId).map(x => x.name),
        });
      } else if (count === 2) {
        // 2-conflict: roll first, lock it, roll second
        // This uses the ONLY lock we have
        steps.push({
          type:       'roll',
          prismId,
          prism,
          seeking:    [group[0].name, group[1].name],
          seekingHint:'Roll until you get either one.',
          difficulty: 'easy',
          poolSize,
          conflict:   2,
          note:       null,
          pool:       this.getPoolForPrism(prismId).map(x => x.name),
        });
        steps.push({
          type:     'lock',
          lockWhat: 'Whichever stat you just got (either one)',
          lockWhy:  `You now have 1 of 2 needed ${prism.name} stats. Lock it so the next ${prism.name} Focus Reroll cannot accidentally change it.`,
          isOnly:   !lockUsed,
        });
        lockUsed = true;
        steps.push({
          type:       'roll',
          prismId,
          prism,
          seeking:    [group[0].name + ' or ' + group[1].name],
          seekingHint:'Roll until you get the other one. The locked stat is protected.',
          difficulty: 'moderate',
          poolSize,
          conflict:   2,
          isSecond:   true,
          note:       null,
          pool:       this.getPoolForPrism(prismId).map(x => x.name),
        });
      } else if (count === 3) {
        // 3-conflict: most efficient path explained honestly
        steps.push({
          type:       'roll',
          prismId,
          prism,
          seeking:    group.map(a => a.name),
          seekingHint:'Roll until you land any TWO of these three at once (extremely lucky) OR proceed one at a time.',
          difficulty: 'hard',
          poolSize,
          conflict:   3,
          note:       null,
          pool:       this.getPoolForPrism(prismId).map(x => x.name),
        });
        steps.push({
          type:    'conflict-warning',
          count:   3,
          prism,
          targets: group.map(a => a.name),
        });
      } else {
        // 4-conflict: luck-based, be honest
        steps.push({
          type:       'roll',
          prismId,
          prism,
          seeking:    group.map(a => a.name),
          seekingHint:'All four affixes come from the same prism. Only 1 can be locked at any time.',
          difficulty: 'extreme',
          poolSize,
          conflict:   4,
          note:       null,
          pool:       this.getPoolForPrism(prismId).map(x => x.name),
        });
        steps.push({
          type:    'conflict-warning',
          count:   4,
          prism,
          targets: group.map(a => a.name),
        });
      }
    });

    // Untargetable stats
    if (noneGroup.length) {
      steps.push({ type: 'untargetable', affixes: noneGroup.map(a => a.name) });
    }

    // Inherent affix note
    const inherent = this.getInherentForSlot();
    if (inherent) {
      steps.unshift({ type: 'inherent', inherent });
    }

    // Completion
    steps.push({ type: 'done', picks: desired.map(a => a.name) });

    return { desired, groups, maxConflict, difficultyLabel, difficultyColor, steps, hasConflict, hasUntargetable, noneGroup };
  },

  getPoolForPrism(prismId) {
    if (!this.slot) return [];
    return CRAFTING_DB.affixes.filter(a => {
      if (!a.prisms.includes(prismId)) return false;
      if (!a.slots.includes(this.slot)) return false;
      if (this.cls && a.class !== 'all' && a.class !== this.cls) return false;
      return true;
    });
  },

  getInherentForSlot() {
    const saved = STATE.gear[this.slot];
    if (saved && saved.slotDisplay) return CRAFTING_DB.weaponInherents[saved.slotDisplay] || null;
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
        <div style="font-size:12px;color:var(--text-dim);max-width:300px;line-height:1.6;text-align:center;">
          Your step-by-step Horadric Cube crafting plan will appear here, including the optimal rolling order
          and exactly when (and if) to use the Enchanter's single stat lock.
        </div>
      </div>`;
      return;
    }

    this.plan = this.generatePlan();
    if (!this.plan) return;
    const plan = this.plan;

    let html = '';

    // ── Difficulty banner ─────────────────────────────────────
    html += `<div class="cs-plan-summary">
      <div style="font-size:13px;font-weight:700;color:${plan.difficultyColor};margin-bottom:8px;">
        ${plan.difficultyLabel}
      </div>
      <div class="cs-key-rule">
        🔒 <strong>Lock rule:</strong> You can only lock <strong>ONE affix per item at any time</strong> (at the Enchanter/Occultist).
        When you Focus Reroll with a Tuning Prism, the Cube <strong>randomly picks which affix of that category gets changed</strong>.
        The lock protects one specific affix from being altered.
      </div>
      ${plan.hasUntargetable ? `<div class="cs-key-rule" style="border-left-color:var(--red-bright);color:var(--red-bright);">
        ❌ <strong>Heads up:</strong> One or more of your desired affixes cannot be targeted by any Tuning Prism.
        They roll randomly — plan around these with Chaotic Reroll as a last resort.
      </div>` : ''}
    </div>`;

    // ── Steps ─────────────────────────────────────────────────
    html += `<div class="cs-steps">`;
    let stepNum = 0;

    plan.steps.forEach(step => {

      if (step.type === 'inherent') {
        html += `<div class="cs-step cs-step-info">
          <div class="cs-step-num">📌</div>
          <div class="cs-step-body">
            <div class="cs-step-title">Weapon Inherent Affix</div>
            <div class="cs-step-desc">Your <strong>${step.inherent.join(', ')}</strong> is built into this weapon type — it doesn't count as a rollable affix slot.</div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'roll') {
        stepNum++;
        const diffColor = {
          easy:     'var(--green-bright)',
          moderate: 'var(--gold)',
          hard:     'var(--orange-bright)',
          extreme:  'var(--red-bright)',
        }[step.difficulty] || 'var(--text-muted)';

        const diffLabel = {
          easy:     '✅ Straightforward',
          moderate: '⚠️ Lock required',
          hard:     '💀 Difficult',
          extreme:  '☠️ Luck-based',
        }[step.difficulty] || '';

        const poolHtml = step.pool.length
          ? `<details class="cs-pool-details">
              <summary class="cs-pool-summary">Full ${step.prism.short} pool for this slot (${step.poolSize} affixes)</summary>
              <div class="cs-pool-list">
                ${step.pool.map(n => `<span class="cs-pool-item ${step.seeking.some(s => n.includes(s) || s.includes(n)) ? 'cs-pool-target' : ''}">${n}</span>`).join('')}
              </div>
            </details>`
          : '';

        const flexNote = step.flexible
          ? `<div class="cs-flex-note">★ Flexible — this stat could also come from <strong>${step.altPrisms.join(' or ')}</strong>. Assigned here to minimize conflicts.</div>`
          : '';

        html += `<div class="cs-step cs-step-roll" style="border-left-color:${step.prism.color};">
          <div class="cs-step-num" style="background:${step.prism.bg};border-color:${step.prism.border};color:${step.prism.color};">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-header">
              <span class="cs-step-prism-badge" style="background:${step.prism.bg};border-color:${step.prism.border};color:${step.prism.color};">
                ${step.prism.icon} ${step.prism.name}
              </span>
              <span style="font-size:10px;color:${diffColor};font-weight:600;">${diffLabel}</span>
              ${step.conflict > 1 ? `<span style="font-size:10px;color:var(--text-dim);">(${step.conflict} stats from this prism)</span>` : ''}
            </div>
            <div class="cs-step-title">Seeking: <strong>${step.seeking.join(' / ')}</strong></div>
            ${step.seekingHint ? `<div class="cs-step-hint">${step.seekingHint}</div>` : ''}
            ${step.note ? `<div class="cs-step-desc" style="color:var(--gold);margin-top:4px;">💡 ${step.note}</div>` : ''}
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
            <div class="cs-step-title">🔒 Lock: <strong>${step.lockWhat}</strong></div>
            <div class="cs-step-desc">
              ${step.lockWhy}<br><br>
              <strong>How:</strong> Visit the <strong>Occultist</strong> → <strong>Enchant Item</strong> tab → click the
              🔒 lock icon next to the stat you just rolled.
              <br><br>
              <span style="color:var(--red-bright);font-weight:600;">⚠️ This is your ONE and only lock.</span>
              You cannot lock any other stat while this lock is active. Unlock it when you no longer need protection.
            </div>
          </div>
        </div>`;
        return;
      }

      if (step.type === 'conflict-warning') {
        const { count, prism, targets } = step;
        const chancePerRoll = Math.round(100 / count);
        if (count === 3) {
          html += `<div class="cs-step cs-step-conflict">
            <div class="cs-step-num">⚠️</div>
            <div class="cs-step-body">
              <div class="cs-step-title">3-Prism Conflict Strategy</div>
              <div class="cs-step-desc">
                You need <strong>3 stats from ${prism.name}</strong>:
                <strong>${targets.join(', ')}</strong><br><br>
                You only have <strong>1 lock</strong>. Here's the realistic approach:
                <ol style="margin:10px 0;padding-left:18px;line-height:2.2;">
                  <li>Roll ${prism.short} → fish until you get <strong>any</strong> of the 3 targets → <strong>Lock it</strong></li>
                  <li>Roll ${prism.short} again → ~${chancePerRoll}% chance each roll hits a remaining target (vs. the locked one which is safe)</li>
                  <li>Once you have 2 of the 3 locked/rolled: <strong>you must choose</strong> — lock one, accept the other is now exposed</li>
                  <li>Roll ${prism.short} for the 3rd target — the exposed stat <em>could</em> get overwritten (the Cube picks randomly among unlocked ${prism.short} stats)</li>
                </ol>
                <span style="color:var(--orange-bright);">⚠️ This will likely take many attempts. Consider whether the build truly needs all 3 Aggressive stats, or if one could be sourced differently.</span>
              </div>
            </div>
          </div>`;
        } else {
          html += `<div class="cs-step cs-step-conflict" style="border-left-color:var(--red-bright);">
            <div class="cs-step-num">☠️</div>
            <div class="cs-step-body">
              <div class="cs-step-title">4-Prism Conflict — Largely Luck-Based</div>
              <div class="cs-step-desc">
                All 4 desired stats come from <strong>${prism.name}</strong>:
                <strong>${targets.join(', ')}</strong><br><br>
                With only 1 lock, at best you can protect 1 stat while the other 3 slots are exposed.
                Each Focus Reroll randomly picks from the 3 unlocked ${prism.short} slots.<br><br>
                <strong>The honest truth:</strong> Getting all 4 requires a combination of locking strategically and accepting that
                at some point you'll need 3 unlocked slots to all have landed on your targets simultaneously.
                <br><br>
                💡 <strong>Practical tip:</strong> Roll all 4 slots without any specific prism, lock the best 1, then use
                Focus Reroll with ${prism.short} repeatedly. Treat the item as done when you get close enough,
                and rely on Masterworking to amplify the stats you got right.
              </div>
            </div>
          </div>`;
        }
        return;
      }

      if (step.type === 'untargetable') {
        stepNum++;
        html += `<div class="cs-step cs-step-random">
          <div class="cs-step-num">${stepNum}</div>
          <div class="cs-step-body">
            <div class="cs-step-title">🎰 Untargetable — No Prism Available</div>
            <div class="cs-step-desc">
              <strong style="color:var(--red-bright);">${step.affixes.join(', ')}</strong>
              cannot be targeted by any Tuning Prism.
              <br><br>
              💡 <strong>Best approach:</strong> Roll all your targeted affixes first (lock 1 as needed),
              then lock ALL the ones you want, leaving only this slot open. Use <strong>Chaotic Reroll</strong>
              (no prism) to randomly cycle through all affix types until you land on this stat.
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
              <strong>${step.picks.join(', ')}</strong>
              <br><br>
              <strong>Continue building this item:</strong>
              <ol style="margin-top:8px;padding-left:18px;font-size:11px;line-height:2.2;">
                <li>🔓 Remove any Enchanting locks at the Occultist</li>
                <li>📖 Imprint your Legendary Aspect at the Occultist</li>
                <li>🔨 Apply both Temper slots at the Blacksmith (limited re-rolls!)</li>
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
  prefillFromSlot(slotId) {
    this.slot = slotId;
    this.cls  = STATE.buildClass || null;

    const item = STATE.gear[slotId];
    if (item && item.affixes && item.affixes.length) {
      const matchedIds = [];
      item.affixes.forEach(name => {
        const lower = name.toLowerCase().trim();
        const match = CRAFTING_DB.affixes.find(a =>
          a.name.toLowerCase() === lower ||
          a.name.toLowerCase().includes(lower) ||
          lower.includes(a.name.toLowerCase().split(' ')[0])
        );
        if (match && matchedIds.length < 4 && !matchedIds.includes(match.id)) {
          matchedIds.push(match.id);
        }
      });
      this.picks = matchedIds;
    } else {
      this.picks = [];
    }

    // Switch to crafting tab
    const tab = document.getElementById('tab-crafting');
    if (tab) tab.click();
    else switchTab('crafting');

    const slotSel = document.getElementById('cs-slot');
    if (slotSel) slotSel.value = slotId;
    const clsSel  = document.getElementById('cs-class');
    if (clsSel && this.cls) clsSel.value = this.cls;

    this.renderAfixPicker();
    this.renderSelected();
    this.renderPlan();
  },
};
