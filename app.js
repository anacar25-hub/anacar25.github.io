const state = {
  foods: [],
  filtered: [],
};

const els = {
  grid: document.getElementById("foodGrid"),
  results: document.getElementById("resultsCount"),
  search: document.getElementById("searchInput"),
  category: document.getElementById("categoryFilter"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  modalContent: document.getElementById("modalContent"),
};

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function renderCard(food) {
  return `
    <div class="rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
         style="background:#1e293b;border:1px solid #334155;"
         data-id="${food.id}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <span class="text-4xl">${food.emoji || "🍽️"}</span>
          <div>
            <h3 class="font-bold text-lg text-slate-50">${food.name}</h3>
            <p class="text-sm capitalize text-slate-400">${food.category}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold" style="color:#22c55e;">${food.calories ?? 0}</span>
          <p class="text-xs text-slate-400">kcal</p>
        </div>
      </div>
      <p class="text-xs mb-3 text-slate-400">Per ${food.serving || ""}</p>

      <div class="grid grid-cols-3 gap-2">
        <div class="text-center p-2 rounded-lg" style="background:#0f172a;">
          <p class="font-bold text-sm text-red-400">${food.protein ?? 0}g</p>
          <p class="text-xs text-slate-400">Protein</p>
        </div>
        <div class="text-center p-2 rounded-lg" style="background:#0f172a;">
          <p class="font-bold text-sm text-blue-400">${food.carbs ?? 0}g</p>
          <p class="text-xs text-slate-400">Carbs</p>
        </div>
        <div class="text-center p-2 rounded-lg" style="background:#0f172a;">
          <p class="font-bold text-sm text-amber-400">${food.fat ?? 0}g</p>
          <p class="text-xs text-slate-400">Fat</p>
        </div>
      </div>
    </div>
  `;
}

function renderGrid() {
  if (!state.filtered.length) {
    els.grid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <span class="text-6xl mb-4 block">🔍</span>
        <p class="text-xl text-slate-50">No foods found</p>
        <p class="text-slate-400">Try adjusting your search or filter</p>
      </div>
    `;
    els.results.textContent = "0 results";
    return;
  }

  els.grid.innerHTML = state.filtered.map(renderCard).join("");
  els.results.textContent = `Showing ${state.filtered.length} of ${state.foods.length} foods`;

  // Click handlers
  document.querySelectorAll("[data-id]").forEach(card => {
    card.addEventListener("click", () => showDetail(card.getAttribute("data-id")));
  });
}

function filterFoods() {
  const q = (els.search.value || "").toLowerCase().trim();
  const cat = els.category.value;

  state.filtered = state.foods.filter(f => {
    const matchesSearch = (f.name || "").toLowerCase().includes(q);
    const matchesCat = cat === "all" || f.category === cat;
    return matchesSearch && matchesCat;
  });

  renderGrid();
}

function showDetail(id) {
  const food = state.foods.find(f => String(f.id) === String(id));
  if (!food) return;

  const highlights = safeArray(food.highlights);
  const supports = safeArray(food.supports);
  const assoc = safeArray(food.associated_with);
  const helpful = safeArray(food.conditions_support);
  const pairing = safeArray(food.pairing_tips);
  const cautions = safeArray(food.cautions);

  els.modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <span class="text-6xl">${food.emoji || "🍽️"}</span>
          <div>
            <h2 class="text-2xl font-bold text-slate-50">${food.name}</h2>
            <p class="capitalize text-slate-400">${food.category}</p>
            <p class="text-sm mt-1 text-slate-400">Serving: ${food.serving || ""}</p>
          </div>
        </div>
        <button id="closeBtn" class="p-2 rounded-lg hover:opacity-80" style="background:#0f172a;">
          <span class="text-slate-50 text-xl">✕</span>
        </button>
      </div>

      <div class="text-center p-6 rounded-xl mb-6" style="background:#0f172a;">
        <span class="text-5xl font-bold" style="color:#22c55e;">${food.calories ?? 0}</span>
        <p class="text-lg mt-1 text-slate-400">Calories</p>
      </div>

      <h3 class="font-bold text-lg mb-3 text-slate-50">Macros</h3>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-sm text-slate-400">Protein</p>
          <p class="text-xl font-bold text-red-400">${food.protein ?? 0}g</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-sm text-slate-400">Carbs</p>
          <p class="text-xl font-bold text-blue-400">${food.carbs ?? 0}g</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-sm text-slate-400">Fat</p>
          <p class="text-xl font-bold text-amber-400">${food.fat ?? 0}g</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-sm text-slate-400">Fiber</p>
          <p class="text-xl font-bold" style="color:#22c55e;">${food.fiber ?? 0}g</p>
        </div>
      </div>

      <h3 class="font-bold text-lg mb-3 text-slate-50">Micronutrients</h3>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Vitamin C</p>
          <p class="text-sm font-bold text-slate-50">${food.vitaminC ?? 0} mg</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Potassium</p>
          <p class="text-sm font-bold text-slate-50">${food.potassium ?? 0} mg</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Vitamin A</p>
          <p class="text-sm font-bold text-slate-50">${food.vitaminA ?? 0} µg</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Iron</p>
          <p class="text-sm font-bold text-slate-50">${food.iron ?? 0} mg</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Calcium</p>
          <p class="text-sm font-bold text-slate-50">${food.calcium ?? 0} mg</p>
        </div>
        <div class="p-3 rounded-lg" style="background:#0f172a;">
          <p class="text-xs text-slate-400">Magnesium</p>
          <p class="text-sm font-bold text-slate-50">${food.magnesium ?? 0} mg</p>
        </div>
      </div>

      ${(highlights.length || supports.length || assoc.length || helpful.length || pairing.length || cautions.length) ? `
        <h3 class="font-bold text-lg mb-3 text-slate-50">Nutrition Education</h3>

        ${highlights.length ? `
          <div class="mb-5">
            <p class="font-semibold mb-2 text-slate-50">Key highlights</p>
            <div class="flex flex-wrap gap-2">
              ${highlights.map(x => `<span class="px-3 py-1 rounded-full text-sm" style="background:#0f172a;color:#22c55e;border:1px solid #334155;">${x}</span>`).join("")}
            </div>
          </div>
        ` : ""}

        ${supports.length ? `
          <div class="mb-5">
            <p class="font-semibold mb-2 text-slate-50">What this supports</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-400">
              ${supports.map(x => `<li>${x}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${assoc.length ? `
          <div class="mb-5">
            <p class="font-semibold mb-1 text-slate-50">Research associations</p>
            <p class="text-xs mb-2 text-slate-500">Educational associations, not medical claims.</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-400">
              ${assoc.map(x => `<li>${x}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${helpful.length ? `
          <div class="mb-5">
            <p class="font-semibold mb-2 text-slate-50">Helpful for</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-400">
              ${helpful.map(x => `<li>${x}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${pairing.length ? `
          <div class="mb-5">
            <p class="font-semibold mb-2 text-slate-50">Pairing tips</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-400">
              ${pairing.map(x => `<li>${x}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${cautions.length ? `
          <div class="mb-4">
            <p class="font-semibold mb-2 text-slate-50">Notes</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-400">
              ${cautions.map(x => `<li>${x}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <p class="text-xs mt-6 text-slate-500">
          Educational use only. Not intended to diagnose, treat, cure, or prevent disease.
        </p>
      ` : ""}
    </div>
  `;

  els.modalBackdrop.classList.remove("hidden");
  els.modalBackdrop.classList.add("flex");

  document.getElementById("closeBtn").addEventListener("click", closeModal);
}

function closeModal() {
  els.modalBackdrop.classList.add("hidden");
  els.modalBackdrop.classList.remove("flex");
}

els.modalBackdrop.addEventListener("click", (e) => {
  if (e.target === els.modalBackdrop) closeModal();
});

async function init() {
  try {
    // IMPORTANT: This must be a relative path so GitHub Pages can find it
    const res = await fetch("./foods.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`foods.json not found (HTTP ${res.status})`);
    state.foods = await res.json();
    state.filtered = [...state.foods];

    els.search.addEventListener("input", filterFoods);
    els.category.addEventListener("change", filterFoods);

    renderGrid();
  } catch (err) {
    console.error(err);
    els.grid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <span class="text-6xl mb-4 block">⚠️</span>
        <p class="text-xl text-slate-50">Site loaded, but data did not.</p>
        <p class="text-slate-400 mt-2">Fix: make sure <code class="text-slate-200">foods.json</code> is in the SAME folder as <code class="text-slate-200">index.html</code>.</p>
      </div>
    `;
  }
}

init();
