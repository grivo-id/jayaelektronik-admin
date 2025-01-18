const formatDate = (date: string | number | Date): string => {
    if (!date) return '';
    const dt = new Date(date);
    return dt.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};

export default formatDate;
