import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("publish_tasks")
export class PublishTask {
  @PrimaryColumn()
  id!: string;

  @Column()
  chapterId!: string;

  @Column()
  novelId!: string;

  @Column({ type: "datetime" })
  scheduledTime!: Date;

  @Column({ default: "pending" })
  status!: "pending" | "processing" | "completed" | "failed";

  @Column("text", { nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  completedAt?: Date;
}
