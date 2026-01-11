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
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  title!: string;

  @Column("varchar")
  category!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("varchar", { nullable: true })
  coverUrl?: string;

  @Column("varchar")
  authorId!: string;

  @Column("varchar", { default: "draft" })
  status!: "draft" | "published" | "completed";

  @Column("integer", { default: 0 })
  totalWords!: number;

  @Column("integer", { default: 0 })
  totalChapters!: number;

  @OneToMany(() => Chapter, (chapter) => chapter.novel)
  chapters!: Chapter[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
