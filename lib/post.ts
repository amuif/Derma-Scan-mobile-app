import { API_URL } from '@/constants/backend-url';
import { CreatePost, Post, UpdatePost } from '@/types/posts';

export const postApi = {
  createPost: async ({
    title,
    content,
    category,
    language,
    authorId,
    status,
    token,
  }: CreatePost) => {
    console.table({
      title,
      content,
      category,
      language,
      authorId,
      status,
      token,
    });
    try {
      const response = await fetch(`${API_URL}/education/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
          language,
          authorId,
          status,
        }),
      });
      return response.json();
    } catch (error) {
      console.log('Error creating post', error);
    }
  },
  findAllAllowedPosts: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/education/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.log('Error creating post', error);
    }
  },
  findAllowedPosts: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json() as unknown as Post[];
    } catch (error) {
    console.log('Error creating post', error);
      return []
    }
  },
  updatePost: async ({
    title,
    content,
    category,
    language,
    status,
    token,
  }: UpdatePost) => {
    const form = new FormData();
    if (title) {
      form.append('title', title);
    }
    if (content) {
      form.append('content', content);
    }
    if (status) {
      form.append('status', status);
    }
    if (language) {
      form.append('language', language);
    }
    if (category) {
      form.append('category', category);
    }
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      return response.json();
    } catch (error) {
      console.log('Error creating post', error);
    }
  },
  deletePost: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      return response.json();
    } catch (error) {
      console.log('Error creating post', error);
    }
  },
};
