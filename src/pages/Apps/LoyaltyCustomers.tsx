import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllCustomers, useGetAllTiers, useCreateCustomerLoyalty, useGetUsersNotInLoyalty } from '../../services/loyaltyService';
import { MainHeader, Pagination, SkeletonLoadingTable } from '../../components';
import { useSearchParams } from 'react-router-dom';
import formatToRupiah from '../../utils/formatToRupiah';
import IconSearch from '../../components/Icon/IconSearch';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const LoyaltyCustomers = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedTier, setSelectedTier] = useState<string>(searchParams.get('tier_id') || '');

    // Create Customer Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedTierForCreate, setSelectedTierForCreate] = useState('');

    const { data: tiersData } = useGetAllTiers();
    const { data: { data: customersData, pagination } = { data: [], pagination: {} }, isFetching } = useGetAllCustomers(
        {
            limit: 10,
            page: Number(searchParams.get('page')) || 1,
        },
        {
            search: search || undefined,
            tier_id: selectedTier || undefined,
        },
    );

    const { mutate: createCustomerLoyalty } = useCreateCustomerLoyalty();

    // Fetch users not in loyalty for create modal
    const { data: usersResponse = { data: [], pagination: {} }, isFetching: isFetchingUsers } = useGetUsersNotInLoyalty(
        { search: userSearch, limit: 50, page: 1 },
        showCreateModal,
    );
    const usersData = usersResponse.data || [];

    useEffect(() => {
        dispatch(setPageTitle('Loyalty Customers'));
    }, [dispatch]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({
            ...Object.fromEntries(searchParams),
            page: newPage.toString(),
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        setSearchParams({
            ...Object.fromEntries(searchParams),
            search: searchValue,
            page: '1',
        });
    };

    const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tierId = e.target.value;
        setSelectedTier(tierId);
        setSearchParams({
            ...Object.fromEntries(searchParams),
            tier_id: tierId,
            page: '1',
        });
    };

    const handleCreate = () => {
        setUserSearch('');
        setSelectedUserId('');
        setSelectedTierForCreate('');
        setShowCreateModal(true);
    };

    const handleCreateSubmit = () => {
        if (!selectedUserId || !selectedTierForCreate) {
            return;
        }

        createCustomerLoyalty(
            {
                user_id: selectedUserId,
                tier_id: selectedTierForCreate,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['loyalty-customers'] });
                    queryClient.invalidateQueries({ queryKey: ['usersNotInLoyalty'] });
                    setShowCreateModal(false);
                },
            },
        );
    };

    const getTierColor = (tierName: string) => {
        if (tierName.toLowerCase().includes('blue')) return 'bg-blue-500/10 text-blue-500';
        if (tierName.toLowerCase().includes('silver')) return 'bg-gray-400/10 text-gray-400';
        if (tierName.toLowerCase().includes('gold')) return 'bg-yellow-500/10 text-yellow-500';
        if (tierName.toLowerCase().includes('platinum')) return 'bg-purple-500/10 text-purple-500';
        return 'bg-primary/10 text-primary';
    };

    const formatNumber = (num: number | undefined | null) => {
        return (num || 0).toLocaleString('id-ID');
    };

    return (
        <div>
            <MainHeader
                title="Loyalty Customers"
                subtitle="Manage customer loyalty profiles and points"
                addText="Add Customer"
                onAdd={handleCreate}
                onSearchChange={handleSearchChange}
                search={search}
                onClearSearch={() => {
                    setSearch('');
                    setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete('search');
                        return newParams;
                    });
                }}
            />

            {/* Filter by Tier */}
            <div className="mt-5 panel p-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium whitespace-nowrap">Filter by Tier:</label>
                    <select className="form-select w-48" value={selectedTier} onChange={handleTierChange}>
                        <option value="">All Tiers</option>
                        {tiersData?.map((tier) => (
                            <option key={tier.tier_id} value={tier.tier_id}>
                                {tier.tier_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Tier</th>
                                <th>Points Balance</th>
                                <th>Lifetime Spending</th>
                                <th>Last Transaction</th>
                            </tr>
                        </thead>
                        {isFetching ? (
                            <SkeletonLoadingTable rows={11} columns={5} />
                        ) : customersData.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <p className="text-lg font-semibold text-gray-500">No customers found</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {customersData.map((customer) => (
                                    <tr key={customer.customer_loyalty_id}>
                                        <td>
                                            <Link to={`/admin/loyalty/customers/${customer.user_id}`} className="font-semibold text-primary hover:text-primary/80 hover:underline">
                                                {customer.user_fname} {customer.user_lname}
                                            </Link>
                                            <div className="text-gray-500 text-sm">{customer.user_email}</div>
                                            <div className="text-gray-500 text-sm">{customer.user_phone}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getTierColor(customer.tier_name)}`}>{customer.tier_name}</span>
                                            <div className="text-xs text-gray-500 mt-1">Progress to next tier: {formatToRupiah(customer.current_level_spending)}</div>
                                        </td>
                                        <td>
                                            <div className="font-semibold text-info">{formatNumber(customer.total_points_available)}</div>
                                            <div className="text-xs text-gray-500">Earned: {formatNumber(customer.total_points)}</div>
                                            <div className="text-xs text-gray-500">Used: {formatNumber(customer.total_points_used)}</div>
                                        </td>
                                        <td>{formatToRupiah(customer.lifetime_spending)}</td>
                                        <td>
                                            {customer.last_transaction_date ? (
                                                <div>{new Date(customer.last_transaction_date).toLocaleDateString('id-ID')}</div>
                                            ) : (
                                                <span className="text-gray-500">Never</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination activePage={Number(searchParams.get('page')) || 1} itemsCountPerPage={10} totalItemsCount={pagination?.totalData || 0} pageRangeDisplayed={5} onChange={handlePageChange} />

            {/* Create Customer Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="panel w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="text-lg font-semibold">Add Customer to Loyalty Program</h3>
                                <p className="text-sm text-gray-500">Search and select a user, then assign a tier</p>
                            </div>
                            <button className="btn btn-outline-danger btn-sm p-2" onClick={() => setShowCreateModal(false)}>
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="form-input w-full pl-10"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        placeholder="Search by name or email..."
                                    />
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div className="table-responsive max-h-64">
                                    <table className="table-striped">
                                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                                            <tr>
                                                <th className="w-12">Select</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isFetchingUsers ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8">
                                                        <div className="flex justify-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : usersData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8">
                                                        <p className="text-gray-500">
                                                            {userSearch ? 'No users found. Try a different search term.' : 'All users are already enrolled in the loyalty program.'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                usersData.map((user: any) => (
                                                    <tr
                                                        key={user.user_id}
                                                        className={selectedUserId === user.user_id ? 'bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                                                        onClick={() => setSelectedUserId(user.user_id)}
                                                    >
                                                        <td className="text-center">
                                                            <div
                                                                className={
                                                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto ' +
                                                                    (selectedUserId === user.user_id ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600')
                                                                }
                                                            >
                                                                {selectedUserId === user.user_id && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="align-middle">
                                                            <div className="font-semibold">
                                                                {user.user_fname} {user.user_lname}
                                                            </div>
                                                        </td>
                                                        <td className="text-gray-500 align-middle">{user.user_email}</td>
                                                        <td className="text-gray-500 align-middle">{user.user_phone || '-'}</td>
                                                        <td className="align-middle">
                                                            <span className="inline-flex items-center rounded-md bg-info/10 px-2 py-1 text-xs font-medium text-info">{user.role_name || 'Member'}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {selectedUserId && (
                                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <div className="text-sm">
                                        <span className="font-medium text-primary">Selected: </span>
                                        {usersData.find((u: any) => u.user_id === selectedUserId)?.user_fname} {usersData.find((u: any) => u.user_id === selectedUserId)?.user_lname}
                                        <span className="text-gray-500 ml-2">({usersData.find((u: any) => u.user_id === selectedUserId)?.user_email})</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Assign Tier</label>
                                <select className="form-select w-full" value={selectedTierForCreate} onChange={(e) => setSelectedTierForCreate(e.target.value)} required>
                                    <option value="">Select a tier...</option>
                                    {tiersData?.map((tier) => (
                                        <option key={tier.tier_id} value={tier.tier_id}>
                                            {tier.tier_name} - Min: {formatToRupiah(tier.min_lifetime_spending)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" className="btn btn-outline-danger" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleCreateSubmit} disabled={!selectedUserId || !selectedTierForCreate}>
                                <IconPlus className="w-4 h-4 mr-2" />
                                Add Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyCustomers;
