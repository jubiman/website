// Processes api calls to the server and transforms the responses into typescript types
import axios from 'axios';
import type { User, Guild } from '@/types';

// Get the current user
export async function getCurrentUser(): Promise<User> {
    const response = await axios.get('/api/jubicord/v1/users/me');
    return response.data;
}

// Get the guilds the user is in
export async function getGuilds(): Promise<Guild[]> {
    const response = await axios.get('/api/jubicord/v1/guilds');
    return response.data.guilds;
}

// Get the guild by id
export async function getGuild(id: string): Promise<Guild> {
    const response = await axios.get(`/api/jubicord/v1/guilds/${id}`);
    return response.data;
}

// Get superusers
export async function getSuperusers(guildId: string, params: {}): Promise<User[]> {
    const response = await axios.get(`/api/jubicord/v1/guilds/${guildId}/superusers`, { params });
    return response.data.superusers;
}