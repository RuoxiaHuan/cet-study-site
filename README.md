# CET 四六级学习站

**在线地址：https://ruoxiahuan.github.io/cet-study-site/**
仓库：[RuoxiaHuan/cet-study-site](https://github.com/RuoxiaHuan/cet-study-site)

纯前端静态网站，选四级 / 六级，每天学新词、按间隔重复复习，配例句发音和真题题型练习。学习进度存在浏览器本地，不需要账号和服务器。

## 功能

| 模块 | 说明 |
|---|---|
| 首页 | 今日学习计划、待复习数量、已学/掌握/打卡统计、最近 7 天柱状图 |
| 学习 | 单词卡（英美音标、真人发音、释义、例句、常用词组、真题例题）+ 三档评价（不认识/模糊/认识） |
| 复习 | 按 SM-2 间隔重复算法挑出到期单词，答错的词 10 分钟后重新出现 |
| 单词历史 | 按首次学习日期分组列出所有学过的词，支持搜索释义、按「今天 / 近 7 天 / 已掌握 / 易忘」筛选，点任意单词展开完整详情反复回看 |
| 题型练习 | 词汇单选（词库真题例题，带逐题解析）、仔细阅读 8 篇、选词填空 4 篇（15 选 10）、长篇阅读段落匹配 4 篇 |
| 生词本 | 学习时点 ☆ 收藏，随时回看 |
| 错题本 | 做错的词条与题目自动记录，可移除或清空 |
| 统计 | 词库进度、学习中/复习中/已掌握分布、7 天趋势、今日单词数 |
| 设置 | 每日新词数、词库切换、口音切换、进度导出/导入/清空 |

## 数据

| 词库 | 词数 | 带音标 | 带例句 | 带真题例题 |
|---|---:|---:|---:|---:|
| 四级 | 4216 | 4216 | 4140 | 251 |
| 六级 | 3475 | 3475 | 3403 | 264 |

- 单词数据来自开源项目 [kajweb/dict](https://github.com/kajweb/dict)（源自有道背单词词书），含英/美音标、中文释义、例句中英对照、常用词组、真题例题及解析。首次导入后仍有 36 个词缺音标（专有名词、合成词、拼写变体），由 `scripts/fix_missing_phonetics.py` 用人工对照表补齐，现已 100% 覆盖；同时修正了源数据中 `reservior → reservoir` 的拼写错误。
- 发音走有道词典公开接口 `https://dict.youdao.com/dictvoice?audio=单词&type=1|2`（1 英音 / 2 美音），句子用浏览器 TTS 合成。
- 阅读理解、选词填空、长篇阅读匹配三段题库为**本项目原创编写**，对标四六级题型与难度，不含任何真题版权内容。

## 本地运行

不能直接双击 `index.html`——浏览器会因 CORS 拒绝读取本地 JSON。必须用 HTTP 方式打开：

```bash
# 方式一：Python（自带即可）
cd cet-study-site
python -m http.server 8765
# 然后浏览器打开 http://127.0.0.1:8765/

# 方式二：Node
npx serve .
```

## 部署到 GitHub Pages

```bash
cd cet-study-site
git init
git add .
git commit -m "CET 四六级学习站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面：**Settings → Pages → Build and deployment → Source 选 `Deploy from a branch`，Branch 选 `main`、目录选 `/ (root)`，Save**。

一两分钟后访问 `https://<你的用户名>.github.io/<仓库名>/`。

> `.nojekyll` 文件已放在根目录，作用是让 GitHub Pages 跳过 Jekyll 处理，避免以 `_` 开头的文件被忽略。

### 子路径部署说明

本站所有资源都用**相对路径**引用（`src/...`、`data/...`），所以部署在 `https://xxx.github.io/repo-name/` 这种子路径下也能正常工作，不需要改配置。

## 重新生成词库

想更新词库或加别的词书，改 `scripts/import_words.py` 里的 `BOOKS` 再跑：

```bash
python scripts/import_words.py
```

脚本会从 kajweb/dict 下载对应 zip、解析 JSONL、按单词合并同级多本词书，输出 `data/words-cet4.json`、`data/words-cet6.json` 和 `data/index.json`。

## 自测

```bash
# 算法与题库完整性（间隔重复、存储层、答案下标、空位与备选词一致性）
node scripts/selftest.js

# 各页面渲染输出（桩 DOM）
node scripts/render-test.js
```

## 目录结构

```
cet-study-site/
├── index.html              入口
├── .nojekyll               GitHub Pages 配置
├── src/
│   ├── style.css           样式（含深色模式、响应式）
│   ├── store.js            本地存储层（进度/生词本/错题本/统计）
│   ├── srs.js              间隔重复算法（SM-2 简化版）
│   ├── audio.js            发音（有道接口 + TTS 降级）
│   ├── data.js             词库加载与缓存
│   ├── util.js             HTML 转义、高亮、洗牌等
│   ├── quiz-data.js        原创题库
│   ├── quiz.js             题型练习
│   ├── pages.js            各页面渲染
│   └── app.js              路由与启动
├── data/
│   ├── index.json          词库索引
│   ├── words-cet4.json     四级词库
│   └── words-cet6.json     六级词库
└── scripts/
    ├── import_words.py             词库导入
    ├── fill_phonetics.py           从其它词书补齐音标
    ├── fix_missing_phonetics.py    人工补齐剩余音标 + 修正拼写
    ├── selftest.js                 逻辑自测
    └── render-test.js              渲染自测
```

## 已知限制

- 学习进度存在浏览器 `localStorage`，清除浏览器数据会丢失，换设备不会同步。**建议定期用「设置 → 导出进度」备份。**
- 首次进入某个等级需下载约 2.5 MB（四级）/ 1.9 MB（六级）词库 JSON，之后走浏览器缓存。
- 发音依赖有道公开接口，离线状态自动降级为浏览器 TTS。
- 题库规模：仔细阅读 8 篇（40 题）、选词填空 4 篇（40 空）、长篇阅读匹配 4 篇（40 题），四级六级各半。继续扩充时按同一结构往 `src/quiz-data.js` 对应数组里追加即可，跑 `node scripts/selftest.js` 会自动校验空位数、答案下标与备选词一致性。
