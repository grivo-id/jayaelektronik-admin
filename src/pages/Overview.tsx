import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { useGetDashboardStatistics } from '../services/dashboardService';
import { useGetOrderStats } from '../services/orderService';
import { SkeletonOverview } from '../components';
import { useStore } from '../store/store';

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const formatIndonesianDate = (date: Date) => {
    const dayName = DAYS_ID[date.getDay()];
    const day = date.getDate();
    const month = MONTHS_ID[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
};

const getGreeting = (hour: number) => {
    if (hour >= 4 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 19) return 'Selamat sore';
    return 'Selamat malam';
};

const Overview = () => {
    const dispatch = useDispatch();
    const user = useStore((state) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        dispatch(setPageTitle('Overview'));
    });

    // Real-time clock ticker
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // WIB = UTC+7, WIT = UTC+9
    const wibTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const witTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Jayapura' }));

    const wibHour = wibTime.getHours();
    const greeting = getGreeting(wibHour);
    const adminName = user?.user_fname && user?.user_lname ? `${user.user_fname} ${user.user_lname}` : user?.user_fname || user?.user_email || 'Admin';

    const formatClock = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const { data, isFetching } = useGetDashboardStatistics();

    // Get today's date in YYYY-MM-DD format for WIB
    const todayStr = wibTime.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    const { data: todayOrderStats } = useGetOrderStats({
        startDate: todayStr,
        endDate: todayStr,
    });

    if (isFetching) {
        return <SkeletonOverview />;
    }

    return (
        <div>
            <div className="pt-5">
                {/* Welcome & Clock Card */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel h-full bg-gradient-to-r from-primary/90 to-primary/60 hover:from-primary hover:to-primary/70 duration-300 dark:from-primary/40 dark:to-primary/20 text-white relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            {/* Left: Greeting */}
                            <div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {greeting}, {adminName}!
                                </h2>
                                <p className="text-white/80 text-sm">{formatIndonesianDate(wibTime)}</p>
                            </div>

                            {/* Right: Clocks */}
                            <div className="flex gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center min-w-[120px]">
                                    <div className="text-xs text-white/70 uppercase tracking-wider mb-1">WIB</div>
                                    <div className="text-xl font-mono font-bold">{formatClock(wibTime)}</div>
                                    <div className="text-xs text-white/60">Jakarta</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center min-w-[120px]">
                                    <div className="text-xs text-white/70 uppercase tracking-wider mb-1">WIT</div>
                                    <div className="text-xl font-mono font-bold">{formatClock(witTime)}</div>
                                    <div className="text-xs text-white/60">Jayapura</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Order Card */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel h-full bg-white dark:bg-[#1b2e4b] relative overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                <h5 className="font-semibold text-lg dark:text-white-light">Pesanan Hari Ini</h5>
                            </div>
                            <span className="text-xs text-gray-400">{formatIndonesianDate(wibTime)}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-success/10 dark:bg-success/5 rounded-lg p-4 text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selesai</div>
                                <div className="text-2xl font-bold text-success">{todayOrderStats?.completed_orders ?? 0}</div>
                                <div className="text-xs text-success/70 mt-1">order</div>
                            </div>
                            <div className="bg-warning/10 dark:bg-warning/5 rounded-lg p-4 text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending</div>
                                <div className="text-2xl font-bold text-warning">{todayOrderStats?.pending_orders ?? 0}</div>
                                <div className="text-xs text-warning/70 mt-1">order</div>
                            </div>
                            <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pesanan</div>
                                <div className="text-2xl font-bold text-primary">{todayOrderStats?.total_orders ?? 0}</div>
                                <div className="text-xs text-primary/70 mt-1">order</div>
                            </div>
                            <div className="bg-info/10 dark:bg-info/5 rounded-lg p-4 text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pendapatan</div>
                                <div className="text-2xl font-bold text-info">Rp {(todayOrderStats?.total_revenue ?? 0).toLocaleString('id-ID')}</div>
                                <div className="text-xs text-info/70 mt-1">hari ini</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {data.data?.map((item, index) => {
                        const colors = ['primary', 'success', 'warning', 'danger', 'info', 'secondary'];
                        const color = colors[index % colors.length];

                        return (
                            <div key={item.title} className={`panel h-full bg-${color}/10 hover:bg-${color}/20 duration-300 dark:bg-${color}/5`}>
                                <div className="flex justify-between dark:text-white-light mb-5">
                                    <h5 className="font-semibold text-lg">{item.title}</h5>
                                    <span className={`badge bg-${color}/20 text-${color}`}>{item.desc}</span>
                                </div>
                                <div className={`text-3xl font-bold text-${color} mb-1`}>{item.data}</div>
                                <div className="text-gray-500 dark:text-gray-400">{item.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Overview;
