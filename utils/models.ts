export interface Config {
  page: number;
  order: string;
  sort: string;
  priority: string;
  status: string;
  search: string;
  perPage: string;
}

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
