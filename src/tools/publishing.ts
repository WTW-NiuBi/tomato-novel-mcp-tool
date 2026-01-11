import { z } from "zod";
import { TomatoService } from "../services/tomatoService.js";
import { DatabaseService } from "../services/dbService.js";

const PublishChapterSchema = z.object({
  chapter_id: z.string().describe("章节ID"),
  novel_id: z.string().describe("小说ID"),
  publish_time: z.string().datetime().optional().describe("发布时间（ISO格式），不提供则立即发布"),
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
    try {
      const validatedArgs = PublishChapterSchema.parse(args);
      const { chapter_id, novel_id, publish_time } = validatedArgs;

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
            text: JSON.stringify(
              {
                success: true,
                chapter_id,
                publish_time: result.publishTime,
                url: result.url,
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
