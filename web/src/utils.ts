export function getRandomSVG(imageModules: Record<string, unknown>): string {
    const imagePaths = Object.keys(imageModules);
    return imagePaths[Math.floor(Math.random() * imagePaths.length)];
}

export const getGuildInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

export const createPlaceholderIcon = (initials: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#505050'; // Gray background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF'; // White text
        ctx.font = '30px Whitney, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
    }
    return canvas.toDataURL();
};

export const getGuildIconUrl = (guildId: string, icon: string | null, guildName: string) => {
    return icon ? `https://cdn.discordapp.com/icons/${guildId}/${icon}.png` : createPlaceholderIcon(getGuildInitials(guildName));
};