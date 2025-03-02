export function getRandomSVG(imageModules: Record<string, unknown>): string {
    const imagePaths = Object.keys(imageModules);
    return imagePaths[Math.floor(Math.random() * imagePaths.length)];
}