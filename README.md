# 👁️ FOMO — 每日 AI 信息源追踪

> 每日 10 分钟，依次过一遍 AI 时代最重要的信息源，重要的事大概率不会错过了。

FOMO（Fear Of Missing Out）是一个**纯前端**的每日 AI 信息源清单页。把分散在各处的优质 AI 信息源（新闻、博客、模型榜单）按分类整理成一份"每日清单"，每天睡前低功耗过一遍，每看一个标记完成，告别漫无目的的报复式刷信息焦虑。

灵感来自一个朴素的日常：在飞书列一个清单，每天依次点开、标记完成。FOMO 就是这份清单的网页版，并对部分源做内容预览，省去点开即可扫一眼有没有新东西。

## ✨ 特性

- 🗂️ **三大分类**：新闻 / 博客 / 模型，精选 8 个高价值信息源
- 👀 **内容预览**：OpenRouter 新模型实时预览；Anthropic / OpenAI 尝试抓取最新条目
- ✅ **每日完成追踪**：点一个记一个，顶部进度环显示今日完成度
- 🔥 **连续打卡天数**：靠每日完成记录自动计算 streak
- 🔒 **纯本地存储**：完成状态保存在浏览器 localStorage，不上传任何信息，无需登录
- 📱 **响应式深色主题**：桌面 / 移动端皆可

## 📋 信息源

| 分类 | 来源 | 说明 |
|------|------|------|
| 新闻 | [Twitter / X](https://x.com/) | AI 最新消息发源地 |
| 新闻 | [AIHOT](https://aihot.virxact.com/) | 卡兹克整理的全网每日热点 |
| 博客 | [Anthropic Research](https://www.anthropic.com/research) | A 社官方研究 |
| 博客 | [OpenAI Research](https://openai.com/research/) | O 社官方研究 |
| 模型 | [OpenRouter Models](https://openrouter.ai/models) | 新模型收录入口 |
| 模型 | [LLM Stats](https://llm-stats.com/llm-updates) | 最新模型发布时间线 |
| 模型 | [Artificial Analysis](https://artificialanalysis.ai/) | SOTA 水平与趋势 |
| 模型 | [LMArena](https://arena.ai/leaderboard/code/webdev) | 大模型盲测竞技场 |

> 想增减信息源？编辑 [`src/sources.ts`](src/sources.ts) 即可，结构清晰，几行就能加一个。

## 🚀 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 类型检查 + 生产构建
npm run preview  # 本地预览构建产物
```

技术栈：**Vite + React + TypeScript + Tailwind CSS v4**。

## 🌐 部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 分支即触发部署：

🔗 在线访问：<https://chasen-liao.github.io/FOMO/>

> `vite.config.ts` 中的 `base: '/FOMO/'` 对应仓库名，若 fork 后改名，请同步修改。

## 🛠️ 工作原理

- **页面**：单页应用，三个分类区块 + 卡片网格
- **内容预览**：
  - OpenRouter：客户端直连公开 API `/v1/models`，取最新模型
  - Anthropic / OpenAI：通过公共 CORS 代理抓取 RSS，失败时优雅降级为纯启动器
- **完成追踪**：按日期 key（`fomo:YYYY-MM-DD`）写入 localStorage，跨天自动重置，历史记录用于计算连续打卡

## 📄 许可

MIT
