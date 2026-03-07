import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllBonuses, useCreateBonus, useUpdateBonus, useDeleteBonus } from '../../services/loyaltyService';
import Swal from 'sweetalert2';
import formatDate from '../../utils/formatDate';
import IconGift from '../../components/Icon/IconGift';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrash from '../../components/Icon/IconTrash';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const LoyaltyBonuses = () => {
    const dispatch = useDispatch();
    const { data: bonuses, isLoading } = useGetAllBonuses();
    const { mutate: createBonus } = useCreateBonus();
    const { mutate: updateBonus } = useUpdateBonus();
    const { mutate: deleteBonus } = useDeleteBonus();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBonus, setEditingBonus] = useState<any>(null);
    const [formData, setFormData] = useState({
        bonus_type: 'DOUBLE_POINT' as 'DOUBLE_POINT' | 'FLASH_BONUS' | 'BIRTHDAY_BONUS' | 'SPECIAL_EVENT',
        bonus_name: '',
        bonus_description: '',
        bonus_multiplier: 2,
        bonus_fixed_points: null as number | null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '' as string | null,
    });

    useEffect(() => {
        dispatch(setPageTitle('Loyalty Bonuses'));
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            bonus_type: 'DOUBLE_POINT',
            bonus_name: '',
            bonus_description: '',
            bonus_multiplier: 2,
            bonus_fixed_points: null,
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
        });
        setEditingBonus(null);
    };

    const handleCreate = () => {
        setEditingBonus(null);
        resetForm();
        setShowCreateModal(true);
    };

    const handleEdit = (bonus: any) => {
        setEditingBonus(bonus);
        setFormData({
            bonus_type: bonus.bonus_type,
            bonus_name: bonus.bonus_name,
            bonus_description: bonus.bonus_description || '',
            bonus_multiplier: bonus.bonus_multiplier || 2,
            bonus_fixed_points: bonus.bonus_fixed_points,
            start_date: new Date(bonus.start_date).toISOString().split('T')[0],
            end_date: bonus.end_date ? new Date(bonus.end_date).toISOString().split('T')[0] : '',
        });
        setShowCreateModal(true);
    };

    const handleDelete = (bonusId: string, bonusName: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Delete Bonus?',
            text: `Are you sure you want to delete "${bonusName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBonus(bonusId, {
                    onSuccess: () => {
                        Swal.fire('Success', 'Bonus deleted successfully', 'success');
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to delete bonus', 'error');
                    },
                });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...formData,
            end_date: formData.end_date || undefined,
        };

        if (editingBonus) {
            updateBonus(
                {
                    bonusId: editingBonus.bonus_id,
                    data,
                },
                {
                    onSuccess: () => {
                        Swal.fire('Success', 'Bonus updated successfully', 'success');
                        setShowCreateModal(false);
                        resetForm();
                    },
                    onError: (error: any) => {
                        Swal.fire('Error', error.response?.data?.message || 'Failed to update bonus', 'error');
                    },
                }
            );
        } else {
            createBonus(data, {
                onSuccess: () => {
                    Swal.fire('Success', 'Bonus created successfully', 'success');
                    setShowCreateModal(false);
                    resetForm();
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to create bonus', 'error');
                },
            });
        }
    };

    const handleToggleActive = (bonus: any) => {
        updateBonus(
            {
                bonusId: bonus.bonus_id,
                data: { is_active: !bonus.is_active },
            },
            {
                onSuccess: () => {
                    const status = bonus.is_active ? 'disabled' : 'enabled';
                    Swal.fire('Success', `Bonus ${status} successfully`, 'success');
                },
                onError: (error: any) => {
                    Swal.fire('Error', error.response?.data?.message || 'Failed to update bonus', 'error');
                },
            }
        );
    };

    const getBonusTypeBadge = (type: string) => {
        const types: Record<string, { class: string; label: string }> = {
            DOUBLE_POINT: { class: 'bg-info/10 text-info', label: 'Double Points' },
            FLASH_BONUS: { class: 'bg-warning/10 text-warning', label: 'Flash Bonus' },
            BIRTHDAY_BONUS: { class: 'bg-success/10 text-success', label: 'Birthday Bonus' },
            SPECIAL_EVENT: { class: 'bg-purple-500/10 text-purple-500', label: 'Special Event' },
        };
        return types[type] || { class: 'bg-gray-500/10 text-gray-500', label: type };
    };

    const isBonusActive = (bonus: any) => {
        if (!bonus.is_active) return false;
        const now = new Date();
        const startDate = new Date(bonus.start_date);
        const endDate = bonus.end_date ? new Date(bonus.end_date) : null;
        return now >= startDate && (!endDate || now <= endDate);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Loyalty Bonuses</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage promotional bonuses and special events</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleCreate}>
                    <IconPlus className="w-4 h-4" />
                    <span>Create Bonus</span>
                </button>
            </div>

            {/* Bonuses List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="panel p-4 col-span-2">Loading...</div>
                ) : !bonuses || bonuses.length === 0 ? (
                    <div className="panel p-8 col-span-2 text-center">
                        <IconGift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No bonuses found. Create your first bonus to get started!</p>
                    </div>
                ) : (
                    bonuses.map((bonus) => {
                        const typeInfo = getBonusTypeBadge(bonus.bonus_type);
                        const active = isBonusActive(bonus);

                        return (
                            <div key={bonus.bonus_id} className={`panel ${active ? 'border-success' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>
                                            {active && <span className="badge bg-success/10 text-success">Active</span>}
                                            {!bonus.is_active && <span className="badge bg-gray-500/10 text-gray-500">Disabled</span>}
                                        </div>
                                        <h3 className="text-lg font-semibold">{bonus.bonus_name}</h3>
                                        {bonus.bonus_description && <p className="text-sm text-gray-500 mt-1">{bonus.bonus_description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="btn btn-outline-primary btn-sm p-2" onClick={() => handleEdit(bonus)}>
                                            <IconEdit className="w-4 h-4" />
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm p-2" onClick={() => handleDelete(bonus.bonus_id, bonus.bonus_name)}>
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    {bonus.bonus_multiplier && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Multiplier:</span>
                                            <span className="font-semibold">{bonus.bonus_multiplier}x points</span>
                                        </div>
                                    )}
                                    {bonus.bonus_fixed_points && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Fixed Points:</span>
                                            <span className="font-semibold">{bonus.bonus_fixed_points} points</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Start Date:</span>
                                        <span>{formatDate(bonus.start_date)}</span>
                                    </div>
                                    {bonus.end_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">End Date:</span>
                                            <span>{formatDate(bonus.end_date)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        className={`btn w-full ${bonus.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                        onClick={() => handleToggleActive(bonus)}
                                    >
                                        {bonus.is_active ? 'Disable Bonus' : 'Enable Bonus'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="panel w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{editingBonus ? 'Edit Bonus' : 'Create Bonus'}</h3>
                            <button className="btn btn-outline-danger btn-sm p-2" onClick={() => setShowCreateModal(false)}>
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Bonus Type</label>
                                <select className="form-select w-full" value={formData.bonus_type} onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value as any })}>
                                    <option value="DOUBLE_POINT">Double Points</option>
                                    <option value="FLASH_BONUS">Flash Bonus</option>
                                    <option value="BIRTHDAY_BONUS">Birthday Bonus</option>
                                    <option value="SPECIAL_EVENT">Special Event</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Bonus Name</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={formData.bonus_name}
                                    onChange={(e) => setFormData({ ...formData, bonus_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                                <textarea
                                    className="form-input w-full"
                                    rows={2}
                                    value={formData.bonus_description}
                                    onChange={(e) => setFormData({ ...formData, bonus_description: e.target.value })}
                                />
                            </div>

                            {(formData.bonus_type === 'DOUBLE_POINT' || formData.bonus_type === 'FLASH_BONUS') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Point Multiplier</label>
                                    <input
                                        type="number"
                                        className="form-input w-full"
                                        value={formData.bonus_multiplier}
                                        onChange={(e) => setFormData({ ...formData, bonus_multiplier: parseFloat(e.target.value) || 1 })}
                                        min="1"
                                        step="0.1"
                                        required
                                    />
                                </div>
                            )}

                            {formData.bonus_type === 'SPECIAL_EVENT' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Fixed Points</label>
                                    <input
                                        type="number"
                                        className="form-input w-full"
                                        value={formData.bonus_fixed_points || ''}
                                        onChange={(e) => setFormData({ ...formData, bonus_fixed_points: parseInt(e.target.value) || null })}
                                        min="0"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date</label>
                                <Flatpickr
                                    className="form-input w-full"
                                    value={formData.start_date}
                                    onChange={(date) => setFormData({ ...formData, start_date: date[0]?.toISOString().split('T')[0] || '' })}
                                    options={{
                                        dateFormat: 'Y-m-d',
                                        altInput: true,
                                        altFormat: 'd/m/Y',
                                        altInputClass: 'form-input',
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                                <Flatpickr
                                    className="form-input w-full"
                                    value={formData.end_date}
                                    onChange={(date) => setFormData({ ...formData, end_date: date[0]?.toISOString().split('T')[0] || '' })}
                                    options={{
                                        dateFormat: 'Y-m-d',
                                        altInput: true,
                                        altFormat: 'd/m/Y',
                                        altInputClass: 'form-input',
                                        minDate: formData.start_date,
                                    }}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn btn-outline-danger flex-1" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    {editingBonus ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyBonuses;
