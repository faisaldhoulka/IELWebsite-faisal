const supabaseUrl = "https://bfxmfaakufrmzcxhtgfw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeG1mYWFrdWZybXpjeGh0Z2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQzMTIsImV4cCI6MjA3NTM5MDMxMn0.qtNn0qXNhn8ol8fTSb2Hp9nQkYfFA2Y_Zec4LuISPZQ";

let supabaseClient = null;

// ────────────────────────────────────────────────
// Tab mapping
// ────────────────────────────────────────────────
const tabMapping = {
  "Economy-tab": {
    contentId: "Economy-content",
    tabValue: "Audited Financials 30 June",
  },
  "Strategy-tab": {
    contentId: "Strategy-content",
    tabValue: "Half Yearly 31 Dec",
  },
  "Sector-tab": {
    contentId: "Sector-content",
    tabValue: "Quarter Ended 30 Sept",
  },
  "Market-tab": {
    contentId: "Market-content",
    tabValue: "Quarter Ended 31 March",
  },
  "lcb-tab": {
    contentId: "lcb-content",
    tabValue: "LCB",
  },
};

// Hard-coded statements (PDFs under public/IEL Assets/PDF/), keyed by the tab's
// content container id. These used to live as rows in NewReport.html and are
// merged with whatever Supabase returns, then re-sorted together.
const STATIC_STATEMENTS = {
  "Economy-content": [
    { title: "IEL Audited Financial Statements June 30 2020", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30 2020.pdf" },
    { title: "IEL Audited Financial Statements June 30 2021", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30 2021.pdf" },
    { title: "IEL Audited Financial Statements June 30 2022", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30, 2022.pdf" },
    { title: "IEL Audited Financial Statements June 30 2023", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30, 2023.pdf" },
    { title: "IEL Audited Financial Statements June 30 2024", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30, 2024.pdf" },
    { title: "IEL Audited Financial Statements June 30 2025", pdfUrl: "IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30 2025.pdf" },
  ],
  "Strategy-content": [
    { title: "Half Yearly 31 December 2020", pdfUrl: "IEL Assets/PDF/Half Yearly 31 Dec/Half Yearly 31 December 2020.pdf" },
    { title: "Half Yearly 31 December 2021", pdfUrl: "IEL Assets/PDF/Half Yearly 31 Dec/Half Yearly 31 December 2021.pdf" },
    { title: "Half Yearly 31 December 2022", pdfUrl: "IEL Assets/PDF/Half Yearly 31 Dec/Half Yearly 31 December 2022.pdf" },
    { title: "Half Yearly 31 December 2023", pdfUrl: "IEL Assets/PDF/Half Yearly 31 Dec/Half Yearly 31 December 2023.pdf" },
    { title: "Half Yearly 31 December 2024", pdfUrl: "IEL Assets/PDF/Half Yearly 31 Dec/Half Yearly 31 December 2024.pdf" },
  ],
  "Sector-content": [
    { title: "FS IEL Period Ended Sept 30, 2020", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2020.pdf" },
    { title: "FS IEL Period Ended Sept 30, 2021", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2021.pdf" },
    { title: "FS IEL Period Ended Sept 30, 2022", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2022.pdf" },
    { title: "FS IEL Period Ended Sept 30, 2023", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2023.pdf" },
    { title: "FS IEL Period Ended Sept 30, 2024", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2024.pdf" },
    { title: "FS IEL Period Ended Sept 30, 2025", pdfUrl: "IEL Assets/PDF/Quarter Ended 30 September/Financial statement  - Sep end 25-merged.pdf" },
  ],
  "Market-content": [
    { title: "FS IEL Period Ended Mar 31, 2021", pdfUrl: "IEL Assets/PDF/Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2021.pdf" },
    { title: "FS IEL Period Ended Mar 31, 2022", pdfUrl: "IEL Assets/PDF/Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2022.pdf" },
    { title: "FS IEL Period Ended Mar 31, 2023", pdfUrl: "IEL Assets/PDF/Quarter Ended 31 March/FS IEL Period Ended  Mar 31, 2023.pdf" },
    { title: "FS IEL Period Ended Mar 31, 2024", pdfUrl: "IEL Assets/PDF/Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2024.pdf" },
    { title: "FS IEL Period Ended Mar 31, 2025", pdfUrl: "IEL Assets/PDF/Quarter Ended 31 March/March 2025 - Upload Version.pdf" },
  ],
  "lcb-content": [
    { title: "LCB July 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/1-LCB July 2020.pdf" },
    { title: "LCB Aug 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/2-LCB Aug 2020.pdf" },
    { title: "September 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/3. September  2020.pdf" },
    { title: "LCB October 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/4. October 2020.pdf" },
    { title: "LCB November 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/5. November  2020.pdf" },
    { title: "LCB December 2020", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/6. December 2020.pdf" },
    { title: "LCB January 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/7. January 2021.pdf" },
    { title: "LCB Feb 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/8. LCB Feb 2021.pdf" },
    { title: "LCB May 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/11. LCB May 2021.pdf" },
    { title: "LCB June 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2021/12. LCB June 2021.pdf" },
    { title: "LCB July 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/1.LCB July 2021.pdf" },
    { title: "LCB Aug 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/2.LCB Aug 2021.pdf" },
    { title: "September 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/3.LCB Sept 2021.pdf" },
    { title: "LCB October 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/4.LCB Oct 2021.pdf" },
    { title: "LCB November 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/5. LCB Nov 2021.pdf" },
    { title: "LCB December 2021", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/6.LCB December 2021.pdf" },
    { title: "LCB January 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/7. LCB Jan 2022.pdf" },
    { title: "LCB Feb 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/8.LCB Feb 2022.pdf" },
    { title: "LCB March 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/9.LCB March 2022.pdf" },
    { title: "LCB June 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2022/12. LCB Jun 2022.pdf" },
    { title: "LCB July 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/1.LCB July 2022.pdf" },
    { title: "LCB Aug 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/2.LCB Aug 2022.pdf" },
    { title: "September 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/3.LCB Sept 2022.pdf" },
    { title: "LCB October 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/4. LCB Oct 2022.pdf" },
    { title: "LCB November 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/5.LCB Nov 2022.pdf" },
    { title: "LCB December 2022", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/6.LCB Dec 2022.pdf" },
    { title: "LCB January 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/7.LCB Jan 2023.pdf" },
    { title: "LCB Feb 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/8.LCB Feb 2023.pdf" },
    { title: "LCB March 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/9.LCB MARCH 2023.pdf" },
    { title: "LCB Apr 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/10.LCB Apr 2023.pdf" },
    { title: "LCB May 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/11.LCB May 2023.pdf" },
    { title: "LCB June 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2023/12.LCB June 2023.pdf" },
    { title: "LCB July 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/1. LCB July 2023.pdf" },
    { title: "LCB Aug 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/2. LCB Aug 2023.pdf" },
    { title: "September 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/3. LCB Sept 2023.pdf" },
    { title: "LCB October 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/4. LCB OCT 2023.pdf" },
    { title: "LCB November 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/5. LCB NOV 2023.pdf" },
    { title: "LCB December 2023", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/6. LCB Dec 2023.pdf" },
    { title: "LCB January 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/7. LCB  JAN 2024.pdf" },
    { title: "LCB Feb 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/8. LCB FEB 2024.pdf" },
    { title: "LCB March 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/9. LCB THIMS MAR 2024.pdf" },
    { title: "LCB Apr 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/10.LCB THIMS APR 2024.pdf" },
    { title: "LCB May 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/11.LCB THIMS MAY 2024.pdf" },
    { title: "LCB June 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2024/12. LCB THIMS JUNE 2024.pdf" },
    { title: "LCB thims July 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/1.LCB THIMS JULY 2024.pdf" },
    { title: "LCB thims Aug 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/2. LCB THIMS AUG 2024.pdf" },
    { title: "LCB thims September 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/3.LCB THIMS SEP 2024.pdf" },
    { title: "LCB thims October 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/4.LCB THIMS OCT 2024.pdf" },
    { title: "LCB thims November 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/5.LCB THIMS NOV 2024.pdf" },
    { title: "LCB thims December 2024", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/6.LCB THIMS DEC 2024.pdf" },
    { title: "LCB thims January 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/7. LCB THIMS January 2025.pdf" },
    { title: "LCB thims Feb 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/8. LCB THIMS February 2025.pdf" },
    { title: "LCB thims March 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/9.LCB THIMS MARCH 25.pdf" },
    { title: "LCB thims Apr 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/10.LCB THIMS APRIL 25.pdf" },
    { title: "LCB thims May 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/11.LCB THIMS MAY 25.pdf" },
    { title: "LCB thims June 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/12. LCB THIMS JUNE 25.pdf" },
    { title: "LCB thims July 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/LCB THIMS JULY 25.pdf" },
    { title: "LCB thims Aug 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/LCB THIMS AUG 25.pdf" },
    { title: "LCB thims September 2025", pdfUrl: "IEL Assets/PDF/LCB/Liquid Capital Balance -September 2025.pdf" },
    { title: "LCB thims October 2025", pdfUrl: "IEL Assets/PDF/LCB/Liquid Capital Balance -October 2025.pdf" },
    { title: "LCB thims December 2025", pdfUrl: "IEL Assets/PDF/LCB/FY 2025/LCB December 2025.pdf" },
  ],
};

// Rows rendered per tab before Supabase data arrives (filled on load).
const staticData = {};

// ────────────────────────────────────────────────
// Date parsing helper
// ────────────────────────────────────────────────
// Titles look like "IEL Audited Financial Statements June 30 2020",
// "LCB July 2020", "FS IEL Period Ended Sept 30, 2020", etc. There is no
// dedicated date column for the hard-coded rows (and the Supabase table only
// has short_des/pdf/tab/created_at), so we derive a sortable Date from the
// title text itself. If a row ever provides a real `date` value (e.g. a
// future `statement_date` column in Supabase), that value is preferred over
// this parser — see mapSupabaseItem() below.
const MONTH_LOOKUP = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseDateFromTitle(title) {
  if (!title) return null;
  const text = title.toLowerCase();

  const yearMatch = text.match(/(20\d{2})/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);

  let month = 0;
  for (const key in MONTH_LOOKUP) {
    const re = new RegExp("\\b" + key + "\\b");
    if (re.test(text)) {
      month = MONTH_LOOKUP[key];
      break;
    }
  }

  let day = 1;
  const dayMatches = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/g);
  if (dayMatches) {
    for (const d of dayMatches) {
      const num = parseInt(d, 10);
      if (num >= 1 && num <= 31 && d !== yearMatch[1]) {
        day = num;
        break;
      }
    }
  }

  return new Date(year, month, day);
}

function getItemDate(item) {
  return item.date || parseDateFromTitle(item.title) || new Date(0);
}

// ────────────────────────────────────────────────
// Financial year helpers
// ────────────────────────────────────────────────
// The financial year runs 1 July to 30 June and is named by the two calendar
// years it spans: Jul 2026 - Jun 2027 is "FY 2026-27".

// Returns the calendar year in which the financial year of `date` starts.
// JavaScript months are 0-based: 6 = July.
function fiscalYearStart(date) {
  return date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

// 2026 -> "FY 2026-27"
function fiscalYearLabel(startYear) {
  const endYY = String((startYear + 1) % 100).padStart(2, "0");
  return `FY ${startYear}-${endYY}`;
}

function sortNewestFirst(items) {
  return items.slice().sort((a, b) => getItemDate(b) - getItemDate(a));
}

function makeFileName(title, url) {
  let name = (title || "").trim();
  if (!name && url) {
    name = decodeURIComponent(
      url
        .split("?")[0]
        .split("/")
        .pop()
        .replace(/\.pdf$/i, ""),
    );
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
function resolveUrl(url) {
  // Encodes spaces and special characters in static paths like
  // "IEL Assets/PDF/Half Yearly 31 Dec/..."
  return new URL(url, window.location.href).href;
}

async function downloadPdf(url, fileName, btn) {
  if (!url || url === "#") return;

  const originalLabel = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Downloading...";
  }

  const downloadUrl = withDownloadParam(resolveUrl(url), fileName);

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

    const u = new URL(downloadUrl);
    // "null" origin (file://) must NOT count as same-origin
    const sameOrigin =
      u.origin !== "null" && u.origin === window.location.origin;

    if (sameOrigin || u.searchParams.has("download")) {
      triggerSave(downloadUrl, fileName);
    } else {
      window.open(downloadUrl, "_blank", "noopener");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  }
}
// ────────────────────────────────────────────────
// Rendering: every tab is grouped by financial year (Jul-Jun), newest first.
// Each year is a collapsible card holding a Description | PDF table.
// ────────────────────────────────────────────────
const PDF_ICON =
  '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5"></path></svg>';

function createStatementRow(item) {
  const tr = document.createElement("tr");
  tr.className = "fs-row border-t border-line hover:bg-mist";
  tr.dataset.search = (item.title || "").toLowerCase();

  const tdTitle = document.createElement("td");
  tdTitle.className = "px-5 md:px-6 py-4 text-[15px] text-ink align-top";
  tdTitle.textContent = item.title || "Untitled Document";

  const tdPdf = document.createElement("td");
  tdPdf.className = "px-5 md:px-6 py-4 align-top text-right whitespace-nowrap";

  const link = document.createElement("a");
  link.className =
    "inline-flex items-center gap-1.5 text-accent hover:text-accent-dark font-semibold text-[15px] underline";
  link.setAttribute("aria-label", `View PDF: ${item.title || "document"}`);
  link.href = item.pdfUrl ? resolveUrl(item.pdfUrl) : "#";
  link.target = "_blank";
  link.rel = "noopener";
  link.innerHTML = PDF_ICON + "<span>View PDF</span>";

  tdPdf.appendChild(link);
  tr.appendChild(tdTitle);
  tr.appendChild(tdPdf);
  return tr;
}

function groupByFinancialYear(items) {
  const groups = {};
  items.forEach((item) => {
    const d = getItemDate(item);
    if (d.getTime() === 0) {
      console.warn("Statement title has no readable year:", item.title);
    }
    const year = fiscalYearStart(d);
    (groups[year] = groups[year] || []).push(item);
  });
  return groups;
}

function applySearch(container, query) {
  const q = query.trim().toLowerCase();
  let anyVisible = false;

  container.querySelectorAll(".fs-section").forEach((section) => {
    const label = section.dataset.label.toLowerCase();
    const sectionMatches = q && label.includes(q);
    let visibleRows = 0;

    section.querySelectorAll(".fs-row").forEach((row) => {
      const show = !q || sectionMatches || row.dataset.search.includes(q);
      row.classList.toggle("hidden", !show);
      if (show) visibleRows++;
    });

    section.classList.toggle("hidden", visibleRows === 0);
    if (visibleRows > 0) anyVisible = true;

    const panel = section.querySelector(".fs-panel");
    const chevron = section.querySelector(".fs-chevron");
    const header = section.querySelector(".fs-header");
    if (q && visibleRows > 0) {
      panel.classList.remove("hidden");
      chevron.classList.add("rotate-180");
      header.setAttribute("aria-expanded", "true");
    } else if (!q) {
      const open = section.dataset.defaultOpen === "1";
      panel.classList.toggle("hidden", !open);
      chevron.classList.toggle("rotate-180", open);
      header.setAttribute("aria-expanded", open ? "true" : "false");
    }
    const count = section.querySelector(".fs-count");
    count.textContent = `${visibleRows} document${visibleRows === 1 ? "" : "s"}`;
  });

  const empty = container.querySelector(".fs-empty");
  if (empty) empty.classList.toggle("hidden", anyVisible);
}

function renderTab(contentId, tabValue, items) {
  const container = document.getElementById(contentId);
  if (!container) return;
  container.innerHTML = "";

  // Search box (visible label; id is unique per tab)
  const inputId = `fs-search-${contentId}`;
  const searchWrap = document.createElement("div");
  searchWrap.className = "mb-6 flex flex-col gap-1.5";
  const searchLabel = document.createElement("label");
  searchLabel.htmlFor = inputId;
  searchLabel.className = "text-sm font-medium text-ink";
  searchLabel.textContent = "Search statements";
  const input = document.createElement("input");
  input.type = "search";
  input.id = inputId;
  input.placeholder = "Title or year, e.g. 2024-25";
  input.className =
    "h-[46px] w-full sm:w-[360px] border border-line rounded px-3 text-[15px] text-ink font-sans bg-white focus:outline-none focus:border-accent";
  searchWrap.appendChild(searchLabel);
  searchWrap.appendChild(input);
  container.appendChild(searchWrap);

  const groups = groupByFinancialYear(items);
  const years = Object.keys(groups).sort((a, b) => b - a);

  years.forEach((year, index) => {
    const yearItems = sortNewestFirst(groups[year]);
    const isOpen = index === 0; // newest year starts expanded
    const label = fiscalYearLabel(Number(year));

    const section = document.createElement("div");
    section.className = "fs-section mb-4 border border-line bg-white";
    section.dataset.label = label;
    section.dataset.defaultOpen = isOpen ? "1" : "0";

    const panelId = `${contentId}-fy-${year}`;

    const header = document.createElement("button");
    header.type = "button";
    header.className =
      "fs-header w-full flex justify-between items-center gap-4 px-5 py-4 md:px-6 bg-white hover:bg-mist border-0 text-left font-sans text-ink cursor-pointer";
    header.setAttribute("aria-expanded", isOpen ? "true" : "false");
    header.setAttribute("aria-controls", panelId);
    header.innerHTML = `
      <span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span class="font-serif font-medium text-[22px] text-pine">${label}</span>
        <span class="fs-count text-[13px] text-wine font-semibold">${yearItems.length} document${yearItems.length === 1 ? "" : "s"}</span>
      </span>
      <svg class="fs-chevron w-5 h-5 shrink-0 text-accent transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>`;

    const panel = document.createElement("div");
    panel.id = panelId;
    panel.className = `fs-panel overflow-x-auto border-t border-line ${isOpen ? "" : "hidden"}`;

    const table = document.createElement("table");
    table.className = "w-full border-collapse text-left";
    table.innerHTML = `
      <thead>
        <tr>
          <th scope="col" class="bg-mist px-5 md:px-6 py-3 text-[13px] font-semibold text-ink">Description</th>
          <th scope="col" class="bg-mist px-5 md:px-6 py-3 text-[13px] font-semibold text-ink text-right">PDF</th>
        </tr>
      </thead>`;
    const tbody = document.createElement("tbody");
    yearItems.forEach((item) => tbody.appendChild(createStatementRow(item)));
    table.appendChild(tbody);
    panel.appendChild(table);

    header.addEventListener("click", () => {
      const nowHidden = panel.classList.toggle("hidden");
      header.querySelector(".fs-chevron").classList.toggle("rotate-180", !nowHidden);
      header.setAttribute("aria-expanded", nowHidden ? "false" : "true");
    });

    section.appendChild(header);
    section.appendChild(panel);
    container.appendChild(section);
  });

  const empty = document.createElement("p");
  empty.className = `fs-empty m-0 border border-line bg-mist p-6 text-[15px] text-muted-body ${years.length ? "hidden" : ""}`;
  empty.textContent = years.length
    ? "No documents match your search."
    : "No documents published yet.";
  container.appendChild(empty);

  input.addEventListener("input", () => applySearch(container, input.value));
}

// ────────────────────────────────────────────────
// Render the hard-coded rows immediately (no need to wait on the network for
// this part); Supabase rows are merged in when they arrive.
// ────────────────────────────────────────────────
function captureAndRenderStatic() {
  Object.values(tabMapping).forEach(({ contentId, tabValue }) => {
    const container = document.getElementById(contentId);
    if (!container) return;

    const rows = (STATIC_STATEMENTS[contentId] || []).slice();
    staticData[contentId] = rows;
    renderTab(contentId, tabValue, rows);
  });
}

captureAndRenderStatic();

// ────────────────────────────────────────────────
// Supabase init + fetch (merges with staticData once loaded)
// ────────────────────────────────────────────────
function initSupabase() {
  if (typeof supabase === "undefined") {
    console.warn("Supabase global not ready yet, waiting...");
    setTimeout(initSupabase, 100);
    return;
  }

  try {
    const { createClient } = supabase;
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized!", supabaseClient);
    loadFinancialStatements();
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
  }
}

initSupabase();

// "2026-07-01" -> local-time Date. new Date("2026-07-01") would read it as
// midnight UTC, which is 30 June for visitors west of UTC and would move the
// document into the previous financial year.
function parseStatementDate(value) {
  if (!value) return null;
  const [y, m, d] = String(value).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function mapSupabaseItem(item) {
  return {
    title: item.short_des,
    pdfUrl: item.pdf,
    // Prefer a real date column if one exists (e.g. a future
    // "statement_date" field) — falls back to parsing short_des otherwise.
    date: parseStatementDate(item.statement_date),
  };
}

async function loadFinancialStatements() {
  if (!supabaseClient) {
    console.error(
      "Cannot load financial statements: Supabase client is not initialized.",
    );
    return;
  }

  try {
    console.log("Loading financial statements from Supabase...");

    const { data, error } = await supabaseClient
      .from("finanicial_statements")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("No additional documents in Supabase");
      return;
    }

    console.log(
      `Successfully loaded ${data.length} financial statements`,
      data,
    );

    const grouped = {};
    data.forEach((item) => {
      const tabKey = item.tab;
      if (!grouped[tabKey]) grouped[tabKey] = [];
      grouped[tabKey].push(mapSupabaseItem(item));
    });

    Object.values(tabMapping).forEach(({ contentId, tabValue }) => {
      const dynamicItems = grouped[tabValue] || [];
      if (dynamicItems.length === 0) return;

      const merged = (staticData[contentId] || []).concat(dynamicItems);
      renderTab(contentId, tabValue, merged);
    });
  } catch (err) {
    console.error("Failed to load Supabase financial statements:", err);
    showLoadWarning();
  }
}

// Shown above each tab's list when the Supabase rows could not be fetched;
// the hard-coded rows stay visible.
function showLoadWarning() {
  Object.values(tabMapping).forEach(({ contentId }) => {
    const container = document.getElementById(contentId);
    if (!container || container.querySelector(".fs-warning")) return;
    const note = document.createElement("p");
    note.className =
      "fs-warning m-0 mb-6 border border-line border-l-4 border-l-signal-red bg-white p-4 text-[15px] text-ink";
    note.setAttribute("role", "status");
    note.textContent =
      "The most recent documents could not be loaded. Please refresh the page or try again later.";
    container.prepend(note);
  });
}
