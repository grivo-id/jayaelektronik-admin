import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetLoyaltyConfig, useUpdateLoyaltyConfig } from '../../services/loyaltyService';
import Swal from 'sweetalert2';
import IconSettings from '../../components/Icon/IconSettings';
import IconCoins from '../../components/Icon/IconCoins';
import IconToggle from '../../components/Icon/IconToggle';
import IconTrophy from '../../components/Icon/IconTrophy';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';

const LoyaltyConfig = () => {
    const dispatch = useDispatch();
    const { data: config, isLoading } = useGetLoyaltyConfig();
    const { mutate: updateConfig } = useUpdateLoyaltyConfig();

    const [pointConversionRate, setPointConversionRate] = useState<number>(2000);
    const [birthdayBonusPoints, setBirthdayBonusPoints] = useState<number>(100);
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        dispatch(setPageTitle('Loyalty Configuration'));
    }, [dispatch]);

    useEffect(() => {
        if (config) {
            setPointConversionRate(config.point_conversion_rate);
            setBirthdayBonusPoints(config.birthday_bonus_points);
            setIsActive(config.is_active);
        }
    }, [config]);

    const handleSave = () => {
        Swal.fire({
            icon: 'question',
            title: 'Save Configuration?',
            text: 'This will update the loyalty program settings for all customers.',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                updateConfig(
                    {
                        point_conversion_rate: pointConversionRate,
                        birthday_bonus_points: birthdayBonusPoints,
                        is_active: isActive,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire('Success', 'Configuration updated successfully', 'success');
                        },
                        onError: (error: any) => {
                            Swal.fire('Error', error.response?.data?.message || 'Failed to update configuration', 'error');
                        },
                    }
                );
            }
        });
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const calculatePoints = (amount: number) => {
        return Math.floor(amount / pointConversionRate);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loyalty Configuration</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage loyalty program settings and point calculations</p>
                </div>
            </div>

            {isLoading ? (
                <div className="panel p-4">Loading...</div>
            ) : (
                <div className="space-y-6">
                    {/* Program Status */}
                    <div className="panel">
                        <div className="flex items-center gap-3 mb-4">
                            <IconToggle className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Program Status</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Enable Loyalty Program</div>
                                <div className="text-sm text-gray-500">
                                    When disabled, customers will not earn or redeem points
                                </div>
                            </div>
                            <label className="w-14 h-8 relative inline-block">
                                <input
                                    type="checkbox"
                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark before:bottom-1 before:w-6 before:h-6 before:rounded-full peer-checked:before:left-[2.6rem] peer-checked:bg-success before:transition-all before:duration-300"></span>
                            </label>
                        </div>
                    </div>

                    {/* Point Conversion Rate */}
                    <div className="panel">
                        <div className="flex items-center gap-3 mb-4">
                            <IconCoins className="w-5 h-5 text-warning" />
                            <h3 className="text-lg font-semibold">Point Conversion Rate</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Conversion Rate (Rp per Point)</label>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg">Rp</span>
                                    <input
                                        type="number"
                                        className="form-input flex-1"
                                        value={pointConversionRate}
                                        onChange={(e) => setPointConversionRate(parseInt(e.target.value) || 0)}
                                        min="100"
                                        step="100"
                                    />
                                    <span className="text-lg">= 1 Point</span>
                                </div>
                                <div className="mt-3 p-3 bg-info/10 rounded-lg">
                                    <div className="flex items-start gap-2 text-sm">
                                        <IconInfoCircle className="w-4 h-4 mt-0.5 text-info flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-info">Example Calculation:</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                • Rp {formatNumber(10_000)} = {calculatePoints(10_000)} points
                                                <br />
                                                • Rp {formatNumber(50_000)} = {calculatePoints(50_000)} points
                                                <br />• Rp {formatNumber(100_000)} = {calculatePoints(100_000)} points
                                                <br />• Rp {formatNumber(500_000)} = {calculatePoints(500_000)} points
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Birthday Bonus */}
                    <div className="panel">
                        <div className="flex items-center gap-3 mb-4">
                            <IconTrophy className="w-5 h-5 text-success" />
                            <h3 className="text-lg font-semibold">Birthday Bonus</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Bonus Points on Birthday</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        className="form-input w-40"
                                        value={birthdayBonusPoints}
                                        onChange={(e) => setBirthdayBonusPoints(parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <span className="text-lg">points</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Customers will automatically receive these bonus points on their birthday (if the program is active)
                                </div>
                            </div>

                            <div className="p-3 bg-success/10 rounded-lg">
                                <div className="flex items-start gap-2 text-sm">
                                    <IconInfoCircle className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                    <div>
                                        <div className="font-medium text-success">Birthday Value:</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {birthdayBonusPoints} points ≈ Rp {formatNumber(birthdayBonusPoints * pointConversionRate)} value
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="panel">
                        <div className="flex items-center gap-3 mb-4">
                            <IconSettings className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Configuration Summary</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm text-gray-500">Program Status</div>
                                <div className={`font-semibold ${isActive ? 'text-success' : 'text-danger'}`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm text-gray-500">Conversion Rate</div>
                                <div className="font-semibold">Rp {formatNumber(pointConversionRate)} / Point</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm text-gray-500">Birthday Bonus</div>
                                <div className="font-semibold">{formatNumber(birthdayBonusPoints)} Points</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm text-gray-500">Birthday Value</div>
                                <div className="font-semibold">Rp {formatNumber(birthdayBonusPoints * pointConversionRate)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                                if (config) {
                                    setPointConversionRate(config.point_conversion_rate);
                                    setBirthdayBonusPoints(config.birthday_bonus_points);
                                    setIsActive(config.is_active);
                                }
                            }}
                        >
                            Reset
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save Configuration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyConfig;
