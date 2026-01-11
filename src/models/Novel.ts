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
