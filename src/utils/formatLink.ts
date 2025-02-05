export function formatLink(id: string, title: string): string {
    const formattedTitle = title.replace(/\s+/g, '-');

    return `https://jayaelektronik.com/ina/products/${id}.${formattedTitle}`;
}
