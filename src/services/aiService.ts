import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export interface GenerateContentResult {
  title: string;
  content: string;
}

export class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async generateContent(
    prompt: string,
    model: "openai" | "anthropic" = "openai"
  ): Promise<GenerateContentResult> {
    if (model === "openai" && this.openai) {
      return await this.generateWithOpenAI(prompt);
    } else if (model === "anthropic" && this.anthropic) {
      return await this.generateWithAnthropic(prompt);
    } else {
      throw new Error(`AI service not available for model: ${model}`);
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<GenerateContentResult> {
    if (!this.openai) {
      throw new Error("OpenAI API key not configured");
    }

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
    const title =
      lines.find((line) => line.startsWith("标题："))?.replace("标题：", "").trim() ||
      "未命名章节";
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
    if (!this.anthropic) {
      throw new Error("Anthropic API key not configured");
    }

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

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const lines = content.split("\n");
    const title =
      lines.find((line) => line.startsWith("标题："))?.replace("标题：", "").trim() ||
      "未命名章节";
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
