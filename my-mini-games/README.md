# My Mini Games

個人網頁小遊戲收藏平台，使用 HTML、CSS、JavaScript 製作，並可透過 GitHub Pages 公開。

## 目前包含
- 遊戲收藏首頁
- 關鍵字搜尋與分類篩選
- 貪食蛇（鍵盤與手機觸控操作）

## 新增遊戲
1. 在 `games/` 建立新資料夾，例如 `games/tetris/`。
2. 在資料夾內放入該遊戲的 `index.html`、CSS、JavaScript。
3. 編輯根目錄的 `games.json`，新增一筆遊戲資料：

```json
{
  "id": "tetris",
  "title": "俄羅斯方塊",
  "description": "排列方塊並消除完整橫列。",
  "category": "益智",
  "path": "games/tetris/",
  "emoji": "🧩",
  "status": "可遊玩"
}
```

注意：`games.json` 必須是合法 JSON；多筆遊戲資料之間要用逗號分隔。

## 啟用 GitHub Pages
Repository → Settings → Pages → Build and deployment：
- Source：Deploy from a branch
- Branch：main
- Folder：/(root)
- Save

部署完成後，網站網址格式為：
`https://你的GitHub帳號.github.io/my-mini-games/`

## 注意
這是靜態網站，不包含會員、伺服器資料庫或雲端排行榜。公開 Repository 中的程式碼任何人都能查看及複製；請勿上傳密碼、API 金鑰或私人資料。
