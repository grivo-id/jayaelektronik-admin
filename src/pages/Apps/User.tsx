import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Pagination, SkeletonLoadingTable, MainUserHeader, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllUser } from '../../api/userApi';
import { useGetAllUserQuery, useUpdateUser, useCreateUser, useDeleteUser, useResetUserPassword } from '../../services/userService';
import { useResetPasswordManager } from '../../services/profileService';
import IconPencil from '../../components/Icon/IconPencil';
import IconX from '../../components/Icon/IconX';
import IconLockDots from '../../components/Icon/IconLockDots';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserPayload, UpdateUserPayload, getCreateUserSchema, getUpdateUserSchema } from '../../schema/userSchema';
import { getRoleIdByName, roleOptions } from '../../constants/role';
import { UserProfile } from '../../types/userProfile';
import Swal from 'sweetalert2';
import IconEye from '../../components/Icon/IconEye';
import IconEyeOff from '../../components/Icon/IconEyeOff';
import { useSearchParams } from 'react-router-dom';
import IconTrash from '../../components/Icon/IconTrash';

const User = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [roleCode, setRoleCode] = useState(searchParams.get('role_code') || 'lvl_perms_member');

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: Number(searchParams.get('page')) || 1,
        search: searchParams.get('search') || '',
        sort: 'desc',
        role_code: searchParams.get('role_code') || roleCode,
    });

    const { data: { data: userData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllUserQuery(queryParams);
    const { mutate: updateUser, isPending: updateUserPending } = useUpdateUser();
    const { mutate: createUser, isPending: createUserPending } = useCreateUser();
    const { mutate: mutateResetPassword, isPending: isResetPasswordPending } = useResetPasswordManager();
    const { mutate: deleteUser, isPending: deleteUserPending } = useDeleteUser();
    const { mutate: resetUserPassword, isPending: resetUserPasswordPending } = useResetUserPassword();

    const updateUserSchema = useMemo(() => getUpdateUserSchema(), []);
    const createUserSchema = useMemo(() => getCreateUserSchema(), []);
    const {
        register: updateRegister,
        handleSubmit: updateHandleSubmit,
        formState: { errors: updateErrors },
        reset: updateReset,
        setValue: updateSetValue,
    } = useForm<UpdateUserPayload>({
        resolver: zodResolver(updateUserSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const {
        register: createRegister,
        handleSubmit: createHandleSubmit,
        formState: { errors: createErrors },
        reset: createReset,
    } = useForm<CreateUserPayload>({
        resolver: zodResolver(createUserSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [search, setSearch] = useState<string>('');
    const [editModal, setEditModal] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('User Management'));
    }, []);

    const handlePageChange = (newPage: number) => {
        setSearchParams({
            ...Object.fromEntries(searchParams),
            page: newPage.toString(),
        });
        setQueryParams({ ...queryParams, page: newPage });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        setSearchParams({
            ...Object.fromEntries(searchParams),
            search: searchValue,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setQueryParams({ ...queryParams, search, page: 1 });
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roleValue = e.target.value;
        setRoleCode(roleValue);
        setSearchParams({
            ...Object.fromEntries(searchParams),
            role_code: roleValue,
        });
        setQueryParams({ ...queryParams, role_code: roleValue });
    };

    const onSubmitUpdate = (data: UpdateUserPayload) => {
        if (selectedUser) {
            updateUser(
                {
                    id: selectedUser.user_id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setEditModal(false);
                        updateReset();
                        setSelectedUser(null);
                    },
                }
            );
        }
    };

    const onSubmitCreate = (data: CreateUserPayload) => {
        createUser(data, {
            onSuccess: () => {
                setCreateModal(false);
                createReset();
            },
        });
    };

    const editUser = (user: UserProfile) => {
        const roleId = getRoleIdByName(user.role_name);

        console.log(roleId);

        setSelectedUser(user);
        updateSetValue('role_id', roleId);
        updateSetValue('user_fname', user.user_fname);
        updateSetValue('user_lname', user.user_lname);
        updateSetValue('user_is_active', user.user_is_active);
        updateSetValue('user_is_verified', user.user_is_verified);
        setEditModal(true);
    };

    const createUserModal = () => {
        setCreateModal(true);
    };

    const closeModal = () => {
        setEditModal(false);
        updateReset();
        setSelectedUser(null);
    };

    const closeCreateModal = () => {
        setCreateModal(false);
        createReset();
    };

    useEffect(() => {
        const nextPage = (pagination?.currentPage ?? 1) + 1;

        if (!isPlaceholderData && pagination?.hasNextPage) {
            const nextPageParams = {
                ...queryParams,
                page: nextPage,
            };

            queryClient.prefetchQuery({
                queryKey: ['users', nextPageParams],
                queryFn: () => ApiGetAllUser(nextPageParams),
            });
        }
    }, [queryParams, userData, isPlaceholderData, queryClient]);

    const concatName = (user: UserProfile) => {
        return `${user.user_fname} ${user.user_lname}`;
    };

    const handleResetPassword = (user: UserProfile) => {
        const isMember = user.role_name === 'Member';
        const defaultPassword = isMember ? `${user.user_email.split('@')[0]}@Jaya2025` : 'Admin.Jaya@2025';

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
                const resetFunction = isMember ? resetUserPassword : mutateResetPassword;

                resetFunction(user.user_id, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Password Successfully Reset',
                            text: `New password: ${defaultPassword}`,
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

    const handleDeleteUser = (user: UserProfile) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.value) {
                deleteUser(user.user_id, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'User has been deleted.',
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

    return (
        <div>
            <MainUserHeader
                title="User Management"
                subtitle="Manage and view all registered users"
                onSearchChange={handleSearchChange}
                search={search}
                onAdd={createUserModal}
                addText="Add New"
                roleCode={roleCode}
                onRoleChange={handleRoleChange}
            />
            <>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Activation</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={8} />
                            ) : userData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No users found</p>
                                                <p className="text-sm text-gray-400">No registered users yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {userData.map((user: UserProfile) => {
                                        return (
                                            <tr key={user.user_id}>
                                                <td className="whitespace-nowrap">{user.user_email}</td>
                                                <td className="whitespace-nowrap">{user.role_name}</td>
                                                <td className="whitespace-nowrap">{concatName(user)}</td>
                                                <td className="whitespace-nowrap">{user.user_phone}</td>
                                                <td className="whitespace-nowrap">{user.user_address}</td>

                                                <td className="whitespace-nowrap">
                                                    <span className={`badge ${user.user_is_verified ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                                        {user.user_is_verified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap">
                                                    <span className={`badge ${user.user_is_active ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                                        {user.user_is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit User" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(user)}>
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Reset Password" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => handleResetPassword(user)}>
                                                                <IconLockDots className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        {user.role_name === 'Member' && (
                                                            <Tooltip text="Delete User" position="top">
                                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user)} disabled={deleteUserPending}>
                                                                    <IconTrash className="w-4 h-4" />
                                                                </button>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
                <Pagination
                    activePage={Number(searchParams.get('page')) || 1}
                    itemsCountPerPage={queryParams.limit}
                    totalItemsCount={pagination?.totalData || 0}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            </>

            <Dialog as="div" open={editModal} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-[black]/60" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                disabled={updateUserPending}
                            >
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Edit User</div>
                            <div className="p-5">
                                <form onSubmit={updateHandleSubmit(onSubmitUpdate)}>
                                    <div className="mb-5">
                                        <label htmlFor="role_id" className="flex items-center">
                                            Role
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <select id="role_id" className="form-select" {...updateRegister('role_id', { valueAsNumber: true })}>
                                            <option value={0}>Select Role</option>
                                            {roleOptions
                                                .filter((option) => option.label !== 'Member')
                                                .map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                        </select>
                                        {createErrors.role_id && <span className="text-danger">{createErrors.role_id.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="user_fname" className="flex items-center">
                                            First Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_fname"
                                            type="text"
                                            placeholder="Enter Name"
                                            className={`form-input ${updateErrors.user_fname ? 'error' : ''}`}
                                            {...updateRegister('user_fname')}
                                        />
                                        {updateErrors.user_fname && <span className="text-danger text-sm mt-1">{updateErrors.user_fname.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="user_lname" className="flex items-center">
                                            Last Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_lname"
                                            type="text"
                                            placeholder="Enter Name"
                                            className={`form-input ${updateErrors.user_lname ? 'error' : ''}`}
                                            {...updateRegister('user_lname')}
                                        />
                                        {updateErrors.user_lname && <span className="text-danger text-sm mt-1">{updateErrors.user_lname.message}</span>}
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="user_is_active" className="flex items-center mb-2">
                                            Is Active
                                        </label>
                                        <label className="w-12 h-6 relative">
                                            <input
                                                type="checkbox"
                                                id="user_is_active"
                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                {...updateRegister('user_is_active')}
                                            />
                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                        </label>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="user_is_verified" className="flex items-center mb-2">
                                            Is Verified
                                        </label>
                                        <label className="w-12 h-6 relative">
                                            <input
                                                type="checkbox"
                                                id="user_is_verified"
                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                {...updateRegister('user_is_verified')}
                                            />
                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                        </label>
                                    </div>

                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={updateUserPending}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={updateUserPending}>
                                            {updateUserPending && (
                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"></span>
                                            )}
                                            {updateUserPending ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog as="div" open={createModal} onClose={closeCreateModal} className="relative z-50">
                <div className="fixed inset-0 bg-[black]/60" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                disabled={createUserPending}
                            >
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create User</div>
                            <div className="p-5">
                                <form onSubmit={createHandleSubmit(onSubmitCreate)}>
                                    <div className="mb-5">
                                        <label htmlFor="role_id" className="flex items-center">
                                            Role
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <select id="role_id" className="form-select" {...createRegister('role_id', { valueAsNumber: true })}>
                                            <option value={0}>Select Role</option>
                                            {roleOptions
                                                .filter((option) => option.label !== 'Member')
                                                .map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                        </select>
                                        {createErrors.role_id && <span className="text-danger">{createErrors.role_id.message}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="user_fname" className="flex items-center">
                                            First Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_fname"
                                            type="text"
                                            placeholder="Enter First Name"
                                            className={`form-input ${createErrors.user_fname ? 'error' : ''}`}
                                            {...createRegister('user_fname')}
                                        />
                                        {createErrors.user_fname && <span className="text-danger text-sm mt-1">{createErrors.user_fname.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_lname" className="flex items-center">
                                            Last Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_lname"
                                            type="text"
                                            placeholder="Enter Last Name"
                                            className={`form-input ${createErrors.user_lname ? 'error' : ''}`}
                                            {...createRegister('user_lname')}
                                        />
                                        {createErrors.user_lname && <span className="text-danger text-sm mt-1">{createErrors.user_lname.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_email" className="flex items-center">
                                            Email
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className={`form-input ${createErrors.user_email ? 'error' : ''}`}
                                            {...createRegister('user_email')}
                                        />
                                        {createErrors.user_email && <span className="text-danger text-sm mt-1">{createErrors.user_email.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="user_password" className="flex items-center">
                                            Password
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="user_password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter Password"
                                                className={`form-input ${createErrors.user_password ? 'error' : ''}`}
                                                {...createRegister('user_password')}
                                            />
                                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <IconEyeOff /> : <IconEye />}
                                            </button>
                                        </div>
                                        {createErrors.user_password && <span className="text-danger text-sm mt-1">{createErrors.user_password.message}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="user_confirm_password" className="flex items-center">
                                            Confirm Password
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="user_confirm_password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm Password"
                                                className={`form-input ${createErrors.user_confirm_password ? 'error' : ''}`}
                                                {...createRegister('user_confirm_password')}
                                            />
                                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                                            </button>
                                        </div>
                                        {createErrors.user_confirm_password && <span className="text-danger text-sm mt-1">{createErrors.user_confirm_password.message}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="user_phone" className="flex items-center">
                                            Phone
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="user_phone"
                                            type="text"
                                            placeholder="Enter Phone"
                                            className={`form-input ${createErrors.user_phone ? 'error' : ''}`}
                                            {...createRegister('user_phone')}
                                        />
                                        {createErrors.user_phone && <span className="text-danger text-sm mt-1">{createErrors.user_phone.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="user_address" className="flex items-center">
                                            Address
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <textarea
                                            id="user_address"
                                            placeholder="Enter Address"
                                            className={`form-textarea ${createErrors.user_address ? 'error' : ''}`}
                                            {...createRegister('user_address')}
                                            rows={3}
                                        ></textarea>
                                        {createErrors.user_address && <span className="text-danger text-sm mt-1">{createErrors.user_address.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeCreateModal} disabled={createUserPending}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={createUserPending}>
                                            {createUserPending && (
                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"></span>
                                            )}
                                            {createUserPending ? 'Creating...' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default User;
