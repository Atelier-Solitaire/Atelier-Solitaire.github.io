# Atelier Solitaire — 洛杉矶高定女装工作室官网

单页滚动式官网，纯 HTML / CSS / JS（三个文件），无构建步骤，可直接部署到 GitHub Pages。

## 文件结构

```
├── index.html    # 单页：7 个 Section + 页脚，全英文
├── styles.css    # 全部样式（配色、字体、布局、响应式）
├── script.js     # 交互（平滑滚动、滚动动画、轮播、表单）
└── README.md     # 本说明
```

外部依赖仅三个 CDN：Google Fonts、GSAP + ScrollTrigger（cdnjs）、Lenis（unpkg）。无其他 API 依赖。

## 本地预览

直接双击 `index.html` 即可打开；或起一个本地服务器：

```bash
cd 项目文件夹
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 如何替换图片

所有图片目前使用 picsum.photos 占位图。在 `index.html` 中搜索注释 **`REPLACE IMAGE`**，共四处：

1. **About 区域**：1 张礼服细节图，建议尺寸 **800×1000**（4:5 竖图）
2. **Collection 区域**：6 张作品图，建议尺寸 **900×1200**（3:4 竖图）
3. **Team 区域 - 创始人**：1 张肖像，建议尺寸 **800×1000**（4:5 竖图）
4. **Team 区域 - 团队网格**：4 张肖像，建议尺寸 **900×1200**（3:4 竖图）

替换方式：把图片文件放进项目文件夹（如 `images/` 目录），然后修改 `<img>` 的 `src`，例如：

```html
<!-- 改前 -->
<img src="https://picsum.photos/seed/atelier-detail/800/1000" ... />
<!-- 改后 -->
<img src="images/your-gown-detail.jpg" ... />
```

同时记得更新 `alt` 描述文字。所有图片已带 `loading="lazy"` 懒加载，无需额外处理。

## 如何修改文字

全部文案都在 `index.html` 中，按 Section 注释分段（`<!-- ==== 2. ABOUT ==== -->` 等），直接编辑对应文字即可：

- **品牌名**：搜索 `Atelier Solitaire` 全文替换（导航 Logo、Hero、About、页脚）
- **作品名称与年份**：Collection 区域的 `.work-name` / `.work-year`
- **客户感言**：Testimonial 区域的三个 `<blockquote>`，可增删（建议保持 2–3 条）
- **地址 / 邮箱 / 电话**：Contact 区域 `.contact-details`。电话号码是占位的 555 号码，搜索 **`REPLACE PHONE`**，把 `href="tel:+13105550127"` 和显示文字 `+1 (310) 555-0127` 两处都换成真实号码
- **团队成员**：Team 区域（`#team`）中的创始人介绍（姓名、职务、简介、签名）和 4 位成员的 `.member-name` / `.member-role`，直接改文字即可；增减成员就复制/删除一个 `<figure class="member">…</figure>` 整块
- **页脚版权年份**：由 JS 自动生成当前年份，无需手动改

字体在 `index.html` 的 Google Fonts 链接中引入；想换字体，修改该链接和 `styles.css` 顶部 `:root` 里的 `--font-*` 变量。

## 配置预约表单（Formspree）

表单目前处于演示状态：提交后直接显示 "We will be in touch shortly."。要真正接收邮件：

1. 到 [formspree.io](https://formspree.io) 免费注册，新建一个表单，得到形如 `https://formspree.io/f/abcdwxyz` 的 endpoint
2. 在 `index.html` 中搜索 **`FORMSPREE`**，把 `action` 里的 `YOUR_FORM_ID` 替换为你的真实 ID
3. 完成。`script.js` 检测到真实 endpoint 后会自动改为真实提交（提交失败时回退为原生表单提交）

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库（如 `atelier-solitaire`）
2. 把本文件夹中的 `index.html`、`styles.css`、`script.js` 上传/推送到仓库根目录
3. 仓库页面 → **Settings** → **Pages** → Source 选 `Deploy from a branch`，分支选 `main` / 目录选 `/ (root)`，保存
4. 等 1–2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`

注意：若使用自定义图片，图片文件需一并提交到仓库。

## 设计规范速查

| 项目 | 值 |
|---|---|
| 深黑背景 | `#0a0a0a` |
| 暖白（Process 区） | `#f5f0eb` |
| 香槟金强调 | `#c9a96e` |
| 标题字体 | Playfair Display |
| 正文字体 | Lora / Inter |
| 签名字体 | Great Vibes（仅创始人签名） |

配色与字体变量集中在 `styles.css` 顶部的 `:root` 中，一处修改全站生效。
