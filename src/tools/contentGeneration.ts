import { z } from "zod";
import { AIService } from "../services/aiService.js";
import { DatabaseService } from "../services/dbService.js";
import { getPromptTemplate } from "../config/prompts/index.js";
import { v4 as uuidv4 } from "uuid";

const GenerateChapterSchema = z.object({
  novel_id: z.string().describe("小说ID"),
  category: z
    .enum(["urban_system", "urban_rebirth", "urban_romance", "suspense"])
    .describe("小说垂类"),
  word_count: z
    .number()
    .int()
    .min(1000)
    .max(10000)
    .default(5000)
    .describe("目标字数"),
  previous_summary: z.string().optional().describe("前文摘要，用于保持连贯性"),
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
    try {
      // 验证参数
      const validatedArgs = GenerateChapterSchema.parse(args);
      const { novel_id, category, word_count, previous_summary } = validatedArgs;

      // 获取Prompt模版
      const promptTemplate = await getPromptTemplate(category);

      // 构建完整Prompt
      const fullPrompt = promptTemplate
        .replace("{previous_summary}", previous_summary || "")
        .replace("{word_count}", word_count.toString());

      // 调用AI服务生成内容
      const aiService = new AIService();
      const result = await aiService.generateContent(fullPrompt);

      // 保存到数据库
      const dbService = new DatabaseService();
      await dbService.initialize();
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
            text: JSON.stringify(
              {
                chapter_id: chapterId,
                title: result.title,
                content: result.content,
                word_count: result.content.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: errorMessage }, null, 2),
          },
        ],
        isError: true,
      };
    }
  },
};
