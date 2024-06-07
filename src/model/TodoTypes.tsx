export type Todo = {
  id: number;
  user_id: string;
  title: string;
  detail: string;
  deadline: string;
  completed: boolean;
  favorite_count: number;
  booked_count: number;
  cheered_count: number;
  is_favorite_me: boolean;
  is_booked_me: boolean;
  is_cheered_me: boolean;
};

export type PostInput = {
  title: string;
  detail: string;
  deadline: Date;
};
