const supabaseUrl  = "https://bfxmfaakufrmzcxhtgfw.supabase.co";
const supabaseKey  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeG1mYWFrdWZybXpjeGh0Z2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQzMTIsImV4cCI6MjA3NTM5MDMxMn0.qtNn0qXNhn8ol8fTSb2Hp9nQkYfFA2Y_Zec4LuISPZQ";

let supabaseClient = null;

// Classes for the empty / error states (revamp design tokens)
const NEWS_NOTE_CLASS = "m-0 border border-line bg-mist p-6 text-[15px] text-muted-body";
const NEWS_ERROR_CLASS =
  "m-0 border border-line border-l-4 border-l-signal-red bg-white p-6 text-[15px] text-ink";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initSupabase() {
  if (typeof supabase === "undefined") {
    console.warn("Supabase JS library not loaded yet — retrying...");
    setTimeout(initSupabase, 200);
    return;
  }

  const { createClient } = supabase;
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client initialized");

  // Now that client is ready → load news
  loadNews();
}

async function loadNews() {
  if (!supabaseClient) {
    console.error("Supabase client not initialized yet");
    document.getElementById('dynamic-news').innerHTML =
      `<p class="${NEWS_ERROR_CLASS}">News could not be loaded. Please refresh the page.</p>`;
    return;
  }

  const { data, error } = await supabaseClient
    .from('news')
    .select('short_des, pdf')
    .order('created_at', { ascending: false })
    .limit(20);   // ← important: prevent fetching thousands of rows

  const container = document.getElementById('dynamic-news');
  if (!container) {
    console.error("Container #dynamic-news not found in DOM");
    return;
  }

  if (error) {
    console.error('Error fetching news:', error);
    container.innerHTML = `<p class="${NEWS_ERROR_CLASS}">News could not be loaded. Please try again later.</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="${NEWS_NOTE_CLASS}">No news available at the moment.</p>`;
    return;
  }

  // One bordered list with 1px dividers; each item is a title and a PDF link
  let html = '<ul class="list-none m-0 p-0 grid gap-px bg-line border border-line">';
  data.forEach(item => {
    const desc    = item.short_des?.trim() || 'Update on Attock Cement Acquisition';
    const pdfLink = item.pdf || '#';

    html += `
      <li class="bg-white p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p class="m-0 font-serif text-[20px] md:text-[22px] leading-[1.35] text-ink max-w-[820px]">
          ${escapeHtml(desc)}
        </p>
        <a href="${escapeHtml(pdfLink)}" target="_blank" rel="noopener"
           class="shrink-0 font-semibold text-[15px] text-accent hover:text-accent-dark underline">
          Download PDF →
        </a>
      </li>
    `;
  });
  html += '</ul>';

  container.innerHTML = html;
}

// Start initialization
initSupabase();
