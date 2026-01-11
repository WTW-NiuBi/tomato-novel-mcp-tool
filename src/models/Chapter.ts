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
  @PrimaryColumn()
  id!: string;

  @Column()
  novelId!: string;

  @ManyToOne(() => Novel, (novel) => novel.chapters)
  @JoinColumn({ name: "novelId" })
  novel!: Novel;

  @Column()
  title!: string;

  @Column("text")
  content!: string;

  @Column({ nullable: true })
  wordCount?: number;

  @Column({ nullable: true })
  chapterNumber?: number;

  @Column({ default: "draft" })
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
