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
  private readonly cookiesFile = path.join(
    process.cwd(),
    "data",
    "tomato_cookies.json"
  );
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
      // TODO: 实现定时发布逻辑
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
