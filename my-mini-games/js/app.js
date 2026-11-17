const grid = document.querySelector("#gameGrid");
const filters = document.querySelector("#categoryFilters");
const search = document.querySelector("#searchInput");
const count = document.querySelector("#gameCount");
const empty = document.querySelector("#emptyState");

let games = [];
let activeCategory = "全部";

async function init() {
  try {
    const response = await fetch("games.json");
    if (!response.ok) throw new Error("games.json 載入失敗");
    games = await response.json();
    renderFilters();
    renderGames();
  } catch (error) {
    count.textContent = "載入失敗";
    grid.innerHTML = '<p class="empty-state">無法載入遊戲清單，請確認 games.json 是否存在。</p>';
    console.error(error);
  }
}

function renderFilters() {
  const categories = ["全部", ...new Set(games.map(game => game.category))];
  filters.innerHTML = categories.map(category =>
    `<button class="filter ${category === activeCategory ? "active" : ""}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`
  ).join("");
  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderGames();
    });
  });
}

function renderGames() {
  const keyword = search.value.trim().toLowerCase();
  const visible = games.filter(game => {
    const matchesCategory = activeCategory === "全部" || game.category === activeCategory;
    const text = `${game.title} ${game.description} ${game.category}`.toLowerCase();
    return matchesCategory && text.includes(keyword);
  });
  count.textContent = `共 ${visible.length} 款遊戲`;
  empty.hidden = visible.length !== 0;
  grid.innerHTML = visible.map(game => `
    <article class="game-card">
      <div class="game-art" aria-hidden="true">${escapeHTML(game.emoji || "🎮")}</div>
      <div class="game-info">
        <div class="game-title-row">
          <span class="game-title">${escapeHTML(game.title)}</span>
          <span class="status">${escapeHTML(game.status || "可遊玩")}</span>
        </div>
        <p class="game-description">${escapeHTML(game.description || "")}</p>
        <a class="play-link" href="${safePath(game.path)}">開始遊玩 →</a>
      </div>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function safePath(path) {
  // 僅允許相對路徑，避免把遊戲清單當成任意外部跳轉入口。
  return String(path || "").replace(/^\/+/, "").replace(/\.\.(\/|\\)/g, "");
}

search.addEventListener("input", renderGames);
init();
