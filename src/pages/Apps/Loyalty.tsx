import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetLoyaltyConfig } from '../../services/loyaltyService';
import { Link } from 'react-router-dom';
import IconAward from '../../components/Icon/IconAward';
import IconUsers from '../../components/Icon/IconUsers';
import IconCoins from '../../components/Icon/IconCoins';
import IconGift from '../../components/Icon/IconGift';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';

const Loyalty = () => {
    const dispatch = useDispatch();
    const { data: config, isLoading } = useGetLoyaltyConfig();

    useEffect(() => {
        dispatch(setPageTitle('Loyalty Program'));
    }, [dispatch]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loyalty Program</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage customer loyalty and rewards</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {config?.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Configuration Summary */}
            <div className="panel mb-6">
                <h3 className="text-lg font-semibold mb-4">Program Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Program Status</div>
                        <div className={`font-semibold ${config?.is_active ? 'text-success' : 'text-danger'}`}>{config?.is_active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Conversion Rate</div>
                        <div className="font-semibold">Rp {formatNumber(config?.point_conversion_rate || 2000)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Birthday Bonus</div>
                        <div className="font-semibold">{formatNumber(config?.birthday_bonus_points || 100)} pts</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Birthday Value</div>
                        <div className="font-semibold">Rp {formatNumber((config?.birthday_bonus_points || 100) * (config?.point_conversion_rate || 2000))}</div>
                    </div>
                </div>
            </div>

            {/* Point Calculation Examples */}
            <div className="panel mb-6">
                <h3 className="text-lg font-semibold mb-4">Point Calculation Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Rp 50,000 Purchase</div>
                        <div className="text-lg font-bold text-info">{Math.floor(50000 / (config?.point_conversion_rate || 2000))} points</div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Rp 100,000 Purchase</div>
                        <div className="text-lg font-bold text-info">{Math.floor(100000 / (config?.point_conversion_rate || 2000))} points</div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Rp 500,000 Purchase</div>
                        <div className="text-lg font-bold text-info">{Math.floor(500000 / (config?.point_conversion_rate || 2000))} points</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="panel">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/admin/loyalty/customers" className="btn btn-outline-primary flex items-center justify-center gap-2">
                        <IconUsers className="w-4 h-4" />
                        <span>Manage Customers</span>
                    </Link>
                    <Link to="/admin/loyalty/tiers" className="btn btn-outline-success flex items-center justify-center gap-2">
                        <IconAward className="w-4 h-4" />
                        <span>Manage Tiers</span>
                    </Link>
                    <Link to="/admin/loyalty/bonuses" className="btn btn-outline-info flex items-center justify-center gap-2">
                        <IconGift className="w-4 h-4" />
                        <span>Manage Bonuses</span>
                    </Link>
                    <Link to="/admin/loyalty/config" className="btn btn-outline-warning flex items-center justify-center gap-2">
                        <IconTrendingUp className="w-4 h-4" />
                        <span>Configuration</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Loyalty;
