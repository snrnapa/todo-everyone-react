export type Todo = {
  user_id: string;
  title: string;
  deadline: string;
  detail: string;
  completed: boolean;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

export type PostInput = {
  title: string;
  detail: string;
  deadline: Date;
};
