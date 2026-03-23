const formatChartAxis = (value: number): string => {
    if (value >= 1_000_000_000) {
        // Milyar (billion)
        return `${(value / 1_000_000_000).toFixed(1)} M`;
    } else if (value >= 1_000_000) {
        // Juta (million)
        return `${(value / 1_000_000).toFixed(1)} JT`;
    } else if (value >= 1000) {
        // Ribu (thousand)
        return `${(value / 1000).toFixed(0)} Rb`;
    }
    return value.toString();
};

export default formatChartAxis;
