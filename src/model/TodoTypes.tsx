export type Todo = {
  id: number;
  user_id: string;
  title: string;
  detail: string;
  deadline: string;
  completed: boolean;
  booked_count: number;
  cheered_count: number;
  comment_count: number;
  is_booked_me: boolean;
  is_cheered_me: boolean;
};

export type PostInput = {
  title: string;
  detail: string;
  deadline: string;
  completed: boolean;
};

export type CommentInput = {
  commentText: string;
};
