import type { CategoryMeta, Source } from './types'

export const SOURCES: Source[] = [
  // 新闻
  {
    id: 'twitter',
    name: 'Twitter / X (AI 领袖动态)',
    category: 'news',
    url: 'https://x.com/search?q=(AI%20OR%20LLM)%20(from%3A_akhaliq%20OR%20from%3Akarpathy%20OR%20from%3Aylecun%20OR%20from%3ADrJimFan)&f=live',
    desc: '聚合 AK、Karpathy、LeCun、Jim Fan 等顶级 AI 领袖的实时推文，自动过滤杂音',
  },
  {
    id: 'aihot',
    name: 'AIHOT',
    category: 'news',
    url: 'https://aihot.virxact.com/',
    desc: '卡兹克整理的全网 AI 每日热点，专人维护',
    feed: { kind: 'rss', url: 'https://aihot.virxact.com/feed.xml' },
  },
  // 博客
  {
    id: 'anthropic',
    name: 'Anthropic Research',
    category: 'blog',
    url: 'https://www.anthropic.com/research',
    desc: 'A 社官方研究，前沿趋势的集中来源',
    feed: {
      kind: 'html',
      url: 'https://www.anthropic.com/news',
      baseUrl: 'https://www.anthropic.com',
      linkSelector: 'a[href^="/news/"], a[href^="/research/"]',
    },
    fallbackPreview: [
      {
        title: 'Redeploying Fable 5',
        url: 'https://www.anthropic.com/news/redeploying-fable-5',
      },
      {
        title: 'Introducing Claude Sonnet 5',
        url: 'https://www.anthropic.com/news/claude-sonnet-5',
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI Research',
    category: 'blog',
    url: 'https://openai.com/research/',
    desc: 'O 社官方研究，可能定义下个阶段的趋势',
    feed: { kind: 'rss', url: 'https://openai.com/blog/rss.xml' },
    fallbackPreview: [
      {
        title: 'How ChatGPT adoption has expanded',
        url: 'https://openai.com/index/how-chatgpt-adoption-has-expanded',
      },
      {
        title: 'Inside Genebench-Pro',
        url: 'https://openai.com/index/genebench-pro/case-studies',
      },
      {
        title: 'Introducing GeneBench-Pro',
        url: 'https://openai.com/index/introducing-genebench-pro',
      },
    ],
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
    id: 'huggingface',
    name: 'Hugging Face Trending',
    category: 'model',
    url: 'https://huggingface.co/trending',
    desc: 'HF 社区每日最热门大模型、数据集和 Spaces 应用榜单',
  },
  {
    id: 'github_trending',
    name: 'GitHub Python Trending',
    category: 'model',
    url: 'https://github.com/trending/python?since=daily',
    desc: 'GitHub 每日热门 Python 项目榜单，AI 开源项目首发地',
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
