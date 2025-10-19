import { User } from './user.d.ts';
const EducationCategory = {
  TIPS: 'TIPS',
  PREVENTION: 'PREVENTION',
  AWARENESS: 'AWARENESS',
  TREATMENT: 'TREATMENT',
};

export interface CreatePost {
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  authorId: string;
  status: string;
  token: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  author: User;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  category?: EducationCategory;
  language?: string;
  status?: Status;
  token: string;
}
