import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconInfoCircle from '../components/Icon/IconInfoCircle';

const Overview = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Overview'));
    });

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

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <div className="panel h-full bg-primary/10 hover:bg-primary/20 duration-300 dark:bg-primary/5">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Total Products</h5>
                            <span className="badge bg-primary/20 text-primary">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-1">150+</div>
                        <div className="text-gray-500 dark:text-gray-400">Available products</div>
                    </div>

                    <div className="panel h-full bg-success/10 hover:bg-success/20 duration-300 dark:bg-success/5">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Categories</h5>
                            <span className="badge bg-success/20 text-success">Update</span>
                        </div>
                        <div className="text-3xl font-bold text-success mb-1">10</div>
                        <div className="text-gray-500 dark:text-gray-400">Product categories</div>
                    </div>

                    <div className="panel h-full bg-warning/10 hover:bg-warning/20 duration-300 dark:bg-warning/5">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Blog Posts</h5>
                            <span className="badge bg-warning/20 text-warning">New</span>
                        </div>
                        <div className="text-3xl font-bold text-warning mb-1">25+</div>
                        <div className="text-gray-500 dark:text-gray-400">Blog articles</div>
                    </div>

                    <div className="panel h-full bg-info/10 hover:bg-info/20 duration-300 dark:bg-info/5">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Visitors</h5>
                            <span className="badge bg-info/20 text-info">Today</span>
                        </div>
                        <div className="text-3xl font-bold text-info mb-1">200</div>
                        <div className="text-gray-500 dark:text-gray-400">Visitors today</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
