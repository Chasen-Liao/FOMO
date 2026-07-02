import assert from 'node:assert/strict'
import { applyFeedCacheFallback } from '../src/feedCachePolicy'

const cached = {
  aihot: [{ title: 'old item', url: 'https://example.com/old' }],
}

const emptyRefresh = {
  aihot: [],
}

assert.deepEqual(
  applyFeedCacheFallback(emptyRefresh, cached, true),
  emptyRefresh,
  'force refresh must not restore stale cached feed items'
)

assert.deepEqual(
  applyFeedCacheFallback(emptyRefresh, cached, false),
  cached,
  'normal refresh may reuse cached feed items when a source returns empty'
)
