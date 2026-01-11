import { z } from "zod";
import { OriginalityService } from "../services/originalityService.js";
import { DatabaseService } from "../services/dbService.js";

const CheckOriginalitySchema = z.object({
  chapter_id: z.string().describe("章节ID"),
});

type CheckOriginalityArgs = z.infer<typeof CheckOriginalitySchema>;

export const checkOriginalityTool = {
  definition: {
    name: "check_originality",
    description: "检测章节内容的原创性",
    inputSchema: {
      type: "object",
      properties: {
        chapter_id: {
          type: "string",
          description: "章节ID",
        },
      },
      required: ["chapter_id"],
    },
  },

  async handler(args: unknown) {
    try {
      const validatedArgs = CheckOriginalitySchema.parse(args);
      const { chapter_id } = validatedArgs;

      // 获取章节内容
      const dbService = new DatabaseService();
      await dbService.initialize();
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

      // 检测原创性
      const originalityService = new OriginalityService();
      const result = await originalityService.checkContent(chapter.content);

      // 更新数据库
      await dbService.updateChapterStatus(chapter_id, {
        originalityScore: result.similarity,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                chapter_id,
                similarity: result.similarity,
                passed: result.similarity < 0.25,
                report: result.report,
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
