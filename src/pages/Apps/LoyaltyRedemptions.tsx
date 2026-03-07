import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllRedemptions, useCreateRedemption, useUpdateRedemption, useDeleteRedemption } from '../../services/loyaltyService';
import Swal from 'sweetalert2';
import formatToRupiah from '../../utils/formatToRupiah';
import IconGift from '../../components/Icon/IconGift';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrash from '../../components/Icon/IconTrash';
import IconX from '../../components/Icon/IconX';
import IconCoins from '../../components/Icon/IconCoins';

const LoyaltyRedemptions = () => {
    const dispatch = useDispatch();
    const { data: redemptions, isLoading } = useGetAllRedemptions();
    const { mutate: createRedemption } = useCreateRedemption();
    const { mutate: updateRedemption } = useUpdateRedemption();
    const { mutate: deleteRedemption } = useDeleteRedemption();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRedemption, setEditingRedemption] = useState<any>(null);
    const [formData, setFormData] = useState({
        redemption_name: '',
        points_required: 500,
        discount_amount: 10000,
        max_redemption_per_order: 1,
    });

    useEffect(() => {
        dispatch(setPageTitle('Point Redemptions'));
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            redemption_name: '',
            points_required: 500,
            discount_amount: 10000,
            max_redemption_per_order: 1,
        });
        setEditingRedemption(null);
    };

    const handleCreate = () => {
        setEditingRedemption(null);
        resetForm();
        setShowCreateModal(true);
    };

    const handleEdit = (redemption: any) => {
        setEditingRedemption(redemption);
        setFormData({
            redemption_name: redemption.redemption_name,
            points_required: redemption.points_required,
            discount_amount: redemption.discount_amount,
            max_redemption_per_order: redemption.max_redemption_per_order,
        });
        setShowCreateModal(true);
    };

    const handleDelete = (redemptionId: string, redemptionName: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Delete Redemption Option?',
            text: `Are you sure you want to delete "${redemptionName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRedemption(redemptionId, {
                    onSuccess: () => {
                        Swal.fire('Success', 'Redemption option deleted successfully', 'success');
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to delete redemption option', 'error');
                    },
                });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRedemption) {
            updateRedemption(
                {
                    redemptionId: editingRedemption.redemption_id,
                    data: formData,
                },
                {
                    onSuccess: () => {
                        Swal.fire('Success', 'Redemption option updated successfully', 'success');
                        setShowCreateModal(false);
                        resetForm();
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to update redemption option', 'error');
                    },
                }
            );
        } else {
            createRedemption(formData, {
                onSuccess: () => {
                    Swal.fire('Success', 'Redemption option created successfully', 'success');
                    setShowCreateModal(false);
                    resetForm();
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to create redemption option', 'error');
                },
            });
        }
    };

    const handleToggleActive = (redemption: any) => {
        updateRedemption(
            {
                redemptionId: redemption.redemption_id,
                data: { is_active: !redemption.is_active },
            },
            {
                onSuccess: () => {
                    const status = redemption.is_active ? 'disabled' : 'enabled';
                    Swal.fire('Success', `Redemption option ${status} successfully`, 'success');
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to update redemption option', 'error');
                },
            }
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Point Redemption Options</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage how customers can redeem their points</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleCreate}>
                    <IconPlus className="w-4 h-4" />
                    <span>Add Redemption</span>
                </button>
            </div>

            {/* Redemption Options List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="panel p-4 col-span-3">Loading...</div>
                ) : !redemptions || redemptions.length === 0 ? (
                    <div className="panel p-8 col-span-3 text-center">
                        <IconGift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No redemption options found. Add your first redemption option to get started!</p>
                    </div>
                ) : (
                    redemptions.map((redemption) => (
                        <div key={redemption.redemption_id} className={`panel ${redemption.is_active ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full ${redemption.is_active ? 'bg-primary/10 text-primary' : 'bg-gray-500/10 text-gray-500'} flex items-center justify-center`}>
                                        <IconCoins className="w-6 h-6" />
                                    </div>
                                    <div>
                                        {!redemption.is_active && <span className="badge bg-gray-500/10 text-gray-500 text-xs">Disabled</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="btn btn-outline-primary btn-sm p-2" onClick={() => handleEdit(redemption)}>
                                        <IconEdit className="w-4 h-4" />
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm p-2" onClick={() => handleDelete(redemption.redemption_id, redemption.redemption_name)}>
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-3">{redemption.redemption_name}</h3>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                                    <span className="text-gray-500">Points Required:</span>
                                    <span className="font-bold text-primary">{redemption.points_required.toLocaleString('id-ID')} pts</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-success/10 rounded">
                                    <span className="text-gray-500">Discount:</span>
                                    <span className="font-bold text-success">{formatToRupiah(redemption.discount_amount)}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-info/10 rounded">
                                    <span className="text-gray-500">Max Per Order:</span>
                                    <span className="font-bold text-info">{redemption.max_redemption_per_order}x</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                Point Value: {formatToRupiah(redemption.discount_amount / redemption.points_required)} per point
                            </div>

                            <button
                                className={`btn w-full ${redemption.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                onClick={() => handleToggleActive(redemption)}
                            >
                                {redemption.is_active ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="panel w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{editingRedemption ? 'Edit Redemption Option' : 'Add Redemption Option'}</h3>
                            <button className="btn btn-outline-danger btn-sm p-2" onClick={() => setShowCreateModal(false)}>
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Redemption Name</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={formData.redemption_name}
                                    onChange={(e) => setFormData({ ...formData, redemption_name: e.target.value })}
                                    placeholder="e.g., 500 Points - Rp 10.000 Discount"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Points Required</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={formData.points_required}
                                    onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Discount Amount (Rp)</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={formData.discount_amount}
                                    onChange={(e) => setFormData({ ...formData, discount_amount: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Max Redemptions Per Order</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={formData.max_redemption_per_order}
                                    onChange={(e) => setFormData({ ...formData, max_redemption_per_order: parseInt(e.target.value) || 1 })}
                                    min="1"
                                    required
                                />
                            </div>

                            {formData.redemption_name && formData.points_required > 0 && formData.discount_amount > 0 && (
                                <div className="p-3 bg-info/10 rounded">
                                    <div className="text-sm">
                                        <strong>Preview:</strong> {formData.redemption_name}
                                        <br />
                                        Value: {formatToRupiah(formData.discount_amount / formData.points_required)} per point
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn btn-outline-danger flex-1" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    {editingRedemption ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyRedemptions;
