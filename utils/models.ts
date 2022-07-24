export interface Task {
  task_id: string;
  title: string;
  description: string;
  author_id: number;
  status: string;
  priority: number;
  date_due: Date;
  createdAt: Date;
  updatedAt: Date;
}
