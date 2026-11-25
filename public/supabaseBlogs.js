const supabaseUrl = "https://bfxmfaakufrmzcxhtgfw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeG1mYWFrdWZybXpjeGh0Z2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQzMTIsImV4cCI6MjA3NTM5MDMxMn0.qtNn0qXNhn8ol8fTSb2Hp9nQkYfFA2Y_Zec4LuISPZQ";

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === "undefined") {
    console.warn("supabase global not ready yet, waiting...");
    setTimeout(initSupabase, 100);
    return;
  }

  const { createClient } = supabase;
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client initialized!", supabaseClient);

  // Load the article list once the client exists
  loadBlogs();
}

// ────────────────────────────────────────────────
// Presentation helpers (revamp design)
// ────────────────────────────────────────────────
const BLOG_NOTE_CLASS =
  "col-span-full m-0 border border-line bg-white p-6 text-[15px] text-muted-body";
const BLOG_ERROR_CLASS =
  "col-span-full m-0 border border-line border-l-4 border-l-signal-red bg-white p-6 text-[15px] text-ink";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Plain-text excerpt from the article body (desc holds rich-text HTML).
// DOMParser does not run scripts or load images.
function excerpt(html, max = 150) {
  if (!html) return "";
  const text = (new DOMParser().parseFromString(String(html), "text/html").body
    .textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Swaps a broken or missing image for a neutral placeholder block
function imageFallback(img) {
  const box = document.createElement("div");
  box.className = "h-[200px] bg-placeholder flex items-center justify-center text-muted text-sm";
  box.textContent = "IEL article";
  img.replaceWith(box);
}

async function loadBlogs() {
  const container = document.getElementById("blog-container");
  const loading = document.getElementById("loading");

  if (!container) return;

  container.innerHTML = ""; // clear previous content
  loading?.classList.remove("hidden"); // show loading

  try {
    const { data: blogs, error } = await supabaseClient
      .from("blogs")
      .select("title, img, desc, id")
      .order("created_at", { ascending: false }); // newest first – change to 'created_at' if you have that column

    if (error) throw error;

    if (!blogs || blogs.length === 0) {
      container.innerHTML = `<p class="${BLOG_NOTE_CLASS}">No articles published yet.</p>`;
      return;
    }

    blogs.forEach((blog) => {
      const title = blog.title || "Untitled";
      const summary = excerpt(blog.desc);

      const card = document.createElement("a");
      card.href = `NewBlogDetail.html?id=${encodeURIComponent(blog.id)}`;
      card.className =
        "group no-underline text-ink bg-white border border-line hover:border-line-dash flex flex-col";

      card.innerHTML = `
        ${
          blog.img
            ? `<img src="${escapeHtml(blog.img)}" alt="" loading="lazy" class="w-full h-[200px] object-cover border-b border-line" />`
            : `<div class="h-[200px] bg-placeholder flex items-center justify-center text-muted text-sm">IEL article</div>`
        }
        <div class="p-6 md:p-7 flex flex-col gap-2.5 flex-1">
          <span class="text-[13px] text-wine font-semibold">Article</span>
          <h3 class="m-0 font-serif font-normal text-[22px] leading-[1.3]">${escapeHtml(title)}</h3>
          ${summary ? `<p class="m-0 text-sm text-muted-body">${escapeHtml(summary)}</p>` : ""}
          <span class="mt-auto pt-2 text-sm font-semibold text-accent group-hover:underline">Read article →</span>
        </div>
      `;

      const img = card.querySelector("img");
      if (img) img.addEventListener("error", () => imageFallback(img), { once: true });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading blogs:", err);
    container.innerHTML = `<p class="${BLOG_ERROR_CLASS}">Articles could not be loaded. Please try again later.</p>`;
  } finally {
    loading?.classList.add("hidden");
  }
}

// Start once everything above is defined
initSupabase();
