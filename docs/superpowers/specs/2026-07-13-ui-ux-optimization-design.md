# FOMO 拟物化 UI/UX 极致打磨设计规范

本项目旨在保留并打磨现有的“手写活页打卡纸”这一极具温度感的拟物化（Skeuomorphic）设计，通过深挖细节质感、优化动态反馈和消除布局跳动，使用户的每日打卡体验更加细腻、解压。

---

## 1. 目标与视觉基准 (Goal & Visual Standards)

*   **视觉核心**：强化“纸张、墨水、盖章、铅笔”的真实触感与物理隐喻。
*   **极致暗色模式 (Dark Paper Mode)**：非生硬的直接反色，而是转为“深夜中台灯照亮的深褐老旧羊皮纸”质感，使用夜间柔和墨色。
*   **无感数据流过渡**：采用“铅笔手绘线条”骨架屏，杜绝布局抖动（CLS < 0.05）。
*   **物理触觉反馈**：点击时有按压纸张的 3D 凹陷感；勾选时有墨水触纸后向纤维洇湿晕开的自然毛边效果。

---

## 2. 详细技术路线 (Detailed Architecture)

为保障高内聚、低耦合，优化任务拆分为三个子系统，由三个 Subagent 协同完成：

### 2.1. 子系统 A：纸面物理与暗色折角 (Subagent A - DarkMode & Paper Physics)
*   **控制交互**：在纸张 `.sheet` 的右上角，利用 CSS 伪元素/绝对定位绘制一个折起的小角 (`.paper-fold`)，上书手绘汉字“夜”（夜间）或“昼”（白天）。
*   **切换过渡**：点击折角时，使用 `clip-path: circle()` 的剪裁路径动画，从右上角向左下角像墨水晕开一样扩散切换主题，或者伴随 3D 纸张翻折的动画。
*   **暗色配方**：
    *   `--paper`: `rgba(44, 37, 30, 0.98)` (深褐老羊皮纸质感)
    *   `--ink`: `#e5dacf` (黄铜淡墨色)
    *   `--ink-soft`: `#cbbb9f`
    *   `--ink-muted`: `#8e7e68`
    *   `--rule-soft`: `rgba(200, 160, 100, 0.22)` (深金色格线)
    *   `--done-green`: `#6b8e5c` (青苔绿)
    *   `--stamp-red`: `#cd5c5c` (朱砂印泥红)
*   **持久化**：读写 `localStorage` 中的主题偏好，且在无缓存时，检测系统偏好 `matchMedia('(prefers-color-scheme: dark)')`。

### 2.2. 子系统 B：铅笔素描骨架与异步加载 (Subagent B - Sketch Skeleton & Loader)
*   **素描骨架**：数据加载中时，卡片预览区显示 2~3 行浅灰色、带有些许不规则抖动的手绘格线。
    *   用 SVG 的 `<line>` 并通过 CSS 模拟出铅笔在本子上打草稿时微微颤抖的笔触线条。
    *   使用 `opacity` 柔和渐隐动画 (Pulse) 代替传统的灰色块，符合“手账本”的素描草稿状态。
*   **布局跳动消除 (CLS Control)**：
    *   由于 OpenRouter 等数据加载时长不一，卡片将锁定预览区的最小高度 (Min-Height) 并通过骨架线占位。数据返回后，旧骨架淡出、新列表淡入，过渡时长控制在 `250ms` 内，避免排版突变。

### 2.3. 子系统 C：墨水晕开与 3D 按压反馈 (Subagent C - Ink & 3D Micro-interactions)
*   **3D 纸面按压**：
    *   为打卡卡片 `.row` 配置 `perspective: 800px` 3D 视界。
    *   在 `:active` 状态下，添加 `transform: scale(0.985) translateZ(-6px) rotateX(0.5deg)` 配合极轻的内阴影变深，模拟在软垫纸本上用力按压的凹陷感。
*   **墨水洇湿晕开 (Ink Bleeding Effect)**：
    *   方框内的对勾 `.tick` 和打卡完成时被划掉的横线，通过应用 SVG 的 `<feTurbulence>` 扰动滤镜，使墨水线条在落笔时产生微小的边缘凸起和毛刺感。
    *   勾选瞬间，将滤镜的 `baseFrequency` 从 `0` 抖动到 `0.08` 再回弹至 `0.02`，视觉上呈现“墨水滴在吸水纸上，边缘沿纸张纤维晕染开去”的细微动效。

---

## 3. 分工与协同机制 (Subagents Collaboration)

主 Agent 将派生三个独立的 Subagent 并发运行，它们各自独立在独立分支或工作区实现功能，以避免 CSS 冲突。最终由主 Agent 统一在 `index.css` 和 React 组件中合入、调优。

*   **Subagent A (DarkMode)**: 负责修改 `index.css` 主题变量、折角 DOM 与 React 切换逻辑。
*   **Subagent B (Loader)**: 负责开发 `SourceCard.tsx` 的加载态骨架和 CLS 占位逻辑。
*   **Subagent C (InkInteraction)**: 负责 SVG 滤镜、勾选动画、划线动画与 3D 按压 CSS。

---

## 4. 验证与回归测试 (Verification Plan)

### 4.1. 自动化验证
*   `npm run build`：确保 TypeScript 类型和 CSS 导入在编译期无任何报错。

### 4.2. 手动测试 Checklist
1.  **暗色模式测试**：手动切换右上角折角，检查在不同分辨率下折角的正常响应；验证刷新页面后是否保持暗色设置；系统主题切换时是否触发响应。
2.  **网络延迟下的骨架屏测试**：将网络限速为 Slow 3G，观察铅笔骨架占位线是否正常显示，数据载入时是否有页面瞬间高度变化，切换是否平滑。
3.  **交互手感验证**：反复点击打卡行，测试 3D 按压感是否响应迅速（无 tap delay）；在放大倍数下观察对勾的“墨水晕染”效果是否流畅且无边缘发虚问题。
