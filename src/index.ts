#!/usr/bin/env node

import "reflect-metadata";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

// 导入工具
import { generateChapterTool } from "./tools/contentGeneration.js";
import { checkOriginalityTool } from "./tools/originalityCheck.js";
import { publishChapterTool } from "./tools/publishing.js";
import { getNovelStatsTool } from "./tools/analytics.js";

// 导入资源处理器
import { listResources, readResource } from "./resources/index.js";

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
    // TODO: 添加更多工具
  ],
}));

// 注册工具处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: errorMessage,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// 注册资源列表
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: await listResources(),
}));

// 注册资源读取处理器
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  return await readResource(uri);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tomato Novel MCP server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
