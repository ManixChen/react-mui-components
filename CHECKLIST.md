# 发布前检查清单

## ✅ 已完成的清理工作

### 1. 删除重复代码
- ✅ 删除根目录 `src/` 目录（与 `packages/` 下的包重复）
- ✅ 删除根目录 `rollup.config.js`（不再需要）
- ✅ 删除根目录 `tsconfig.json`（不再需要）

### 2. 清理不必要的文件
- ✅ 删除 `packages/richtext/node_modules/`（不应该提交到 npm）
- ✅ 删除 `packages/richtext/package-lock.json`（不应该提交到 npm）

### 3. 更新配置文件
- ✅ 更新根目录 `package.json`，改为 monorepo 工作区配置
- ✅ 设置根目录包为 `"private": true`，防止误发布

### 4. 文档
- ✅ 创建 `NPM_PUBLISH_GUIDE.md` 发布指南

## 📋 发布前需要完成的检查

### 包配置检查

#### 1. 更新 package.json 中的 author 字段

所有包的 `author` 字段目前为空，建议填写：

- [ ] `packages/request/package.json`
- [ ] `packages/form/package.json`
- [ ] `packages/table/package.json`
- [ ] `packages/loading/package.json`
- [ ] `packages/richtext/package.json`
- [ ] `packages/types/package.json`

示例格式：
```json
"author": "Your Name <your.email@example.com>"
```

#### 2. 检查包名可用性

在 npm 上检查以下包名是否可用：

- [ ] `react-auto-axios`
- [ ] `react-mui-vgform`
- [ ] `react-mui-auto-table`
- [ ] `react-mui-loading`
- [ ] `react-mui-richtext`
- [ ] `react-mui-types`

检查命令：
```bash
npm view <package-name>
```

#### 3. 构建测试

确保所有包都能正常构建：

- [ ] `cd packages/request && npm run build`
- [ ] `cd packages/form && npm run build`
- [ ] `cd packages/table && npm run build`
- [ ] `cd packages/loading && npm run build`
- [ ] `cd packages/richtext && npm run build`
- [ ] `cd packages/types && npm run build`

#### 4. 检查构建产物

每个包的 `dist/` 目录应包含：

- [ ] `index.js` (CommonJS)
- [ ] `index.esm.js` (ES Module)
- [ ] `index.d.ts` (TypeScript 类型定义)

#### 5. 检查 .npmignore 文件

确保每个包都有 `.npmignore` 文件，排除：
- `src/`
- `node_modules/`
- `tsconfig.json`
- `rollup.config.js`
- `.git/`
- `.gitignore`

#### 6. 检查 README.md

确保每个包都有清晰的 README.md 文档：

- [ ] `packages/request/README.md`
- [ ] `packages/form/README.md`
- [ ] `packages/table/README.md`
- [ ] `packages/loading/README.md`
- [ ] `packages/richtext/README.md`
- [ ] `packages/types/README.md`（如果存在）

### npm 账户准备

- [ ] 创建 npm 账户（如果还没有）
- [ ] 登录 npm：`npm login`
- [ ] 验证登录：`npm whoami`

### 版本管理

- [ ] 决定初始版本号（建议从 `1.0.0` 开始）
- [ ] 了解语义化版本规则

## 🚀 发布流程

参考 `NPM_PUBLISH_GUIDE.md` 中的详细步骤。

快速发布命令：
```bash
# 1. 进入包目录
cd packages/<package-name>

# 2. 更新版本号
npm version patch  # 或 minor/major

# 3. 构建
npm run build

# 4. 发布
npm publish
```

## ⚠️ 重要提醒

1. **不要发布根目录包**：根目录的 `package.json` 已设置为 `private: true`

2. **测试发布**：首次发布前，使用 `npm publish --dry-run` 预览

3. **版本号**：发布后无法修改已发布的版本，只能发布新版本

4. **撤销发布**：如果发布错误，可以在 72 小时内使用 `npm unpublish` 撤销

5. **包名唯一性**：确保包名在 npm 上唯一，如果被占用需要更换

## 📝 发布后任务

- [ ] 更新根目录 `README.md`，添加安装说明
- [ ] 在 GitHub 上创建 release tag
- [ ] 更新文档，说明如何使用已发布的包
- [ ] 测试从 npm 安装包：`npm install <package-name>`

