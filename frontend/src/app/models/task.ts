export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  priority: 'High' | 'Medium' | 'Low';
  categories: string[];
  createdAt: string;
  updatedAt: string;
}
