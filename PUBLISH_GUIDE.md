# npm 包发布步骤指南

## 前置条件

1. **Node.js 和 npm**
   ```bash
   node --version  # 需要 v14+
   npm --version
   ```

2. **npm 账户**
   - 如果没有，访问 https://www.npmjs.com/signup 注册
   - 确保邮箱已验证

## 发布步骤

### 1. 准备代码

```bash
cd packages/texthelp-ai

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 验证编译输出
ls -la dist/
# 应该看到:
# - index.js
# - index.d.ts
# - api/detector.js
# - api/detector.d.ts
# - api/transformer.js
# - api/transformer.d.ts
# - api/extractor.js
# - api/extractor.d.ts
# - types.js
# - types.d.ts
```

### 2. 登录 npm

```bash
npm login
# 输入用户名
# 输入密码
# 输入邮箱
# 可能需要验证（检查邮箱）
```

验证登录状态：
```bash
npm whoami
# 应该输出你的用户名
```

### 3. 验证包信息

确保 `package.json` 中的信息正确：

```json
{
  "name": "texthelp-ai",
  "version": "1.0.0",
  "description": "Universal AI model API wrapper...",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

**重要：**
- `name` 必须是唯一的（在 npm 上不能重复）
- `version` 遵循 semver（x.y.z 格式）
- `main` 和 `types` 指向正确的输出文件

### 4. 发布到 npm

```bash
npm publish

# 或指定 tag（用于 beta 版本）
npm publish --tag beta
```

成功输出例子：
```
npm notice Publishing to https://registry.npmjs.org/
npm notice Publishing to https://registry.npmjs.org/
+ texthelp-ai@1.0.0
```

### 5. 验证发布

```bash
# 查看包信息
npm info texthelp-ai

# 或访问
# https://www.npmjs.com/package/texthelp-ai
```

## 更新版本

当需要发布新版本时：

```bash
cd packages/texthelp-ai

# 1. 修改代码
# ... 修改源代码 ...

# 2. 更新 package.json 版本号
# 例如从 1.0.0 -> 1.0.1（补丁版本）
# 或 1.0.0 -> 1.1.0（次版本）
# 或 1.0.0 -> 2.0.0（主版本）

# 3. 重新编译
npm run build

# 4. 发布新版本
npm publish
```

**版本号规则（Semantic Versioning）：**
- `1.0.0` → `1.0.1`：修复 bug（patch）
- `1.0.0` → `1.1.0`：添加功能（minor）
- `1.0.0` → `2.0.0`：破坏性更改（major）

## 常见问题

### Q: 包名已被占用怎么办？

A: 更改 `package.json` 中的 `name`，例如：
```json
{
  "name": "@yourusername/texthelp-ai"
}
```

然后重新发布。

### Q: 如何发布私有包？

A: 在发布时添加 `--access restricted` 参数（需要付费账户）：
```bash
npm publish --access restricted
```

本教程使用公开包，所以使用 `--access public`（默认）。

### Q: 发布后如何撤销？

A: 
```bash
# 撤销最新版本（72小时内）
npm unpublish texthelp-ai@1.0.0

# 完全删除包（需要满足条件）
npm unpublish texthelp-ai
```

### Q: 如何在扣子平台使用已发布的包？

A: 在扣子代码中直接导入：

```typescript
import { handler } from 'texthelp-ai';
import { Args } from 'texthelp-ai';

export default handler;
```

扣子平台会自动从 npm 下载并安装依赖。

## 清单

发布前检查：

- [ ] 所有代码已编写并测试
- [ ] `npm run build` 成功执行
- [ ] `dist/` 目录包含所有输出文件
- [ ] `package.json` 中的包名是唯一的
- [ ] README.md 已更新
- [ ] LICENSE 文件存在
- [ ] npm 账户已登录（`npm whoami`）
- [ ] 版本号已更新（如果是更新）
- [ ] 所有依赖已安装

## 发布后

1. 访问 https://www.npmjs.com/package/texthelp-ai 确认包已发布
2. 更新 GitHub 仓库 https://github.com/1staihub/texthelp-ai 
3. 在项目中测试安装：
   ```bash
   npm install texthelp-ai
   ```
4. 更新文档和示例指向新版本
5. 在扣子平台中使用新发布的包

## 获取帮助

- npm 文档：https://docs.npmjs.com/
- npm CLI 参考：https://docs.npmjs.com/cli/
- 发布指南：https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
