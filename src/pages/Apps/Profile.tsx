'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetUserProfile, useResetPasswordManager, useUpdateUserProfile } from '../../services/profileService';
import Avatar from '../../components/Icon/IconAvatar';
import IconEnvelope from '../../components/Icon/IconEnvelope';
import IconPhone from '../../components/Icon/IconPhone';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconPencil from '../../components/Icon/IconPencil';
import { getUpdateUserProfileSchema, UpdateUserProfilePayload } from '../../schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { useStore } from '../../store/store';
import Swal from 'sweetalert2';
import { Loader } from '../../components';
import IconLockDots from '../../components/Icon/IconLockDots';

const Profile = () => {
    const dispatch = useDispatch();
    const { data: profileData, isFetching } = useGetUserProfile();
    const { mutate: updateProfile, isPending } = useUpdateUserProfile();
    const updateUserSchema = useMemo(() => getUpdateUserProfileSchema(), []);
    const [modal, setModal] = useState(false);
    const setUser = useStore((state) => state.setUser);
    const userGlobal = useStore((state) => state.user);
    const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
    const { mutate: mutateResetPassword, isPending: isResetPasswordPending } = useResetPasswordManager();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<UpdateUserProfilePayload>({
        resolver: zodResolver(updateUserSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    }, []);

    const concatName = () => {
        return `${profileData?.data.user_fname} ${profileData?.data.user_lname}`;
    };

    const onEditProfile = (data: UpdateUserProfilePayload) => {
        updateProfile(
            { id: profileData!.data.user_id, payload: data },
            {
                onSuccess: (response) => {
                    setModal(false);
                    reset();
                    setIsAuthenticated(true);
                    setUser({
                        user_id: response.data.user_id,
                        role_id: response.data.role_id,
                        user_fname: response.data.user_fname,
                        user_lname: response.data.user_lname,
                        user_email: response.data.user_email,
                        user_phone: response.data.user_phone,
                        user_address: response.data.user_address,
                        user_last_active: response.data.user_last_active,
                        user_created_date: response.data.user_created_date,
                        user_updated_date: response.data.user_updated_date,
                        role_name: profileData?.data.role_name,
                        role_code: profileData?.data.role_code,
                    });
                },
            }
        );
    };

    const openModal = () => {
        setValue('user_fname', profileData?.data.user_fname || '');
        setValue('user_lname', profileData?.data.user_lname || '');
        setValue('user_email', profileData?.data.user_email || '');
        setValue('user_phone', profileData?.data.user_phone || '');
        setValue('user_address', profileData?.data.user_address || '');
        setValue('user_password', '');
        setValue('user_confirm_password', '');
        setModal(true);
    };

    const handleResetPassword = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Reset Password',
            text: 'Are you sure you want to reset the password?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reset',
            cancelButtonText: 'Cancel',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mutateResetPassword(profileData?.data.user_id || '', {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Password Successfully Reset',
                            text: 'New password: Admin.Jaya@2025',
                            padding: '2em',
                            customClass: {
                                popup: 'sweet-alerts',
                            },
                        });
                    },
                });
            }
        });
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin border-2 border-primary border-l-transparent rounded-full w-12 h-12"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-sm text-gray-600">View and manage your profile information</p>
                </div>

                <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
            </div>
            <div className="pt-5">
                <div className="grid grid-cols-12 gap-6">
                    <div className="panel col-span-12 lg:col-span-4">
                        <div className="flex flex-col items-center p-6">
                            <div className="relative mb-5">
                                <Avatar size={120} className="border-4 border-gray-100 dark:border-gray-800 shadow-lg" />
                                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${profileData?.data?.user_is_active ? 'bg-success' : 'bg-danger'}`}></span>
                            </div>
                            <h2 className="text-xl font-bold mb-1">{concatName()}</h2>
                            <span className="badge badge-outline-primary mb-4">{profileData?.data?.role_name}</span>

                            <div className="w-full space-y-4">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <IconEnvelope className="w-5 h-5 mr-3" />
                                    <span>{profileData?.data?.user_email}</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <IconPhone className="w-5 h-5 mr-3" />
                                    <span>{profileData?.data?.user_phone || '-'}</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <IconMapPin className="w-5 h-5 mr-3" />
                                    <span>{profileData?.data?.user_address || '-'}</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <IconCalendar className="w-5 h-5 mr-3" />
                                    <span>Joined {new Date(profileData?.data?.user_created_date || '').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel col-span-12 lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-semibold">Personal Information</h4>
                            <div className="flex gap-2">
                                {userGlobal?.role_name === 'Manager' ||
                                    (userGlobal?.role_name === 'Developer' && (
                                        <button type="button" className="btn btn-warning" onClick={handleResetPassword} disabled={isPending}>
                                            <IconLockDots className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                            Reset Password
                                        </button>
                                    ))}

                                <button type="button" className="btn btn-primary" onClick={openModal}>
                                    <IconPencil className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">First Name</label>
                                <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">{profileData?.data?.user_fname || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Last Name</label>
                                <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">{profileData?.data?.user_lname || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">{profileData?.data?.user_email}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">{profileData?.data?.user_phone || '-'}</div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4">Additional Information</h4>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">{profileData?.data?.user_address || '-'}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Account Status</label>
                                        <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">
                                            <span className={`badge ${profileData?.data?.user_is_active ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                                {profileData?.data?.user_is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Verification Status</label>
                                        <div className="p-3 bg-[#eee] dark:bg-[#1b2e4b] rounded">
                                            <span className={`badge ${profileData?.data?.user_is_verified ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                                {profileData?.data?.user_is_verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog as="div" open={modal} onClose={() => setModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-[black]/60"></div>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                <h5 className="font-bold text-lg">Edit Profile</h5>
                                <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                    <IconX />
                                </button>
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onEditProfile)} className="space-y-5">
                                    <div>
                                        <label htmlFor="user_fname">First Name</label>
                                        <input id="user_fname" type="text" className="form-input" {...register('user_fname')} />
                                        {errors.user_fname?.message && <span className="text-danger text-xs">{errors.user_fname?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_lname">Last Name</label>
                                        <input id="user_lname" type="text" className="form-input" {...register('user_lname')} />
                                        {errors.user_lname?.message && <span className="text-danger text-xs">{errors.user_lname?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_email">Email</label>
                                        <input id="user_email" type="email" className="form-input" {...register('user_email')} />
                                        {errors.user_email?.message && <span className="text-danger text-xs">{errors.user_email?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_phone">Phone Number</label>
                                        <input id="user_phone" type="text" className="form-input" {...register('user_phone')} />
                                        {errors.user_phone?.message && <span className="text-danger text-xs">{errors.user_phone?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_address">Address</label>
                                        <textarea id="user_address" className="form-textarea" {...register('user_address')} />
                                        {errors.user_address?.message && <span className="text-danger text-xs">{errors.user_address?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_password">Password</label>
                                        <input id="user_password" type="password" className="form-input" {...register('user_password')} />
                                        {errors.user_password?.message && <span className="text-danger text-xs">{errors.user_password?.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_confirm_password">Confirm Password</label>
                                        <input id="user_confirm_password" type="password" className="form-input" {...register('user_confirm_password')} />
                                        {errors.user_confirm_password?.message && <span className="text-danger text-xs">{errors.user_confirm_password?.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)} disabled={isPending}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={isPending}>
                                            {isPending ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            {isResetPasswordPending && <Loader />}
        </div>
    );
};

export default Profile;
