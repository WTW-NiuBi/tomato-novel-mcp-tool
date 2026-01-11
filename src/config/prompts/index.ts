import * as fs from "fs/promises";
import * as path from "path";

type Category = "urban_system" | "urban_rebirth" | "urban_romance" | "suspense";

const promptCache: Map<Category, string> = new Map();

export async function getPromptTemplate(category: Category): Promise<string> {
  // 先从缓存获取
  if (promptCache.has(category)) {
    return promptCache.get(category)!;
  }

  // 从文件读取
  const promptFile = path.join(
    process.cwd(),
    "prompt",
    `${category}.md`
  );

  try {
    // 如果文件不存在，返回默认模板
    const content = await fs.readFile(promptFile, "utf-8");
    promptCache.set(category, content);
    return content;
  } catch (error) {
    // 返回默认模板
    return getDefaultPrompt(category);
  }
}

function getDefaultPrompt(category: Category): string {
  const basePrompt = `你是一位专业的网络小说作家，擅长创作${getCategoryName(category)}小说。

任务：创作一篇原创的${getCategoryName(category)}小说章节

要求：
1. 完全原创，不得抄袭或模仿任何现有作品
2. 类型：${getCategoryName(category)}
3. 字数：{word_count}字左右
4. 情节：推进主线剧情，保持悬念
5. 人物：保持人物性格一致性

前文摘要：
{previous_summary}

输出格式：
标题：[章节标题]
正文：[章节内容]`;

  return basePrompt;
}

function getCategoryName(category: Category): string {
  const names: Record<Category, string> = {
    urban_system: "都市系统流",
    urban_rebirth: "都市重生",
    urban_romance: "都市言情",
    suspense: "悬疑推理",
  };
  return names[category] || "网络小说";
}
