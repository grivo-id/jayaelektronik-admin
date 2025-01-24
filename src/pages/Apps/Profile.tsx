'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetUserProfile } from '../../services/profileService';
import IconPencil from '../../components/Icon/IconPencil';
import formatDate from '../../utils/formatDate';
import Avatar from '../../components/Icon/IconAvatar';

const Profile = () => {
    const dispatch = useDispatch();
    const { data: profileData, isLoading } = useGetUserProfile();

    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin border-2 border-primary border-l-transparent rounded-full w-12 h-12"></div>
            </div>
        );
    }

    return (
        <div>
            <>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-sm text-gray-600">View your profile information</p>
                    </div>
                </div>

                <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
            </>

            <div className="pt-5">
                <div className="grid grid-cols-12 gap-6">
                    <div className="panel col-span-12 lg:col-span-4">
                        <div className="flex flex-col items-center p-6">
                            <div className="w-32 h-32 mb-4">
                                <Avatar size={120} className="border-4 border-white shadow-lg" />
                            </div>
                            <h2 className="text-xl font-bold mb-1">{profileData?.data?.user_name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{profileData?.data?.role_name}</p>
                        </div>
                    </div>

                    <div className="panel col-span-12 lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Profile Information</h2>
                            <button className="btn btn-primary">
                                <IconPencil className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData?.data?.user_name}</p>
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData?.data?.user_email || '-'}</p>
                                </div>
                                <div>
                                    <label className="form-label">Phone</label>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData?.data?.user_phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="form-label">Address</label>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData?.data?.user_address || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-base font-semibold">Account Information</h3>
                                    <p className="text-xs text-gray-500 mt-1">Joined on {profileData?.data?.user_created_date ? formatDate(profileData.data.user_created_date) : 'N/A'}</p>
                                </div>
                                <span className={`badge ${profileData?.data?.user_is_verified ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                    {profileData?.data?.user_is_verified ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
