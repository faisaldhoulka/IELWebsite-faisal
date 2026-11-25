const supabaseUrl = "https://bfxmfaakufrmzcxhtgfw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeG1mYWFrdWZybXpjeGh0Z2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQzMTIsImV4cCI6MjA3NTM5MDMxMn0.qtNn0qXNhn8ol8fTSb2Hp9nQkYfFA2Y_Zec4LuISPZQ";

let supabaseClient = null;

// ────────────────────────────────────────────────
// Init (starts once the supabase global exists)
// ────────────────────────────────────────────────
function initSupabase() {
  if (typeof supabase === "undefined") {
    setTimeout(initSupabase, 100);
    return;
  }
  supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  initResearchPage();
}
initSupabase();

// ────────────────────────────────────────────────
// State + style constants
// ────────────────────────────────────────────────
let allResearch = [];
let loadFailed = false;
const state = { sector: "", freq: "All", query: "" };

// Revamp design: underlined text tabs, segmented control for report types
const TAB_ACTIVE = ["text-accent", "border-accent"];
const TAB_IDLE = ["text-muted", "border-transparent", "hover:text-ink"];
const PILL_ACTIVE = ["bg-accent", "text-white"];
const PILL_IDLE = ["bg-white", "text-accent", "hover:bg-mist"];

// Shared classes for empty / error states
const NOTE_CLASS = "m-0 border border-line bg-mist p-6 text-[15px] text-muted-body";
const ERROR_CLASS =
  "m-0 border border-line border-l-4 border-l-signal-red bg-white p-6 text-[15px] text-ink";

const norm = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

function resolvePdfUrl(pdfUrl) {
  let url = pdfUrl?.trim() || "#";
  if (url !== "#" && !/^https?:\/\//i.test(url)) {
    url = `${supabaseUrl}/storage/v1/object/public/${url}`;
  }
  return url;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ────────────────────────────────────────────────
// Page setup
// ────────────────────────────────────────────────
async function initResearchPage() {
  styleControls();
  bindEvents();
  await Promise.all([loadSectors(), loadAllResearch()]);
  render();
}

// Build the tabs from the sector table
async function loadSectors() {
  try {
    const { data, error } = await supabaseClient
      .from("sector")
      .select("*")
      .order("sector_name", { ascending: true });
    if (error) throw error;

    const tabs = document.getElementById("categoryTabs");
    if (!tabs) return;
    tabs.innerHTML = "";

    (data || []).forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.tab = s.sector_name;
      btn.textContent = s.sector_name;
      btn.setAttribute("aria-pressed", "false");
      btn.className =
        "tab-btn pb-3 -mb-px border-0 border-b-2 border-solid bg-transparent px-0 text-[15px] font-semibold font-sans whitespace-nowrap cursor-pointer transition-colors";
      tabs.appendChild(btn);
    });

    // Select the first sector by default
    if (data && data.length > 0) state.sector = data[0].sector_name;
  } catch (err) {
    console.error("Error loading sectors:", err);
    const tabs = document.getElementById("categoryTabs");
    if (tabs) {
      tabs.innerHTML =
        '<span class="pb-3 text-[15px] text-muted">Sectors could not be loaded.</span>';
    }
  }
}

// Fetch every report once, then filter in the browser
async function loadAllResearch() {
  const container = document.getElementById("researchContainer");
  try {
    const { data, error } = await supabaseClient
      .from("research")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    allResearch = data || [];
  } catch (err) {
    console.error("Error loading research:", err);
    loadFailed = true; // render() shows the error state
    allResearch = [];
  }
}

// ────────────────────────────────────────────────
// Events
// ────────────────────────────────────────────────
function bindEvents() {
  // Sector tabs (picking a tab clears any active search)
  document.getElementById("categoryTabs").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    state.sector = btn.dataset.tab;
    state.query = "";
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
    render();
  });

  // Frequency pills
  document.getElementById("freqPills").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-freq]");
    if (!btn) return;
    state.freq = btn.dataset.freq;
    render();
  });

  // Search
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (form && input) {
    let timer;
    const runSearch = () => {
      state.query = input.value;
      render();
    };

    // Live search once the user pauses typing
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(runSearch, 200);
    });

    // Enter key / Search button
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearTimeout(timer);
      runSearch();
      document
        .getElementById("researchContainer")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

// ────────────────────────────────────────────────
// Tab / pill styling
// ────────────────────────────────────────────────
function styleControls() {
  document.querySelectorAll(".pill-btn").forEach((b) => {
    b.className =
      "pill-btn px-4 py-2.5 border-0 border-l border-solid border-accent first:border-l-0 text-sm font-semibold font-sans cursor-pointer transition-colors";
  });
}

function updateControls() {
  const searching = state.query.trim().length > 0;

  document.querySelectorAll(".tab-btn").forEach((b) => {
    // No tab looks active while a search is running (it spans all sectors)
    const active = !searching && b.dataset.tab === state.sector;
    b.classList.remove(...TAB_ACTIVE, ...TAB_IDLE);
    b.classList.add(...(active ? TAB_ACTIVE : TAB_IDLE));
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.querySelectorAll(".pill-btn").forEach((b) => {
    const active = b.dataset.freq === state.freq;
    b.classList.remove(...PILL_ACTIVE, ...PILL_IDLE);
    b.classList.add(...(active ? PILL_ACTIVE : PILL_IDLE));
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

// ────────────────────────────────────────────────
// Filtering + rendering
// ────────────────────────────────────────────────

// Date-only key (YYYY-MM-DD) from a timestamp, ignoring timezones
const dayKey = (v) => String(v || "").slice(0, 10);
const dayNum = (v) => Date.parse(dayKey(v) + "T00:00:00Z") / 86400000;

// Every typed word must appear somewhere in the report's text fields
function matchesQuery(r, q) {
  const text = [r.name, r.description, r.report_type, r.sector_name]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => text.includes(word));
}

function getFiltered() {
  const q = state.query.trim().toLowerCase();
  const searching = q.length > 0;
  const freq = norm(state.freq); // "all" | "daily" | "weekly" | "market-wide"

  return allResearch.filter((r) => {
    if (searching && !matchesQuery(r, q)) return false;

    // Tag filter: compares the report_type column (Daily / Weekly / Market-wide)
    if (freq !== "all" && norm(r.report_type) !== freq) return false;

    // Market-wide reports ignore the sector tab; a search also spans all sectors
    if (searching || freq === "market-wide") return true;

    return r.sector_name === state.sector;
  });
}

function clearSearch() {
  state.query = "";
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  render();
}

// "3 results for “ffc” across all sectors  ·  Clear search"
function renderSearchNote(container, count) {
  const q = state.query.trim();
  if (!q) return;

  const note = document.createElement("div");
  note.className =
    "flex flex-wrap items-center justify-between gap-3 text-[15px] text-muted-body";

  const text = document.createElement("span");
  text.textContent = `${count} result${count === 1 ? "" : "s"} for “${q}” across all sectors`;

  const clear = document.createElement("button");
  clear.type = "button";
  clear.className =
    "bg-transparent border-0 p-0 font-semibold font-sans text-[15px] text-accent hover:text-accent-dark underline cursor-pointer";
  clear.textContent = "Clear search";
  clear.addEventListener("click", clearSearch);

  note.append(text, clear);
  container.appendChild(note);
}

function render() {
  updateControls();

  const container = document.getElementById("researchContainer");
  const items = getFiltered();

  container.innerHTML = "";

  if (loadFailed) {
    const err = document.createElement("p");
    err.className = ERROR_CLASS;
    err.textContent =
      "Research reports could not be loaded. Please refresh the page or try again later.";
    container.appendChild(err);
    renderTrending();
    return;
  }

  renderSearchNote(container, items.length);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = NOTE_CLASS;
    empty.textContent = state.query.trim()
      ? "No reports match your search"
      : "No research documents found";
    container.appendChild(empty);
  } else {
    items.forEach((item) => container.appendChild(createResearchCard(item)));
  }

  renderTrending();
}

function createResearchCard(item) {
  const title = item.name || "Untitled Document";
  const url = resolvePdfUrl(item.pdf_url);

  const card = document.createElement("article");
  card.className =
    "border border-line bg-white hover:border-line-dash p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5";

  // Left side: meta line (type · sector · date), title, description
  const info = document.createElement("div");
  info.className = "min-w-0 flex flex-col gap-2";

  const meta = document.createElement("span");
  meta.className = "text-[13px] text-wine font-semibold";
  meta.textContent = [item.report_type, item.sector_name, formatDate(item.created_at)]
    .filter(Boolean)
    .join(" · ");

  const h3 = document.createElement("h3");
  h3.className = "m-0 font-serif font-normal text-[22px] leading-[1.3] text-ink";
  h3.textContent = title;

  info.appendChild(meta);
  info.appendChild(h3);

  if (item.short_desc) {
    const desc = document.createElement("p");
    desc.className = "m-0 text-[15px] text-muted-body";
    desc.textContent = item.short_desc;
    info.appendChild(desc);
  }

  // Right side: buttons
  const actions = document.createElement("div");
  actions.className = "flex flex-wrap gap-3 shrink-0";

  const read = document.createElement("a");
  read.href = url;
  read.target = "_blank";
  read.rel = "noopener";
  read.className =
    "border border-ink text-ink hover:bg-mist no-underline px-[21px] py-[12px] rounded font-semibold text-[15px]";
  read.textContent = "Read report";

  const dl = document.createElement("button");
  dl.type = "button";
  dl.className =
    "bg-accent hover:bg-accent-dark text-white border-0 px-[22px] py-[13px] rounded font-semibold font-sans text-[15px] cursor-pointer disabled:opacity-60";
  dl.textContent = "Download PDF";
  dl.addEventListener("click", () =>
    downloadPdf(url, makeFileName(title, url), dl),
  );

  actions.appendChild(read);
  actions.appendChild(dl);

  card.appendChild(info);
  card.appendChild(actions);
  return card;
}

// ────────────────────────────────────────────────
// Trending sidebar
// ────────────────────────────────────────────────
function renderTrending() {
  const list = document.getElementById("trendingList");
  list.innerHTML = "";

  // Latest 5 reports of the selected sector (ignores the Daily/Weekly pills and search)
  const top = allResearch
    .filter((r) => r.sector_name === state.sector)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (top.length === 0) {
    list.innerHTML = `<li class="text-[15px] text-muted py-3">No reports yet</li>`;
    return;
  }

  top.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = `flex gap-3 py-3 ${i < top.length - 1 ? "border-b border-line" : ""}`;

    const num = document.createElement("span");
    num.className = "font-serif text-[15px] font-semibold text-wine";
    num.textContent = i + 1;

    const a = document.createElement("a");
    a.href = resolvePdfUrl(item.pdf_url);
    a.target = "_blank";
    a.rel = "noopener";
    a.className =
      "text-[15px] leading-[1.45] text-ink no-underline hover:text-accent hover:underline";
    a.textContent = item.name || "Untitled Document";

    li.appendChild(num);
    li.appendChild(a);
    list.appendChild(li);
  });
}

// ────────────────────────────────────────────────
// Download helpers
// ────────────────────────────────────────────────
function makeFileName(title, url) {
  let name = (title || "").trim();
  if (!name && url) {
    try {
      name = decodeURIComponent(
        url
          .split("?")[0]
          .split("/")
          .pop()
          .replace(/\.pdf$/i, ""),
      );
    } catch (e) {}
  }
  name = name.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-") || "document";
  return /\.pdf$/i.test(name) ? name : name + ".pdf";
}

function triggerSave(href, fileName) {
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Supabase storage sends Content-Disposition: attachment when ?download= is set
function withDownloadParam(url, fileName) {
  try {
    const u = new URL(url, window.location.href);
    if (
      u.hostname.endsWith(".supabase.co") &&
      u.pathname.includes("/storage/v1/object/")
    ) {
      u.searchParams.set("download", fileName);
      return u.toString();
    }
  } catch (e) {}
  return url;
}

async function downloadPdf(url, fileName, btn) {
  if (!url || url === "#") return;

  const originalLabel = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Downloading...";
  }

  const downloadUrl = withDownloadParam(url, fileName);

  try {
    const res = await fetch(downloadUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + downloadUrl);

    const type = res.headers.get("content-type") || "";
    if (type.includes("text/html")) {
      throw new Error("Server returned HTML instead of a PDF: " + downloadUrl);
    }

    const blob = new Blob([await res.blob()], {
      type: "application/octet-stream",
    });
    const blobUrl = URL.createObjectURL(blob);
    triggerSave(blobUrl, fileName);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.error("Download failed:", err);

    // Fallbacks when fetch is blocked (CORS, network)
    const u = new URL(downloadUrl, window.location.href);
    const sameOrigin =
      u.origin !== "null" && u.origin === window.location.origin;

    if (sameOrigin || u.searchParams.has("download")) {
      triggerSave(u.toString(), fileName); // Supabase forces attachment
    } else {
      window.open(u.toString(), "_blank", "noopener");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  }
}
