import { DataSource, Repository } from "typeorm";
import { Novel } from "../models/Novel.js";
import { Chapter } from "../models/Chapter.js";
import { PublishTask } from "../models/PublishTask.js";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export class DatabaseService {
  private dataSource: DataSource | null = null;
  private initialized = false;

  private async getDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = new DataSource({
        type: "better-sqlite3",
        database:
          process.env.DATABASE_PATH ||
          path.join(process.cwd(), "data", "db", "novels.db"),
        entities: [Novel, Chapter, PublishTask],
        synchronize: true, // 开发环境使用，生产环境应使用migrations
        logging: process.env.NODE_ENV === "development",
      });
    }
    return this.dataSource;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const dataSource = await this.getDataSource();
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    this.initialized = true;
  }

  async saveChapter(data: {
    novelId: string;
    title: string;
    content: string;
    wordCount: number;
    category: string;
  }): Promise<string> {
    await this.initialize();
    const dataSource = await this.getDataSource();
    const chapterRepo = dataSource.getRepository(Chapter);

    const chapter = chapterRepo.create({
      id: `chapter_${Date.now()}_${uuidv4().substring(0, 8)}`,
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
    const dataSource = await this.getDataSource();
    const chapterRepo = dataSource.getRepository(Chapter);
    return await chapterRepo.findOne({ where: { id: chapterId } });
  }

  async updateChapterStatus(
    chapterId: string,
    updates: {
      status?: string;
      publishTime?: string;
      originalityScore?: number;
    }
  ): Promise<void> {
    await this.initialize();
    const dataSource = await this.getDataSource();
    const chapterRepo = dataSource.getRepository(Chapter);
    const updateData: any = {};
    if (updates.status) updateData.status = updates.status;
    if (updates.publishTime)
      updateData.publishTime = new Date(updates.publishTime);
    if (updates.originalityScore !== undefined)
      updateData.originalityScore = updates.originalityScore;
    await chapterRepo.update(chapterId, updateData);
  }

  async listChapters(novelId: string): Promise<Chapter[]> {
    await this.initialize();
    const dataSource = await this.getDataSource();
    const chapterRepo = dataSource.getRepository(Chapter);
    return await chapterRepo.find({
      where: { novelId },
      order: { chapterNumber: "ASC" },
    });
  }
}
