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
                            <h5 className="font-semibold text-lg dark:text-white-light">Selamat Datang di Dashboard Jaya Elektronik!</h5>
                            <IconInfoCircle className="w-5 h-5 ml-2 text-primary" />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                            <p className="mb-4">Dashboard ini akan membantu Anda mengelola toko elektronik dengan lebih efisien. Berikut beberapa fitur utama yang tersedia:</p>
                            <ul className="list-disc list-inside space-y-2 mb-4">
                                <li>Manajemen Produk & Kategori</li>
                                <li>Manajemen Blog & Konten</li>
                                <li>Analisis Penjualan</li>
                                <li>Laporan dan Statistik</li>
                            </ul>
                            <p>Silakan gunakan menu di sebelah kiri untuk mengakses berbagai fitur yang tersedia.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <div className="panel h-full bg-gradient-to-br from-primary-light/50 via-primary/20 to-transparent hover:from-primary-light hover:via-primary/30 hover:to-transparent duration-300 cursor-pointer">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Total Produk</h5>
                            <span className="badge bg-primary/20 text-primary">Aktif</span>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-1">150+</div>
                        <div className="text-gray-500 dark:text-gray-400">Produk tersedia</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-success-light/50 via-success/20 to-transparent hover:from-success-light hover:via-success/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-success duration-300">Kategori</h5>
                            <span className="badge bg-success/20 text-success group-hover:bg-success group-hover:text-white duration-300">Update</span>
                        </div>
                        <div className="text-3xl font-bold text-success mb-1 group-hover:scale-110 duration-300">10</div>
                        <div className="text-gray-500 dark:text-gray-400">Kategori produk</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-warning-light/50 via-warning/20 to-transparent hover:from-warning-light hover:via-warning/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-warning duration-300">Blog Post</h5>
                            <span className="badge bg-warning/20 text-warning group-hover:bg-warning group-hover:text-white duration-300">New</span>
                        </div>
                        <div className="text-3xl font-bold text-warning mb-1 group-hover:scale-110 duration-300">25+</div>
                        <div className="text-gray-500 dark:text-gray-400">Artikel blog</div>
                    </div>

                    <div className="panel h-full bg-gradient-to-br from-info-light/50 via-success/20 to-transparent hover:from-info-light hover:via-success/30 hover:to-transparent duration-300 cursor-pointer ">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg group-hover:text-info duration-300">Pengunjung</h5>
                            <span className="badge bg-success/20 text-success group-hover:bg-success group-hover:text-white duration-300">Hari Ini</span>
                        </div>
                        <div className="text-3xl font-bold text-success mb-1 group-hover:scale-110 duration-300">100+</div>
                        <div className="text-gray-500 dark:text-gray-400">Pengunjung aktif</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
