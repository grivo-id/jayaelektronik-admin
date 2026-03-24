import { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '@/assets/css/date-range.css';

export type DateRangeValue = '30d' | '90d' | '1y' | 'custom';

interface DateRangeFilterProps {
    value: DateRangeValue;
    startDate?: string;
    endDate?: string;
    onChange: (value: DateRangeValue, startDate?: string, endDate?: string) => void;
}

const DateRangeFilter = ({ value, startDate, endDate, onChange }: DateRangeFilterProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Helper functions - defined before state to avoid initialization issues
    // Helper to parse date string (YYYY-MM-DD) to local Date object
    const parseLocalDate = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number);
        // Create Date using local timezone (midnight local time)
        return new Date(year, month - 1, day, 0, 0, 0);
    };

    // Helper to convert local Date to YYYY-MM-DD string (using local timezone)
    const toLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format Date for display using local timezone
    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format date string to display using local timezone
    const formatDate = (dateStr: string): string => {
        const date = parseLocalDate(dateStr);
        return formatDisplayDate(date);
    };

    // Local state for pending changes when in custom mode
    const [pendingRange, setPendingRange] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
        key: string;
    }>({
        startDate: startDate ? parseLocalDate(startDate) : undefined,
        endDate: endDate ? parseLocalDate(endDate) : undefined,
        key: 'selection',
    });
    const [hasPendingChanges, setHasPendingChanges] = useState(false);

    // Sync when props change
    useEffect(() => {
        setPendingRange({
            startDate: startDate ? parseLocalDate(startDate) : undefined,
            endDate: endDate ? parseLocalDate(endDate) : undefined,
            key: 'selection',
        });
        setHasPendingChanges(false);
    }, [value, startDate, endDate]);

    const getDateRange = (option: DateRangeValue): { start: string; end: string } => {
        const now = new Date();
        // Reset to local midnight
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = toLocalDateString(today);
        let start: string;

        switch (option) {
            case '30d': {
                const d = new Date(today);
                d.setDate(d.getDate() - 30);
                start = toLocalDateString(d);
                break;
            }
            case '90d': {
                const d = new Date(today);
                d.setDate(d.getDate() - 90);
                start = toLocalDateString(d);
                break;
            }
            case '1y': {
                const d = new Date(today);
                d.setFullYear(d.getFullYear() - 1);
                start = toLocalDateString(d);
                break;
            }
            default:
                start = end;
        }

        return { start, end };
    };

    const presets: { value: DateRangeValue; label: string }[] = [
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
        { value: '1y', label: 'This Year' },
        { value: 'custom', label: 'Custom' },
    ];

    // Use actual dates for custom mode, otherwise calculate from preset
    const currentRange = value === 'custom' && startDate && endDate ? { start: startDate, end: endDate } : getDateRange(value);

    const handlePresetClick = (presetValue: DateRangeValue) => {
        if (presetValue === 'custom') {
            setShowCalendar(!showCalendar);
        } else {
            const range = getDateRange(presetValue);
            onChange(presetValue, range.start, range.end);
            setShowCalendar(false);
        }
    };

    const handleRangeChange = (item: any) => {
        const selection = item.selection;
        setPendingRange(selection);
        if (selection.startDate && selection.endDate) {
            setHasPendingChanges(true);
        }
    };

    const handleApply = () => {
        if (pendingRange.startDate && pendingRange.endDate) {
            const start = toLocalDateString(pendingRange.startDate);
            const end = toLocalDateString(pendingRange.endDate);
            onChange('custom', start, end);
            setHasPendingChanges(false);
            setShowCalendar(false);
        }
    };

    const handleReset = () => {
        setPendingRange({
            startDate: startDate ? parseLocalDate(startDate) : undefined,
            endDate: endDate ? parseLocalDate(endDate) : undefined,
            key: 'selection',
        });
        setHasPendingChanges(false);
    };

    const handleClose = () => {
        if (!hasPendingChanges) {
            setShowCalendar(false);
        } else {
            handleReset();
            setShowCalendar(false);
        }
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showCalendar, hasPendingChanges]);

    return (
        <div className="relative">
            {/* Tab-style Preset Buttons */}
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            value === preset.value ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        onClick={() => handlePresetClick(preset.value)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Current Range Display */}
            <div className="inline-block ml-3 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(currentRange.start)} - {formatDate(currentRange.end)}
            </div>

            {/* Custom Date Range Calendar Panel */}
            {showCalendar && (
                <div
                    ref={calendarRef}
                    className="absolute top-full right-0 mt-2 z-[100] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 max-w-[95vw] w-[340px]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Select Date Range</div>
                        <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onClick={handleClose}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar */}
                    <div className="mb-4">
                        <DateRange
                            ranges={[pendingRange]}
                            onChange={handleRangeChange}
                            moveRangeOnFirstSelection={false}
                            rangeColors={['#3b82f6']}
                            minDate={new Date(2020, 0, 1)}
                            maxDate={new Date()}
                            direction="vertical"
                            months={1}
                            showMonthAndYearPickers={true}
                        />
                    </div>

                    {/* Selected Range Display */}
                    {pendingRange.startDate && pendingRange.endDate && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected Range</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatDisplayDate(pendingRange.startDate)} - {formatDisplayDate(pendingRange.endDate)}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleApply}
                            disabled={!pendingRange.startDate || !pendingRange.endDate}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;
