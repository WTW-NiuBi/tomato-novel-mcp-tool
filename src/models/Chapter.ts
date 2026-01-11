import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Novel } from "./Novel.js";

@Entity("chapters")
export class Chapter {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  novelId!: string;

  @ManyToOne(() => Novel, (novel) => novel.chapters)
  @JoinColumn({ name: "novelId" })
  novel!: Novel;

  @Column("varchar")
  title!: string;

  @Column("text")
  content!: string;

  @Column("integer", { nullable: true })
  wordCount?: number;

  @Column("integer", { nullable: true })
  chapterNumber?: number;

  @Column("varchar", { default: "draft" })
  status!: "draft" | "checked" | "published";

  @Column("float", { nullable: true })
  originalityScore?: number;

  @Column({ type: "datetime", nullable: true })
  publishTime?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
