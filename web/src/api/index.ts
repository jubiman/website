// Processes api calls to the server and transforms the responses into typescript types
import axios from 'axios';
import { User, Guild } from '@/types';

// Get the current user
export async function getCurrentUser(): Promise<User> {
  const response = await axios.get('/api/users/me');
  return response.data;
}

// Get the guilds the user is in
export async function getGuilds(): Promise<Guild[]> {
  const response = await axios.get('/api/guilds');
  return response.data;
}

// Get the guild by id
export async function getGuild(id: string): Promise<Guild> {
  const response = await axios.get(`/api/guilds/${id}`);
  return response.data;
}