import { DatabaseService } from "../services/dbService.js";

export async function listResources() {
  return [
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
  ];
}

export async function readResource(uri: string) {
  const dbService = new DatabaseService();
  await dbService.initialize();

  if (uri.startsWith("novel://")) {
    const novelId = uri.replace("novel://", "");
    // TODO: 实现获取小说信息的逻辑
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({ novel_id: novelId, message: "Not implemented" }, null, 2),
        },
      ],
    };
  } else if (uri.startsWith("chapter://")) {
    const chapterId = uri.replace("chapter://", "");
    const chapter = await dbService.getChapter(chapterId);
    if (chapter) {
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: chapter.content,
          },
        ],
      };
    } else {
      throw new Error(`Chapter not found: ${chapterId}`);
    }
  } else {
    throw new Error(`Unknown resource URI: ${uri}`);
  }
}
