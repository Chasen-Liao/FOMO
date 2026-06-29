import type { CategoryMeta, Source } from './types'

export const SOURCES: Source[] = [
  // 新闻
  {
    id: 'twitter',
    name: 'Twitter / X',
    category: 'news',
    url: 'https://x.com/',
    desc: 'AI 最新消息的发源地，关注官方账号与 KOL List',
  },
  {
    id: 'aihot',
    name: 'AIHOT',
    category: 'news',
    url: 'https://aihot.virxact.com/',
    desc: '卡兹克整理的全网 AI 每日热点，专人维护',
  },
  // 博客
  {
    id: 'anthropic',
    name: 'Anthropic Research',
    category: 'blog',
    url: 'https://www.anthropic.com/research',
    desc: 'A 社官方研究，前沿趋势的集中来源',
    feed: { kind: 'rss', url: 'https://www.anthropic.com/news/rss.xml' },
  },
  {
    id: 'openai',
    name: 'OpenAI Research',
    category: 'blog',
    url: 'https://openai.com/research/',
    desc: 'O 社官方研究，可能定义下个阶段的趋势',
    feed: { kind: 'rss', url: 'https://openai.com/blog/rss.xml' },
  },
  // 模型
  {
    id: 'openrouter',
    name: 'OpenRouter Models',
    category: 'model',
    url: 'https://openrouter.ai/models',
    desc: '新模型收录入口，价格 / 速度 / 跑分一览',
    feed: { kind: 'openrouter' },
  },
  {
    id: 'llmstats',
    name: 'LLM Stats',
    category: 'model',
    url: 'https://llm-stats.com/llm-updates',
    desc: '真实记录最新模型的发布时间线',
  },
  {
    id: 'artificialanalysis',
    name: 'Artificial Analysis',
    category: 'model',
    url: 'https://artificialanalysis.ai/',
    desc: '各大测评 SOTA 水平与变化趋势，含中美对比',
  },
  {
    id: 'arena',
    name: 'LMArena',
    category: 'model',
    url: 'https://arena.ai/leaderboard/code/webdev',
    desc: '大模型盲测竞技场，社区真实比拼榜单',
  },
]

export const CATEGORIES: CategoryMeta[] = [
  { id: 'news', label: '新闻', emoji: '📰' },
  { id: 'blog', label: '博客', emoji: '✍️' },
  { id: 'model', label: '模型', emoji: '🤖' },
]
