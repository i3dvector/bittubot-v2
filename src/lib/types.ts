export type Role = 'user' | 'assistant';

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
};

export type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};
