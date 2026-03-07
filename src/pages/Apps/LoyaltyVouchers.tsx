import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllTiers } from '../../services/loyaltyService';
import { useGetAllVouchers, useCreateVoucher, useUpdateVoucher, useDeleteVoucher } from '../../services/loyaltyService';
import Swal from 'sweetalert2';
import formatToRupiah from '../../utils/formatToRupiah';
import formatDate from '../../utils/formatDate';
import IconGift from '../../components/Icon/IconGift';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrash from '../../components/Icon/IconTrash';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const LoyaltyVouchers = () => {
    const dispatch = useDispatch();
    const { data: tiers } = useGetAllTiers();
    const { data: vouchers, isLoading } = useGetAllVouchers();
    const { mutate: createVoucher } = useCreateVoucher();
    const { mutate: updateVoucher } = useUpdateVoucher();
    const { mutate: deleteVoucher } = useDeleteVoucher();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<any>(null);
    const [formData, setFormData] = useState({
        tier_id: '',
        voucher_code: '',
        voucher_name: '',
        voucher_type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING',
        voucher_value: 10,
        max_discount: null as number | null,
        min_transaction: null as number | null,
        usage_limit: 100,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '' as string | null,
    });

    useEffect(() => {
        dispatch(setPageTitle('Tier Vouchers'));
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            tier_id: '',
            voucher_code: '',
            voucher_name: '',
            voucher_type: 'PERCENTAGE',
            voucher_value: 10,
            max_discount: null,
            min_transaction: null,
            usage_limit: 100,
            valid_from: new Date().toISOString().split('T')[0],
            valid_until: '',
        });
        setEditingVoucher(null);
    };

    const handleCreate = () => {
        setEditingVoucher(null);
        resetForm();
        setShowCreateModal(true);
    };

    const handleEdit = (voucher: any) => {
        setEditingVoucher(voucher);
        setFormData({
            tier_id: voucher.tier_id,
            voucher_code: voucher.voucher_code,
            voucher_name: voucher.voucher_name,
            voucher_type: voucher.voucher_type,
            voucher_value: voucher.voucher_value,
            max_discount: voucher.max_discount,
            min_transaction: voucher.min_transaction,
            usage_limit: voucher.usage_limit,
            valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
            valid_until: voucher.valid_until ? new Date(voucher.valid_until).toISOString().split('T')[0] : '',
        });
        setShowCreateModal(true);
    };

    const handleDelete = (voucherId: string, voucherName: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Delete Voucher?',
            text: `Are you sure you want to delete "${voucherName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteVoucher(voucherId, {
                    onSuccess: () => {
                        Swal.fire('Success', 'Voucher deleted successfully', 'success');
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to delete voucher', 'error');
                    },
                });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            voucher_code: formData.voucher_code || `VOU-${Date.now().toString(36).toUpperCase()}`,
            valid_until: formData.valid_until || undefined,
        };

        if (editingVoucher) {
            updateVoucher(
                {
                    voucherId: editingVoucher.voucher_id,
                    data: finalData,
                },
                {
                    onSuccess: () => {
                        Swal.fire('Success', 'Voucher updated successfully', 'success');
                        setShowCreateModal(false);
                        resetForm();
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to update voucher', 'error');
                    },
                }
            );
        } else {
            createVoucher(finalData, {
                onSuccess: () => {
                    Swal.fire('Success', 'Voucher created successfully', 'success');
                    setShowCreateModal(false);
                    resetForm();
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to create voucher', 'error');
                },
            });
        }
    };

    const handleToggleActive = (voucher: any) => {
        updateVoucher(
            {
                voucherId: voucher.voucher_id,
                data: { is_active: !voucher.is_active },
            },
            {
                onSuccess: () => {
                    const status = voucher.is_active ? 'disabled' : 'enabled';
                    Swal.fire('Success', `Voucher ${status} successfully`, 'success');
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to update voucher', 'error');
                },
            }
        );
    };

    const getVoucherTypeBadge = (type: string) => {
        const types: Record<string, { class: string; label: string }> = {
            PERCENTAGE: { class: 'bg-info/10 text-info', label: '%' },
            FIXED: { class: 'bg-success/10 text-success', label: 'Fixed' },
            FREE_SHIPPING: { class: 'bg-warning/10 text-warning', label: 'Free Shipping' },
        };
        return types[type] || { class: 'bg-gray-500/10 text-gray-500', label: type };
    };

    const getTierBadge = (tierName: string) => {
        if (tierName.toLowerCase().includes('blue')) return 'bg-blue-500/10 text-blue-500';
        if (tierName.toLowerCase().includes('silver')) return 'bg-gray-400/10 text-gray-400';
        if (tierName.toLowerCase().includes('gold')) return 'bg-yellow-500/10 text-yellow-500';
        if (tierName.toLowerCase().includes('platinum')) return 'bg-purple-500/10 text-purple-500';
        return 'bg-primary/10 text-primary';
    };

    const isVoucherValid = (voucher: any) => {
        if (!voucher.is_active) return false;
        const now = new Date();
        const startDate = new Date(voucher.valid_from);
        const endDate = voucher.valid_until ? new Date(voucher.valid_until) : null;
        return now >= startDate && (!endDate || now <= endDate);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Tier Vouchers</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage exclusive vouchers for different membership tiers</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleCreate}>
                    <IconPlus className="w-4 h-4" />
                    <span>Create Voucher</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="panel p-4 col-span-2">Loading...</div>
                ) : !vouchers || vouchers.length === 0 ? (
                    <div className="panel p-8 col-span-2 text-center">
                        <IconGift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No vouchers found. Create your first voucher to get started!</p>
                    </div>
                ) : (
                    vouchers.map((voucher) => {
                        const typeInfo = getVoucherTypeBadge(voucher.voucher_type);
                        const valid = isVoucherValid(voucher);

                        return (
                            <div key={voucher.voucher_id} className={`panel ${valid ? 'border-success' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>
                                            {valid && <span className="badge bg-success/10 text-success">Valid</span>}
                                            {!voucher.is_active && <span className="badge bg-gray-500/10 text-gray-500">Disabled</span>}
                                            <span className={`badge ${getTierBadge(voucher.tier_name)}`}>{voucher.tier_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">{voucher.voucher_name}</h3>
                                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{voucher.voucher_code}</code>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="btn btn-outline-primary btn-sm p-2" onClick={() => handleEdit(voucher)}>
                                            <IconEdit className="w-4 h-4" />
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm p-2" onClick={() => handleDelete(voucher.voucher_id, voucher.voucher_name)}>
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Value:</span>
                                        <span className="font-semibold">
                                            {voucher.voucher_type === 'PERCENTAGE' ? `${voucher.voucher_value}%` :
                                             voucher.voucher_type === 'FIXED' ? formatToRupiah(voucher.voucher_value) :
                                             'Free Shipping'}
                                        </span>
                                    </div>
                                    {voucher.max_discount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Max Discount:</span>
                                            <span className="font-semibold">{formatToRupiah(voucher.max_discount)}</span>
                                        </div>
                                    )}
                                    {voucher.min_transaction && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Min Transaction:</span>
                                            <span className="font-semibold">{formatToRupiah(voucher.min_transaction)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Usage:</span>
                                        <span className="font-semibold">{voucher.usage_count} / {voucher.usage_limit === 0 ? 'Unlimited' : voucher.usage_limit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Valid From:</span>
                                        <span>{formatDate(voucher.valid_from)}</span>
                                    </div>
                                    {voucher.valid_until && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Valid Until:</span>
                                            <span>{formatDate(voucher.valid_until)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        className={`btn w-full ${voucher.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                        onClick={() => handleToggleActive(voucher)}
                                    >
                                        {voucher.is_active ? 'Disable Voucher' : 'Enable Voucher'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="panel w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{editingVoucher ? 'Edit Voucher' : 'Create Voucher'}</h3>
                            <button className="btn btn-outline-danger btn-sm p-2" onClick={() => setShowCreateModal(false)}>
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Eligible Tier</label>
                                <select className="form-select w-full" value={formData.tier_id} onChange={(e) => setFormData({ ...formData, tier_id: e.target.value })} required>
                                    <option value="">Select a tier</option>
                                    {tiers?.map((tier) => (
                                        <option key={tier.tier_id} value={tier.tier_id}>{tier.tier_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Voucher Code</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={formData.voucher_code}
                                    onChange={(e) => setFormData({ ...formData, voucher_code: e.target.value.toUpperCase() })}
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Voucher Name</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={formData.voucher_name}
                                    onChange={(e) => setFormData({ ...formData, voucher_name: e.target.value })}
                                    placeholder="e.g., 10% Off for Gold Members"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Voucher Type</label>
                                <select className="form-select w-full" value={formData.voucher_type} onChange={(e) => setFormData({ ...formData, voucher_type: e.target.value as any })}>
                                    <option value="PERCENTAGE">Percentage Discount</option>
                                    <option value="FIXED">Fixed Amount Discount</option>
                                    <option value="FREE_SHIPPING">Free Shipping</option>
                                </select>
                            </div>

                            {formData.voucher_type !== 'FREE_SHIPPING' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {formData.voucher_type === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (Rp)'}
                                    </label>
                                    <input
                                        type="number"
                                        className="form-input w-full"
                                        value={formData.voucher_value}
                                        onChange={(e) => setFormData({ ...formData, voucher_value: parseInt(e.target.value) || 0 })}
                                        min="0"
                                        required
                                    />
                                </div>
                            )}

                            {formData.voucher_type === 'PERCENTAGE' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Discount (Rp) - Optional</label>
                                    <input
                                        type="number"
                                        className="form-input w-full"
                                        value={formData.max_discount || ''}
                                        onChange={(e) => setFormData({ ...formData, max_discount: e.target.value ? parseInt(e.target.value) : null })}
                                        min="0"
                                        placeholder="No limit"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Usage Limit (0 = Unlimited)</label>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    value={formData.usage_limit}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Valid From</label>
                                <Flatpickr
                                    className="form-input w-full"
                                    value={formData.valid_from}
                                    onChange={(date) => setFormData({ ...formData, valid_from: date[0]?.toISOString().split('T')[0] || '' })}
                                    options={{
                                        dateFormat: 'Y-m-d',
                                        altInput: true,
                                        altFormat: 'd/m/Y',
                                        altInputClass: 'form-input',
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Valid Until (Optional)</label>
                                <Flatpickr
                                    className="form-input w-full"
                                    value={formData.valid_until}
                                    onChange={(date) => setFormData({ ...formData, valid_until: date[0]?.toISOString().split('T')[0] || '' })}
                                    options={{
                                        dateFormat: 'Y-m-d',
                                        altInput: true,
                                        altFormat: 'd/m/Y',
                                        altInputClass: 'form-input',
                                        minDate: formData.valid_from,
                                    }}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn btn-outline-danger flex-1" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    {editingVoucher ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyVouchers;
