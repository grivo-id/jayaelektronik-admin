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

    // Local state for pending changes when in custom mode
    const [pendingRange, setPendingRange] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
        key: string;
    }>({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        key: 'selection',
    });
    const [hasPendingChanges, setHasPendingChanges] = useState(false);

    // Sync when props change
    useEffect(() => {
        setPendingRange({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            key: 'selection',
        });
        setHasPendingChanges(false);
    }, [value, startDate, endDate]);

    const getDateRange = (option: DateRangeValue): { start: string; end: string } => {
        const now = new Date();
        const end = now.toISOString().split('T')[0];
        let start: string;

        switch (option) {
            case '30d':
                start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
                break;
            case '90d':
                start = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0];
                break;
            case '1y':
                start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
                break;
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

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const currentRange = getDateRange(value);

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
            const start = pendingRange.startDate.toISOString().split('T')[0];
            const end = pendingRange.endDate.toISOString().split('T')[0];
            onChange('custom', start, end);
            setHasPendingChanges(false);
            setShowCalendar(false);
        }
    };

    const handleReset = () => {
        setPendingRange({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
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
                            value === preset.value
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={handleClose}
                        >
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
                            direction="horizontal"
                            months={1}
                            showMonthAndYearPickers={true}
                            showDateDisplay={false}
                        />
                    </div>

                    {/* Selected Range Display */}
                    {pendingRange.startDate && pendingRange.endDate && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected Range</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatDate(pendingRange.startDate.toISOString().split('T')[0])} - {formatDate(pendingRange.endDate.toISOString().split('T')[0])}
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
