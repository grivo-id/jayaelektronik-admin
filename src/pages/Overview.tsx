import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconInfoCircle from '../components/Icon/IconInfoCircle';
import { useGetDashboardStatistics } from '../services/dashboardService';
import { SkeletonOverview } from '../components';

const Overview = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Overview'));
    });
    const { data, isFetching } = useGetDashboardStatistics();

    if (isFetching) {
        return <SkeletonOverview />;
    }

    return (
        <div>
            <div className="pt-5">
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel h-full bg-primary/10 hover:bg-primary/20 duration-300 dark:bg-primary/5">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Welcome to the Jaya Elektronik Dashboard!</h5>
                            <IconInfoCircle className="w-5 h-5 ml-2 text-primary" />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                            <p className="mb-4">This dashboard will help you manage your electronics store more efficiently. Here are some key features available:</p>
                            <ul className="list-disc list-inside space-y-2 mb-4">
                                <li>Product & Category Management</li>
                                <li>Blog & Content Management</li>
                                <li>Sales Analytics</li>
                                <li>Reports and Statistics</li>
                            </ul>
                            <p>Please use the menu on the left to access the various available features.</p>
                        </div>
                    </div>
                </div>

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
