import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("publish_tasks")
export class PublishTask {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  chapterId!: string;

  @Column("varchar")
  novelId!: string;

  @Column({ type: "datetime" })
  scheduledTime!: Date;

  @Column("varchar", { default: "pending" })
  status!: "pending" | "processing" | "completed" | "failed";

  @Column("text", { nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  completedAt?: Date;
}
