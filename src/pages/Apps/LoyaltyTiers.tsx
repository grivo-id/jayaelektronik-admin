import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllTiers, useUpdateTier, useCreateTier } from '../../services/loyaltyService';
import Swal from 'sweetalert2';
import formatToRupiah from '../../utils/formatToRupiah';
import IconAward from '../../components/Icon/IconAward';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import IconTag from '../../components/Icon/IconTag';

const LoyaltyTiers = () => {
    const dispatch = useDispatch();
    const { data: tiers, isLoading } = useGetAllTiers();
    const { mutate: updateTier } = useUpdateTier();
    const { mutate: createTier } = useCreateTier();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTier, setEditingTier] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        tier_name: string;
        tier_order: number;
        min_lifetime_spending: number;
        max_lifetime_spending: number | null;
        point_multiplier: number;
        discount_enabled: boolean;
        discount_percentage: number;
    }>({
        tier_name: '',
        tier_order: 1,
        min_lifetime_spending: 0,
        max_lifetime_spending: null,
        point_multiplier: 1,
        discount_enabled: false,
        discount_percentage: 0,
    });

    useEffect(() => {
        dispatch(setPageTitle('Loyalty Tiers'));
    }, [dispatch]);

    const resetForm = () => {
        setEditForm({
            tier_name: '',
            tier_order: 1,
            min_lifetime_spending: 0,
            max_lifetime_spending: null,
            point_multiplier: 1,
            discount_enabled: false,
            discount_percentage: 0,
        });
        setEditingTier(null);
    };

    const handleCreate = () => {
        setEditingTier(null);
        resetForm();
        setShowCreateModal(true);
    };

    const handleEdit = (tier: any) => {
        setEditingTier(tier.tier_id);
        setEditForm({
            tier_name: tier.tier_name,
            tier_order: tier.tier_order,
            min_lifetime_spending: tier.min_lifetime_spending,
            max_lifetime_spending: tier.max_lifetime_spending,
            point_multiplier: tier.point_multiplier,
            discount_enabled: tier.discount_enabled || false,
            discount_percentage: tier.discount_percentage || 0,
        });
        setShowCreateModal(true);
    };

    const handleCancel = () => {
        setEditingTier(null);
        setShowCreateModal(false);
        resetForm();
    };

    const handleSave = () => {
        if (editingTier) {
            updateTier(
                {
                    tierId: editingTier,
                    data: editForm,
                },
                {
                    onSuccess: () => {
                        Swal.fire('Success', 'Tier updated successfully', 'success');
                        setEditingTier(null);
                        setShowCreateModal(false);
                        resetForm();
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to update tier', 'error');
                    },
                },
            );
        } else {
            createTier(editForm, {
                onSuccess: () => {
                    Swal.fire('Success', 'Tier created successfully', 'success');
                    setShowCreateModal(false);
                    resetForm();
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to create tier', 'error');
                },
            });
        }
    };

    const getTierColor = (tierName: string) => {
        if (tierName.toLowerCase().includes('blue')) return 'border-blue-500 bg-blue-500/10';
        if (tierName.toLowerCase().includes('silver')) return 'border-gray-400 bg-gray-400/10';
        if (tierName.toLowerCase().includes('gold')) return 'border-yellow-500 bg-yellow-500/10';
        if (tierName.toLowerCase().includes('platinum')) return 'border-purple-500 bg-purple-500/10';
        return 'border-primary bg-primary/10';
    };

    const getTierTextColor = (tierName: string) => {
        if (tierName.toLowerCase().includes('blue')) return 'text-blue-500';
        if (tierName.toLowerCase().includes('silver')) return 'text-gray-400';
        if (tierName.toLowerCase().includes('gold')) return 'text-yellow-500';
        if (tierName.toLowerCase().includes('platinum')) return 'text-purple-500';
        return 'text-primary';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loyalty Tiers</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage membership tiers and benefits</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleCreate}>
                    <IconPlus className="w-4 h-4" />
                    <span>Create Tier</span>
                </button>
            </div>

            {isLoading ? (
                <div className="panel p-4">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tiers?.map((tier) => (
                        <div key={tier.tier_id} className={`panel border-2 ${getTierColor(tier.tier_name)} relative`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full border-2 ${getTierColor(tier.tier_name)} flex items-center justify-center`}>
                                    <IconAward className={`w-6 h-6 ${getTierTextColor(tier.tier_name)}`} />
                                </div>
                                <button className="btn btn-outline-primary btn-sm p-2" onClick={() => handleEdit(tier)}>
                                    <IconEdit className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className={`text-xl font-bold mb-1 ${getTierTextColor(tier.tier_name)}`}>{tier.tier_name}</h3>
                            <div className="text-sm text-gray-500 mb-4">Tier Level {tier.tier_order}</div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Spending Range</span>
                                </div>
                                <div className="text-sm">
                                    {formatToRupiah(tier.min_lifetime_spending)}
                                    {tier.max_lifetime_spending ? ` - ${formatToRupiah(tier.max_lifetime_spending)}` : '+'}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">Point Multiplier</span>
                                        <span className={`badge bg-info/10 text-info`}>{tier.point_multiplier}x</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Discount Benefit</span>
                                        {tier.discount_enabled && tier.discount_percentage > 0 ? (
                                            <span className={`badge bg-success/10 text-success`}>{tier.discount_percentage}% off</span>
                                        ) : (
                                            <span className="badge bg-gray-200 text-gray-500">Disabled</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {tier.discount_enabled && tier.discount_percentage > 0 ? (
                                        <div className="flex items-center gap-2 text-success text-sm">
                                            <IconTag className="w-4 h-4" />
                                            <span>{tier.discount_percentage}% off orders</span>
                                        </div>
                                    ) : null}
                                </div>

                                {tier.customer_count !== undefined && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Customers</span>
                                            <span className="font-semibold">{tier.customer_count}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="panel mt-6">
                <div className="flex items-start gap-3">
                    <IconTrendingUp className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold mb-1">How Tier Upgrades Work</h4>
                        <p className="text-sm text-gray-500">
                            Customers automatically upgrade to the next tier when their lifetime spending reaches the minimum threshold. Tier upgrades are checked after every completed order. Higher
                            tiers earn points faster with multipliers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="panel w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{editingTier ? 'Edit Tier' : 'Create New Tier'}</h3>
                            <button className="btn btn-outline-danger btn-sm p-2" onClick={handleCancel}>
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tier Name</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={editForm.tier_name}
                                    onChange={(e) => setEditForm({ ...editForm, tier_name: e.target.value })}
                                    placeholder="e.g., Silver, Gold, Platinum"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tier Order</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={editForm.tier_order}
                                    onChange={(e) => setEditForm({ ...editForm, tier_order: parseInt(e.target.value) || 1 })}
                                    min="1"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower number = lower tier (1 is the lowest tier)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Min Lifetime Spending (Rp)</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={editForm.min_lifetime_spending}
                                    onChange={(e) => setEditForm({ ...editForm, min_lifetime_spending: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Max Lifetime Spending (Rp) - Optional</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={editForm.max_lifetime_spending || ''}
                                    onChange={(e) => setEditForm({ ...editForm, max_lifetime_spending: e.target.value ? parseInt(e.target.value) : null })}
                                    min="0"
                                    placeholder="No limit for highest tier"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Point Multiplier</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={editForm.point_multiplier}
                                    onChange={(e) => setEditForm({ ...editForm, point_multiplier: parseFloat(e.target.value) || 1 })}
                                    step="0.1"
                                    min="1"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">e.g., 1.5 = 1.5x points for this tier</p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-sm font-semibold mb-3">Tier Discount Benefit</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={editForm.discount_enabled}
                                        onChange={(e) => setEditForm({ ...editForm, discount_enabled: e.target.checked })}
                                    />
                                    <span className="text-sm">Enable Discount Benefit</span>
                                </div>
                                {editForm.discount_enabled && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Discount Percentage (%)</label>
                                        <input
                                            type="number"
                                            className="form-input w-full"
                                            value={editForm.discount_percentage}
                                            onChange={(e) => setEditForm({ ...editForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Automatic discount on every order (excludes products with promo)</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn btn-outline-danger flex-1" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary flex-1" onClick={handleSave}>
                                    {editingTier ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyTiers;
