# FOMO — 每日 AI 信息源追踪页 设计文档

## 背景与目标

FOMO（Fear Of Missing Out）是一个个人用的每日 AI 信息源追踪网页。用户每天睡前依次过一遍分类好的 AI 信息源（新闻、博客、模型榜单），快速判断有没有值得深挖的新内容，标记完成，获得"今天没掉队"的心理踏实感。

来源灵感：用户每日在飞书维护一份清单，依次点开标记完成。FOMO 是这份清单的网页版，并对部分源提供内容预览，省去点开即可扫一眼。

## 核心定位

清单启动器 + 部分源内容预览 + 每日完成追踪。**不是**全量新闻聚合器，也不做内容存储/全文阅读。

## 技术栈

- Next.js 14（App Router）+ TypeScript + Tailwind CSS
- Next.js API 路由（`/api/feeds`）负责服务端抓取 RSS / 公开 API，规避跨域与逻辑暴露
- 完成状态存储：浏览器 localStorage，按日期 key（`fomo:YYYY-MM-DD`）记录当日已完成的源 id 数组
- 部署目标：Vercel

## 信息源清单

分三类，共 8 个源。按"是否有可抓取的 RSS / 公开 API"决定是否提供预览。

### 新闻类
| 源 | URL | 预览 |
|----|-----|------|
| Twitter List | https://x.com/ | 否（需登录，仅启动器） |
| AIHOT | https://aihot.virxact.com/ | 否（仅启动器） |

### 博客类
| 源 | URL | 预览 |
|----|-----|------|
| Anthropic Research | https://www.anthropic.com/research | 是（RSS，最新 3 条） |
| OpenAI Research | https://openai.com/research/ | 是（RSS，最新 3 条） |

### 模型类
| 源 | URL | 预览 |
|----|-----|------|
| OpenRouter Models | https://openrouter.ai/models | 是（公开 API `/v1/models`，最新 3 个） |
| LLM Stats | https://llm-stats.com/llm-updates | 否（仅启动器） |
| Artificial Analysis | https://artificialanalysis.ai/ | 否（仅启动器） |
| Arena | https://arena.ai/leaderboard/code/webdev | 否（仅启动器） |

## 页面布局（深色主题）

- **顶栏**：FOMO logo / 标题 + 今日日期 + 总进度环（`今日 3/8`）
- **主体**：三个分类区块（新闻 / 博客 / 模型），每块为卡片网格
- **卡片**：
  - 源名 + 图标
  - 预览列表（如有）：标题 + 时间，点击在新标签打开原文
  - 无预览的源：直接显示"前往"外链按钮
  - "完成 ✓"按钮，完成后卡片置灰/标记
- **底部**：连续打卡天数（streak），从 localStorage 历史日期 key 计算

## 数据流

1. 页面加载 → 前端调用 `/api/feeds`
2. `/api/feeds` 服务端并发请求所有"有预览"的源（RSS / API），聚合为统一 JSON 返回
3. 前端根据返回数据渲染卡片预览
4. 用户点"完成"→ 前端写入 `localStorage[今日 key]`
5. 切换到新的一天时，日期 key 改变 → 自动重置当日进度（历史 key 保留用于 streak 计算）

## 统一预览数据结构

```ts
type FeedItem = {
  sourceId: string;     // 如 "anthropic"
  title: string;
  url: string;
  publishedAt?: string; // ISO 时间，可选
};

// /api/feeds 返回
type FeedsResponse = {
  [sourceId: string]: FeedItem[]; // 每源最多 3 条；抓取失败的源不出现或返回空
};
```

## 错误处理

- 单个源抓取超时 / 失败：该源卡片优雅降级为纯启动器（不显示预览），不影响其他源与页面整体
- 抓取设超时（如单源 8s）
- 无用户表单输入 → 无注入面

## 不做（YAGNI）

- 不做账号系统 / 多用户
- 不做内容全文存储与阅读器
- 不做深色/浅色切换（默认深色，后续可加）
- 不做服务端持久化（完成状态纯本地）
- 不抓取 Twitter（需鉴权，复杂度过高）

## 成功标准

1. 三个分类 8 个源正确展示为卡片
2. Anthropic / OpenAI / OpenRouter 三源显示最新预览条目
3. 勾选"完成"后当日进度更新、卡片视觉变化，刷新后状态保留
4. 跨天后当日进度重置，streak 正确累加
5. 任一源抓取失败时页面其余部分正常工作
