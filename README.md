# 番茄小说AI自动化MCP工具

基于TypeScript和MCP协议的番茄小说自动化发布工具。

## 功能特性

- ✅ AI自动生成小说章节
- ✅ 原创性检测
- ✅ 自动化发布到番茄小说平台
- ✅ 数据统计和分析
- ✅ 定时发布功能

## 技术栈

- **TypeScript** - 类型安全的JavaScript
- **MCP SDK** - Model Context Protocol官方SDK
- **Puppeteer** - 浏览器自动化
- **TypeORM** - 数据库ORM
- **Zod** - 数据验证

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入：
- OpenAI API Key 或 Anthropic API Key
- 番茄小说账号信息
- 数据库路径等

### 3. 构建项目

```bash
npm run build
```

### 4. 运行开发模式

```bash
npm run dev
```

### 5. 配置Cursor

**详细配置指南请查看：[CURSOR_MCP配置指南.md](./CURSOR_MCP配置指南.md)**

#### 方法1：使用自动配置脚本（推荐）

在PowerShell中运行：

```powershell
# 生产环境配置（使用编译后的代码）
.\setup-cursor-mcp.ps1 -ProjectPath "E:\codes\novel-mcp" -Mode "production"

# 开发环境配置（直接运行TypeScript）
.\setup-cursor-mcp.ps1 -ProjectPath "E:\codes\novel-mcp" -Mode "development"
```

脚本会自动：
- 找到Cursor配置文件位置
- 创建配置（如果不存在）
- 添加MCP服务器配置
- 保存配置

#### 方法2：手动配置

1. **找到Cursor的MCP配置文件**：
   - Windows: `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json`
   - macOS: `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`
   - Linux: `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

2. **添加配置**（使用绝对路径，替换为你的实际路径）：

```json
{
  "mcpServers": {
    "tomato-novel": {
      "command": "node",
      "args": [
        "E:\\codes\\novel-mcp\\dist\\index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

3. **重启Cursor**使配置生效

**注意**：
- 确保项目已构建（运行 `pnpm build`）
- 路径使用绝对路径（替换 `E:\\codes\\novel-mcp` 为你的实际路径）
- 如果使用 `.env` 文件，`env` 字段可以省略
- 参考 `cursor-mcp-config.example.json` 查看配置示例

## 项目结构

```
novel-mcp/
├── src/
│   ├── index.ts                # MCP服务器主入口
│   ├── tools/                  # MCP工具实现
│   │   ├── contentGeneration.ts
│   │   ├── originalityCheck.ts
│   │   ├── publishing.ts
│   │   └── analytics.ts
│   ├── services/               # 业务逻辑服务
│   │   ├── aiService.ts
│   │   ├── tomatoService.ts
│   │   ├── dbService.ts
│   │   └── originalityService.ts
│   ├── models/                 # 数据模型
│   │   ├── Novel.ts
│   │   ├── Chapter.ts
│   │   └── PublishTask.ts
│   ├── config/                 # 配置
│   │   └── prompts/
│   └── resources/              # MCP资源
├── prompt/                     # Prompt模版
├── data/                       # 数据目录
└── dist/                       # 编译输出
```

## 使用示例

在Cursor中，你可以通过自然语言与AI对话来使用这些工具：

```
用户: "帮我生成一篇都市系统流小说的第一章，5000字"

AI会自动调用 generate_chapter 工具生成内容
```

## 开发

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

## 注意事项

⚠️ **重要提醒**：
1. 严格遵守番茄小说平台规则，避免封号风险
2. 保证内容原创性，避免版权问题
3. 合理使用AI生成内容，注意合规性
4. 定期人工审核，保证内容质量

## 许可证

MIT
