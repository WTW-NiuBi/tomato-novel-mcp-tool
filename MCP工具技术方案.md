# 番茄小说AI自动化MCP工具技术方案

## 一、方案评估

### 1.1 原方案评估

**优势：**
- ✅ 方案完整详细，涵盖从内容生成到发布的完整流程
- ✅ 技术栈选择合理，有明确的技术实现路径
- ✅ 考虑了风险控制和合规性问题
- ✅ 有明确的KPI指标和实施计划
- ✅ 针对番茄小说平台特点进行了专门优化

**可行性分析：**
- ✅ **技术可行性**：高 - 所有技术点都有成熟方案
- ✅ **合规性**：中等 - 需要严格遵守平台规则，避免封号风险
- ✅ **收益可行性**：中等 - 取决于内容质量和平台算法推荐
- ✅ **可维护性**：高 - 模块化设计，易于扩展和维护

**改进建议：**
1. 增加人工审核环节，降低AI痕迹
2. 加强账号安全策略，避免关联封号
3. 建立内容质量评估体系，持续优化
4. 考虑多平台分发，降低单一平台风险

### 1.2 MCP工具可行性评估

**✅ 完全可行！** 该方案非常适合做成MCP工具，原因如下：

1. **模块化设计**：方案本身就是模块化的，每个功能都可以封装为MCP工具
2. **标准化接口**：MCP协议提供了标准化的工具调用接口
3. **可扩展性**：MCP工具易于扩展新功能
4. **AI集成**：MCP天然支持AI模型调用，与方案需求高度契合
5. **多工具协作**：可以拆分为多个工具，实现复杂工作流

## 二、MCP工具架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Cursor AI Client                      │
│              (通过MCP协议调用工具)                        │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol (stdio/HTTP)
                     │
┌────────────────────▼────────────────────────────────────┐
│            Tomato Novel MCP Server                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Content     │  │  Publishing  │  │  Analytics   │ │
│  │  Generation  │  │  Tools       │  │  Tools       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Originality │  │  Cover       │  │  Data        │ │
│  │  Check       │  │  Generation  │  │  Storage     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │  AI API │  │ 番茄平台 │  │ 数据库   │
   │ (GPT/   │  │ (Web    │  │ (SQLite/ │
   │ Claude) │  │ 自动化)  │  │  MySQL)  │
   └─────────┘  └─────────┘  └─────────┘
```

### 2.2 MCP工具分类

#### 2.2.1 内容生成工具 (Content Generation Tools)

| 工具名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| `generate_chapter` | 生成小说章节 | 小说ID、垂类、前文摘要、字数要求 | 章节标题和内容 |
| `generate_batch_chapters` | 批量生成章节 | 小说ID、章节数量、垂类 | 章节列表 |
| `optimize_title` | 优化章节标题 | 章节内容、垂类关键词 | 优化后的标题 |
| `generate_cover` | 生成小说封面 | 小说信息、垂类、风格 | 封面图片URL |

#### 2.2.2 原创性检测工具 (Originality Check Tools)

| 工具名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| `check_originality` | 检测内容原创性 | 章节内容 | 相似度报告 |
| `batch_check` | 批量检测 | 章节ID列表 | 检测结果列表 |
| `get_similarity_report` | 获取详细报告 | 检测ID | 详细相似度报告 |

#### 2.2.3 发布管理工具 (Publishing Tools)

| 工具名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| `publish_chapter` | 发布章节到番茄 | 章节ID、小说ID、发布时间 | 发布状态 |
| `schedule_publish` | 定时发布 | 章节ID、发布时间 | 任务ID |
| `get_publish_status` | 查询发布状态 | 任务ID | 发布状态详情 |
| `create_novel` | 创建新小说 | 小说信息、封面 | 小说ID |

#### 2.2.4 数据分析工具 (Analytics Tools)

| 工具名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| `get_novel_stats` | 获取小说数据 | 小说ID、时间范围 | 阅读量、收益等 |
| `get_revenue_report` | 收益报告 | 时间范围、小说ID列表 | 收益统计 |
| `analyze_performance` | 性能分析 | 小说ID | 完读率、趋势等 |

#### 2.2.5 内容管理工具 (Content Management Tools)

| 工具名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| `save_chapter` | 保存章节 | 章节内容、元数据 | 章节ID |
| `get_chapter` | 获取章节 | 章节ID | 章节内容 |
| `list_chapters` | 列出章节 | 小说ID | 章节列表 |
| `update_chapter` | 更新章节 | 章节ID、新内容 | 更新状态 |

### 2.3 MCP资源 (Resources)

| 资源名称 | 类型 | 描述 |
|---------|------|------|
| `novel://{novel_id}` | Novel | 小说完整信息 |
| `chapter://{chapter_id}` | Chapter | 章节内容 |
| `prompt://{category}` | Prompt | Prompt模版 |
| `stats://{novel_id}` | Statistics | 统计数据 |
| `config://publishing` | Config | 发布配置 |

## 三、技术实现方案

### 3.1 技术栈选择

#### 3.1.1 MCP服务器实现

**推荐方案：TypeScript + MCP SDK**

```typescript
// 技术栈
- Node.js 18+
- TypeScript 5.0+
- @modelcontextprotocol/sdk (MCP官方SDK)
- tsx 或 ts-node (TypeScript执行)
```

#### 3.1.2 核心依赖

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "openai": "^4.0.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "puppeteer": "^21.0.0",
    "typeorm": "^0.3.17",
    "better-sqlite3": "^9.0.0",
    "ioredis": "^5.3.2",
    "node-cron": "^3.0.3",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/node-cron": "^3.0.11",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

### 3.2 项目结构

```
novel-mcp/
├── src/
│   ├── index.ts                # MCP服务器主入口
│   ├── tools/                   # 工具实现
│   │   ├── contentGeneration.ts
│   │   ├── originalityCheck.ts
│   │   ├── publishing.ts
│   │   ├── analytics.ts
│   │   └── contentManagement.ts
│   ├── resources/               # 资源实现
│   │   ├── novelResource.ts
│   │   ├── chapterResource.ts
│   │   └── statsResource.ts
│   ├── services/               # 业务逻辑层
│   │   ├── aiService.ts        # AI模型调用
│   │   ├── tomatoService.ts    # 番茄平台交互
│   │   ├── dbService.ts        # 数据库操作
│   │   └── originalityService.ts  # 原创性检测
│   ├── models/                  # 数据模型
│   │   ├── Novel.ts
│   │   ├── Chapter.ts
│   │   └── PublishTask.ts
│   ├── config/                 # 配置管理
│   │   ├── settings.ts
│   │   └── prompts/            # Prompt模版
│   └── utils/                  # 工具函数
│       ├── logger.ts
│       └── validators.ts
├── data/                       # 数据目录
│   ├── db/                     # SQLite数据库
│   └── cache/                  # 缓存文件
├── tests/                      # 测试
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### 3.3 核心实现示例

#### 3.3.1 MCP服务器主入口

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { generateChapterTool } from "./tools/contentGeneration.js";
import { checkOriginalityTool } from "./tools/originalityCheck.js";
import { publishChapterTool } from "./tools/publishing.js";
import { getNovelStatsTool } from "./tools/analytics.js";

// 创建MCP服务器
const server = new Server(
  {
    name: "tomato-novel-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    generateChapterTool.definition,
    checkOriginalityTool.definition,
    publishChapterTool.definition,
    getNovelStatsTool.definition,
    // ... 其他工具
  ],
}));

// 注册工具处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "generate_chapter":
      return await generateChapterTool.handler(args);
    case "check_originality":
      return await checkOriginalityTool.handler(args);
    case "publish_chapter":
      return await publishChapterTool.handler(args);
    case "get_novel_stats":
      return await getNovelStatsTool.handler(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 注册资源列表
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "novel://*",
      name: "Novel",
      description: "小说资源",
      mimeType: "application/json",
    },
    {
      uri: "chapter://*",
      name: "Chapter",
      description: "章节资源",
      mimeType: "text/plain",
    },
  ],
}));

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tomato Novel MCP server running on stdio");
}

main().catch(console.error);
```

#### 3.3.2 内容生成工具实现

```typescript
// src/tools/contentGeneration.ts
import { z } from "zod";
import { AIService } from "../services/aiService.js";
import { DatabaseService } from "../services/dbService.js";
import { getPromptTemplate } from "../config/prompts/index.js";

const GenerateChapterSchema = z.object({
  novel_id: z.string().describe("小说ID"),
  category: z.enum(["urban_system", "urban_rebirth", "urban_romance", "suspense"])
    .describe("小说垂类"),
  word_count: z.number().int().min(1000).max(10000).default(5000)
    .describe("目标字数"),
  previous_summary: z.string().optional()
    .describe("前文摘要，用于保持连贯性"),
});

type GenerateChapterArgs = z.infer<typeof GenerateChapterSchema>;

export const generateChapterTool = {
  definition: {
    name: "generate_chapter",
    description: "生成小说章节内容",
    inputSchema: {
      type: "object",
      properties: {
        novel_id: {
          type: "string",
          description: "小说ID",
        },
        category: {
          type: "string",
          enum: ["urban_system", "urban_rebirth", "urban_romance", "suspense"],
          description: "小说垂类",
        },
        word_count: {
          type: "integer",
          default: 5000,
          minimum: 1000,
          maximum: 10000,
          description: "目标字数",
        },
        previous_summary: {
          type: "string",
          description: "前文摘要，用于保持连贯性",
        },
      },
      required: ["novel_id", "category"],
    },
  },

  async handler(args: unknown) {
    // 验证参数
    const validatedArgs = GenerateChapterSchema.parse(args);
    const { novel_id, category, word_count, previous_summary } = validatedArgs;

    // 获取Prompt模版
    const promptTemplate = getPromptTemplate(category);

    // 构建完整Prompt
    const fullPrompt = promptTemplate
      .replace("{previous_summary}", previous_summary || "")
      .replace("{word_count}", word_count.toString());

    // 调用AI服务生成内容
    const aiService = new AIService();
    const result = await aiService.generateContent(fullPrompt);

    // 保存到数据库
    const dbService = new DatabaseService();
    const chapterId = await dbService.saveChapter({
      novelId: novel_id,
      title: result.title,
      content: result.content,
      wordCount: result.content.length,
      category,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            chapter_id: chapterId,
            title: result.title,
            content: result.content,
            word_count: result.content.length,
          }, null, 2),
        },
      ],
    };
  },
};
```

#### 3.3.3 发布工具实现

```typescript
// src/tools/publishing.ts
import { z } from "zod";
import { TomatoService } from "../services/tomatoService.js";
import { DatabaseService } from "../services/dbService.js";

const PublishChapterSchema = z.object({
  chapter_id: z.string().describe("章节ID"),
  novel_id: z.string().describe("小说ID"),
  publish_time: z.string().datetime().optional()
    .describe("发布时间（ISO格式），不提供则立即发布"),
});

type PublishChapterArgs = z.infer<typeof PublishChapterSchema>;

export const publishChapterTool = {
  definition: {
    name: "publish_chapter",
    description: "发布章节到番茄小说平台",
    inputSchema: {
      type: "object",
      properties: {
        chapter_id: {
          type: "string",
          description: "章节ID",
        },
        novel_id: {
          type: "string",
          description: "小说ID",
        },
        publish_time: {
          type: "string",
          format: "date-time",
          description: "发布时间（ISO格式），不提供则立即发布",
        },
      },
      required: ["chapter_id", "novel_id"],
    },
  },

  async handler(args: unknown) {
    const validatedArgs = PublishChapterSchema.parse(args);
    const { chapter_id, novel_id, publish_time } = validatedArgs;

    // 获取章节内容
    const dbService = new DatabaseService();
    const chapter = await dbService.getChapter(chapter_id);

    if (!chapter) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "章节不存在" }, null, 2),
          },
        ],
        isError: true,
      };
    }

    // 发布到番茄
    const tomatoService = new TomatoService();
    const result = await tomatoService.publishChapter({
      novelId: novel_id,
      title: chapter.title,
      content: chapter.content,
      publishTime: publish_time,
    });

    // 更新数据库状态
    await dbService.updateChapterStatus(chapter_id, {
      status: "published",
      publishTime: result.publishTime,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            chapter_id,
            publish_time: result.publishTime,
            url: result.url,
          }, null, 2),
        },
      ],
    };
  },
};
```

#### 3.3.4 AI服务实现

```typescript
// src/services/aiService.ts
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export interface GenerateContentResult {
  title: string;
  content: string;
}

export class AIService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });
  }

  async generateContent(
    prompt: string,
    model: "openai" | "anthropic" = "openai"
  ): Promise<GenerateContentResult> {
    if (model === "openai") {
      return await this.generateWithOpenAI(prompt);
    } else {
      return await this.generateWithAnthropic(prompt);
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<GenerateContentResult> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "你是一位专业的网络小说作家，擅长创作各种类型的小说。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "";
    const lines = content.split("\n");
    const title = lines.find((line) => line.startsWith("标题："))?.replace("标题：", "").trim() || "未命名章节";
    const chapterContent = lines
      .filter((line) => !line.startsWith("标题："))
      .join("\n")
      .trim();

    return {
      title,
      content: chapterContent,
    };
  }

  private async generateWithAnthropic(prompt: string): Promise<GenerateContentResult> {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";
    const lines = content.split("\n");
    const title = lines.find((line) => line.startsWith("标题："))?.replace("标题：", "").trim() || "未命名章节";
    const chapterContent = lines
      .filter((line) => !line.startsWith("标题："))
      .join("\n")
      .trim();

    return {
      title,
      content: chapterContent,
    };
  }
}
```

#### 3.3.5 数据库服务实现

```typescript
// src/services/dbService.ts
import { DataSource } from "typeorm";
import { Novel } from "../models/Novel.js";
import { Chapter } from "../models/Chapter.js";
import { PublishTask } from "../models/PublishTask.js";
import * as path from "path";

export class DatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "better-sqlite3",
      database: process.env.DATABASE_PATH || path.join(process.cwd(), "data", "db", "novels.db"),
      entities: [Novel, Chapter, PublishTask],
      synchronize: true, // 开发环境使用，生产环境应使用migrations
      logging: process.env.NODE_ENV === "development",
    });
  }

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async saveChapter(data: {
    novelId: string;
    title: string;
    content: string;
    wordCount: number;
    category: string;
  }): Promise<string> {
    await this.initialize();
    const chapterRepo = this.dataSource.getRepository(Chapter);

    const chapter = chapterRepo.create({
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      novelId: data.novelId,
      title: data.title,
      content: data.content,
      wordCount: data.wordCount,
      status: "draft",
    });

    const saved = await chapterRepo.save(chapter);
    return saved.id;
  }

  async getChapter(chapterId: string): Promise<Chapter | null> {
    await this.initialize();
    const chapterRepo = this.dataSource.getRepository(Chapter);
    return await chapterRepo.findOne({ where: { id: chapterId } });
  }

  async updateChapterStatus(
    chapterId: string,
    updates: { status?: string; publishTime?: string }
  ): Promise<void> {
    await this.initialize();
    const chapterRepo = this.dataSource.getRepository(Chapter);
    await chapterRepo.update(chapterId, {
      ...(updates.status && { status: updates.status as any }),
      ...(updates.publishTime && { publishTime: new Date(updates.publishTime) }),
    });
  }

  async listChapters(novelId: string): Promise<Chapter[]> {
    await this.initialize();
    const chapterRepo = this.dataSource.getRepository(Chapter);
    return await chapterRepo.find({
      where: { novelId },
      order: { chapterNumber: "ASC" },
    });
  }
}
```

### 3.4 番茄平台自动化实现

```typescript
// src/services/tomatoService.ts
import puppeteer, { Browser, Page } from "puppeteer";
import * as fs from "fs/promises";
import * as path from "path";

interface PublishChapterOptions {
  novelId: string;
  title: string;
  content: string;
  publishTime?: string;
}

export class TomatoService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private readonly cookiesFile = path.join(process.cwd(), "data", "tomato_cookies.json");
  private readonly baseUrl = "https://author.fanqienovel.com";

  async login(username: string, password: string): Promise<void> {
    // 启动浏览器
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();

    // 导航到登录页面
    await this.page.goto(`${this.baseUrl}/login`, {
      waitUntil: "networkidle2",
    });

    // 输入账号密码
    await this.page.waitForSelector("#username");
    await this.page.type("#username", username);
    await this.page.type("#password", password);

    // 点击登录
    await this.page.click('button[type="submit"]');

    // 等待登录完成
    await this.page.waitForNavigation({
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    // 保存cookies
    await this.saveCookies();
  }

  private async saveCookies(): Promise<void> {
    if (!this.page) return;

    const cookies = await this.page.cookies();
    const cookiesDir = path.dirname(this.cookiesFile);
    await fs.mkdir(cookiesDir, { recursive: true });
    await fs.writeFile(this.cookiesFile, JSON.stringify(cookies, null, 2));
  }

  private async loadCookies(): Promise<void> {
    if (!this.page) return;

    try {
      const cookiesData = await fs.readFile(this.cookiesFile, "utf-8");
      const cookies = JSON.parse(cookiesData);
      await this.page.setCookie(...cookies);
    } catch (error) {
      // Cookies文件不存在，需要重新登录
      console.warn("Cookies文件不存在，需要重新登录");
    }
  }

  async publishChapter(options: PublishChapterOptions): Promise<{
    success: boolean;
    publishTime: string;
    url: string;
  }> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    // 加载cookies
    await this.page.goto(this.baseUrl);
    await this.loadCookies();
    await this.page.reload({ waitUntil: "networkidle2" });

    // 导航到章节发布页面
    const chapterUrl = `${this.baseUrl}/novel/${options.novelId}/chapter/new`;
    await this.page.goto(chapterUrl, {
      waitUntil: "networkidle2",
    });

    // 等待页面加载
    await this.page.waitForTimeout(2000);

    // 输入标题
    await this.page.waitForSelector('input[name="title"]');
    await this.page.click('input[name="title"]', { clickCount: 3 });
    await this.page.type('input[name="title"]', options.title);

    // 输入内容
    await this.page.waitForSelector('textarea[name="content"]');
    await this.page.click('textarea[name="content"]', { clickCount: 3 });
    await this.page.type('textarea[name="content"]', options.content);

    // 设置发布时间（如果有）
    if (options.publishTime) {
      // 实现定时发布逻辑
      // 这里需要根据番茄平台的UI来实现
    }

    // 点击发布按钮
    await this.page.waitForSelector('button.publish-btn');
    await this.page.click('button.publish-btn');

    // 等待发布完成
    await this.page.waitForSelector(".success-message", { timeout: 10000 });

    const currentUrl = this.page.url();
    const publishTime = new Date().toISOString();

    return {
      success: true,
      publishTime,
      url: currentUrl,
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
```

### 3.5 数据库模型设计

```typescript
// src/models/Novel.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Chapter } from "./Chapter.js";

@Entity("novels")
export class Novel {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  category!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @Column()
  authorId!: string;

  @Column({ default: "draft" })
  status!: "draft" | "published" | "completed";

  @Column({ default: 0 })
  totalWords!: number;

  @Column({ default: 0 })
  totalChapters!: number;

  @OneToMany(() => Chapter, (chapter) => chapter.novel)
  chapters!: Chapter[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// src/models/Chapter.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Novel } from "./Novel.js";

@Entity("chapters")
export class Chapter {
  @PrimaryColumn()
  id!: string;

  @Column()
  novelId!: string;

  @ManyToOne(() => Novel, (novel) => novel.chapters)
  @JoinColumn({ name: "novelId" })
  novel!: Novel;

  @Column()
  title!: string;

  @Column("text")
  content!: string;

  @Column({ nullable: true })
  wordCount?: number;

  @Column({ nullable: true })
  chapterNumber?: number;

  @Column({ default: "draft" })
  status!: "draft" | "checked" | "published";

  @Column("float", { nullable: true })
  originalityScore?: number;

  @Column({ type: "datetime", nullable: true })
  publishTime?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// src/models/PublishTask.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("publish_tasks")
export class PublishTask {
  @PrimaryColumn()
  id!: string;

  @Column()
  chapterId!: string;

  @Column()
  novelId!: string;

  @Column({ type: "datetime" })
  scheduledTime!: Date;

  @Column({ default: "pending" })
  status!: "pending" | "processing" | "completed" | "failed";

  @Column("text", { nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  completedAt?: Date;
}
```

## 四、MCP工具配置

### 4.1 Cursor配置

在Cursor的MCP配置文件中添加：

```json
{
  "mcpServers": {
    "tomato-novel": {
      "command": "node",
      "args": [
        "--loader",
        "tsx/esm",
        "./dist/index.js"
      ],
      "env": {
        "OPENAI_API_KEY": "your-api-key",
        "TOMATO_USERNAME": "your-username",
        "TOMATO_PASSWORD": "your-password"
      }
    }
  }
}
```

或者使用编译后的JavaScript：

```json
{
  "mcpServers": {
    "tomato-novel": {
      "command": "node",
      "args": [
        "./dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 4.2 环境变量配置

```bash
# .env
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
TOMATO_USERNAME=your_username
TOMATO_PASSWORD=your_password
DATABASE_PATH=./data/db/novels.db
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### 4.3 TypeScript配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 4.4 package.json配置

```json
{
  "name": "tomato-novel-mcp",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "openai": "^4.0.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "puppeteer": "^21.0.0",
    "typeorm": "^0.3.17",
    "better-sqlite3": "^9.0.0",
    "ioredis": "^5.3.2",
    "node-cron": "^3.0.3",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/node-cron": "^3.0.11",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "vitest": "^1.0.0"
  }
}
```

## 五、使用示例

### 5.1 在Cursor中使用

用户可以通过自然语言与Cursor AI对话，Cursor会调用MCP工具：

```
用户: "帮我生成一篇都市系统流小说的第一章，5000字"

Cursor AI会自动调用:
- generate_chapter工具
- 生成内容后自动调用check_originality检测原创性
- 如果通过，保存到数据库
```

### 5.2 工作流示例

```
1. 创建小说
   → create_novel(novel_info)

2. 生成章节
   → generate_batch_chapters(novel_id, count=10)

3. 检测原创性
   → batch_check(chapter_ids)

4. 定时发布
   → schedule_publish(chapter_id, publish_time="2024-01-01T20:00:00")

5. 查看数据
   → get_novel_stats(novel_id)
```

## 六、安全与合规

### 6.1 安全措施

1. **API密钥管理**
   - 使用环境变量存储敏感信息
   - 支持密钥轮换
   - 不在代码中硬编码密钥

2. **账号安全**
   - 多账号隔离
   - Cookie加密存储
   - 登录状态检测和自动重连

3. **数据安全**
   - 数据库加密
   - 定期备份
   - 访问日志记录

### 6.2 合规建议

1. **遵守平台规则**
   - 仔细阅读番茄小说服务协议
   - 避免批量操作触发风控
   - 模拟人工操作节奏

2. **内容合规**
   - 敏感词过滤
   - 内容审核机制
   - 保留审核记录

3. **风险控制**
   - 多账号分散风险
   - 内容人工抽检
   - 异常监控告警

## 七、项目初始化

### 7.1 快速开始

#### 7.1.1 初始化项目

```bash
# 创建项目目录
mkdir tomato-novel-mcp
cd tomato-novel-mcp

# 初始化npm项目
npm init -y

# 安装依赖
npm install @modelcontextprotocol/sdk openai @anthropic-ai/sdk puppeteer typeorm better-sqlite3 ioredis node-cron zod axios dotenv winston

# 安装开发依赖
npm install -D @types/node @types/node-cron typescript tsx @typescript-eslint/eslint-plugin @typescript-eslint/parser

# 创建目录结构
mkdir -p src/{tools,resources,services,models,config,utils}
mkdir -p data/{db,cache}
mkdir -p tests
```

#### 7.1.2 配置文件

创建 `tsconfig.json`、`package.json` 和 `.env.example`（参考4.3和4.4节）

#### 7.1.3 环境变量设置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，填入你的API密钥和账号信息
```

#### 7.1.4 运行项目

```bash
# 开发模式（使用tsx直接运行TypeScript）
npm run dev

# 构建项目
npm run build

# 生产模式
npm run start
```

### 7.2 开发注意事项

1. **TypeScript配置**
   - 使用ES模块（`"type": "module"`）
   - 启用严格模式
   - 配置路径别名（可选）

2. **异步处理**
   - 所有工具处理器都应该是async函数
   - 使用try-catch处理错误
   - 使用Promise.all进行并发操作

3. **类型安全**
   - 使用Zod进行运行时验证
   - 定义清晰的接口类型
   - 避免使用any类型

4. **错误处理**
   - 统一错误处理机制
   - 记录详细错误日志
   - 返回友好的错误信息

## 八、实施计划

### 8.1 第一阶段：核心功能（2周）

- [ ] 搭建MCP服务器框架
- [ ] 实现内容生成工具
- [ ] 实现原创性检测工具
- [ ] 实现基础发布功能
- [ ] 数据库设计和实现

### 8.2 第二阶段：完善功能（2周）

- [ ] 实现定时发布功能
- [ ] 实现数据分析工具
- [ ] 实现封面生成功能
- [ ] 完善错误处理和日志

### 8.3 第三阶段：优化和测试（1周）

- [ ] 性能优化
- [ ] 单元测试和集成测试
- [ ] 文档完善
- [ ] 部署和配置

## 九、技术难点与解决方案

### 9.1 技术难点

1. **番茄平台反爬虫**
   - 问题：可能检测自动化操作
   - 解决：使用Puppeteer模拟真实用户，添加随机延迟和鼠标轨迹
   - TypeScript实现：使用`puppeteer-extra`和`puppeteer-extra-plugin-stealth`

2. **原创性检测成本**
   - 问题：API调用成本高
   - 解决：先使用本地模型预检，再调用API
   - TypeScript实现：使用本地文本相似度算法（如余弦相似度）进行预检

3. **内容质量保证**
   - 问题：AI生成内容可能质量不稳定
   - 解决：多模型对比，人工抽检，质量评分机制
   - TypeScript实现：使用Zod验证生成内容格式，实现质量评分函数

4. **并发发布控制**
   - 问题：多本小说同时发布可能触发限制
   - 解决：任务队列，限流控制，错峰发布
   - TypeScript实现：使用`bull`队列库，实现限流中间件

5. **TypeScript特有问题**
   - ES模块导入：确保使用`.js`扩展名（TypeScript编译后）
   - 类型定义：为第三方库提供类型定义
   - 异步错误：使用async/await和try-catch统一处理

### 9.2 性能优化

1. **批量处理**
   - 批量生成章节
   - 批量检测原创性
   - 批量发布（需谨慎）

2. **缓存策略**
   - Prompt模版缓存
   - 小说信息缓存
   - 统计数据缓存

3. **异步处理**
   - 使用async/await实现异步操作
   - 任务队列处理耗时操作
   - 使用Promise.all进行并发处理
   - 使用Promise.allSettled处理部分失败场景

4. **TypeScript优化**
   - 使用类型推断减少类型注解
   - 使用const断言优化字面量类型
   - 使用泛型提高代码复用性
   - 启用增量编译加速构建

## 十、扩展方向

### 10.1 功能扩展

1. **多平台支持**
   - 扩展到其他小说平台（起点、晋江等）
   - 统一接口，平台适配层

2. **AI模型切换**
   - 支持多个AI模型
   - 根据成本和质量需求自动选择

3. **智能优化**
   - 基于数据反馈自动优化Prompt
   - 自动调整发布时间
   - 智能标题生成

### 10.2 架构升级

1. **微服务化**
   - 拆分为多个独立的MCP服务器
   - 服务间通过消息队列通信

2. **分布式部署**
   - 支持多机器部署
   - 负载均衡和容错

## 十一、总结

### 11.1 方案优势

1. ✅ **标准化**：使用MCP协议，易于集成和扩展
2. ✅ **模块化**：功能清晰，易于维护
3. ✅ **可扩展**：易于添加新功能和平台支持
4. ✅ **AI友好**：天然支持AI对话式操作
5. ✅ **开发效率**：利用现有MCP生态，快速开发

### 11.2 适用场景

- ✅ 个人作者自动化发布
- ✅ 内容工作室批量运营
- ✅ AI内容生成实验
- ✅ 小说平台数据分析

### 11.3 TypeScript方案优势

相比Python方案，TypeScript方案具有以下优势：

1. **类型安全**：编译时类型检查，减少运行时错误
2. **开发体验**：更好的IDE支持和自动补全
3. **性能**：Node.js V8引擎性能优秀
4. **生态**：丰富的npm包生态
5. **部署**：单一可执行文件，部署简单
6. **维护**：类型定义即文档，易于维护

### 11.4 注意事项

⚠️ **重要提醒**：
1. 严格遵守平台规则，避免封号风险
2. 保证内容原创性，避免版权问题
3. 合理使用AI生成内容，注意合规性
4. 定期人工审核，保证内容质量

---

**方案版本**：v2.0 (TypeScript版)  
**创建日期**：2024年  
**技术栈**：TypeScript + Node.js + MCP SDK + Puppeteer  
**适用平台**：番茄小说（可扩展至其他平台）
