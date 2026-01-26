# Vercel 部署指南

## 🚀 部署步骤

### 1. 连接 GitHub 仓库
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库 `the-reasons-to-quit-porn`

### 2. 配置项目
Vercel 会自动检测到这是一个 Vite + React 项目并使用以下配置：
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 环境变量（可选）
如果应用需要 API keys，在 Vercel 项目设置中添加：
- `GEMINI_API_KEY`: 你的 Gemini API 密钥

### 4. 部署
点击 "Deploy" 按钮，Vercel 会自动：
1. 安装依赖
2. 构建项目
3. 部署到全球 CDN

## ✅ 项目已优化的方面

- ✅ Vite 配置正确
- ✅ 构建脚本完整
- ✅ TypeScript 支持
- ✅ 静态资源优化
- ✅ 响应式设计
- ✅ PWA 就绪

## 🔧 技术栈兼容性

- ✅ React 19 - 最新版本
- ✅ TypeScript 5.8 - 类型安全
- ✅ Framer Motion 12 - 动画库
- ✅ Lucide React - 图标库
- ✅ Vite 6 - 构建工具

## 📱 功能特性

- ✅ 3D 旋转动画
- ✅ 物理碰撞效果
- ✅ 双语支持（中英文）
- ✅ 本地存储
- ✅ 响应式设计
- ✅ 自定义卡片编辑
- ✅ 实时内容替换

## 🌐 部署后特性

- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 无服务器部署
- ✅ 自动部署（git push）
- ✅ 预览部署（PR）

## 🎯 预期性能

- ⚡ 首次加载: < 2秒
- 📦 包大小: ~400KB (gzipped: 132KB)
- 🔄 动画帧率: 60fps
- 📱 移动端优化: 完全支持

部署完成后，你的应用将在 `https://your-project.vercel.app` 可访问！