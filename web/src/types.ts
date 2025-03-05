// Responses from the server
export type User = {
  userId: string;
  username: string;
  avatarUrl: string;
};

export type Guild = {
    guildId: string;
    guildName: string;
    iconUrl: string;
    channelId?: string;
    identifier?: string;
}