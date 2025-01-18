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
                    <div className="panel h-full bg-gradient-to-r from-primary/20 to-primary-light hover:from-primary/30 hover:to-primary-light/70 duration-300">
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
                    <div className="panel h-full bg-gradient-to-br from-primary-light/50 via-primary/20 to-transparent hover:from-primary-light hover:via-primary/30 hover:to-transparent duration-300 cursor-pointer">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Total Products</h5>
                            <span className="badge bg-primary/20 text-primary">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-1">150+</div>
                        <div className="text-gray-500 dark:text-gray-400">Available products</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-success-light/50 via-success/20 to-transparent hover:from-success-light hover:via-success/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-success duration-300">Categories</h5>
                            <span className="badge bg-success/20 text-success group-hover:bg-success group-hover:text-white duration-300">Update</span>
                        </div>
                        <div className="text-3xl font-bold text-success mb-1 group-hover:scale-110 duration-300">10</div>
                        <div className="text-gray-500 dark:text-gray-400">Product categories</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-warning-light/50 via-warning/20 to-transparent hover:from-warning-light hover:via-warning/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-warning duration-300">Blog Posts</h5>
                            <span className="badge bg-warning/20 text-warning group-hover:bg-warning group-hover:text-white duration-300">New</span>
                        </div>
                        <div className="text-3xl font-bold text-warning mb-1 group-hover:scale-110 duration-300">25+</div>
                        <div className="text-gray-500 dark:text-gray-400">Blog articles</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-info-light/50 via-success/20 to-transparent hover:from-info-light hover:via-success/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-info duration-300">Visitors</h5>
                            <span className="badge bg-success/20 text-success group-hover:bg-success group-hover:text-white duration-300">Today</span>
                        </div>
                        <div className="text-3xl font-bold text-success mb-1 group-hover:scale-110 duration-300">200</div>
                        <div className="text-gray-500 dark:text-gray-400">Visitors today</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
