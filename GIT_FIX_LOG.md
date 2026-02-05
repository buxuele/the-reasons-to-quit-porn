# Git 推送问题修复记录

## 问题描述
推送到 GitHub 时被拒绝，原因是 commit `7dd3a03` 中的 `dist/assets/index-DQNOR5N1.js` 文件包含 Groq API Key，触发了 GitHub Push Protection。

## 解决方案
重写 Git 历史，创建不包含敏感信息的干净提交。

## 操作步骤

```bash
# 1. 创建干净分支，从 origin/main 开始
git branch clean-main a00cb3a
git checkout clean-main

# 2. 删除 dist 目录（包含泄露的 API Key）
rm -rf dist
git rm -r --cached dist

# 3. Cherry-pick 原有提交，但不包含 dist 目录
git cherry-pick 7dd3a03 --no-commit
git commit -m "add new pages and reading notes (clean)"

git cherry-pick 1cfed69 --no-commit
git commit -m "update gitignore and add vercel.json"

git cherry-pick 1162543 --no-commit
git commit -m "Security: prevent dist folder and API key exposure"

# 4. 强制推送干净分支到 main
git push origin clean-main:main --force

# 5. 清理本地分支
git checkout main
git reset --hard origin/main
git branch -D clean-main
```

## 预防措施
- `.gitignore` 已更新，包含 `dist/` 目录
- 不要将构建产物提交到 Git
- API Key 应该放在 `.env.local` 中，已被 .gitignore 忽略

## 完成时间
2026-02-03 15:22
