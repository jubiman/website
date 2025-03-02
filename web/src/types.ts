// Responses from the server
export type User = {
  id: string;
  name: string;
};

export type Guild = {
    id: string;
    name: string;
    icon: string;
    config: {
        channelId: string;
        identifier: string;
    }
}