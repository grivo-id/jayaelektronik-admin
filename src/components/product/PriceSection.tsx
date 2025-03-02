import { Control, Controller, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { NumericFormat as NumberFormat } from 'react-number-format';
import { CreateProductPayload } from '../../schema/productSchema';
import { useEffect } from 'react';

interface PriceSectionProps {
    control: Control<CreateProductPayload>;
    register: UseFormRegister<CreateProductPayload>;
    setValue: UseFormSetValue<CreateProductPayload>;
    watch: UseFormWatch<CreateProductPayload>;
    errors: any;
    promoTypes?: any[];
}

const PriceSection = ({ control, register, setValue, watch, errors, promoTypes }: PriceSectionProps) => {
    const promoType = watch('product_promo_type');
    const productPrice = watch('product_price');
    const promoCashbackPrice = watch('product_promo_price');
    const discountPercentage = watch('product_promo_discount_percentage');

    const handlePromoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setValue('product_promo_type', type);

        setValue('product_promo_price', 0);
        setValue('product_promo_discount_percentage', 0);
        setValue('product_promo_final_price', productPrice || 0);

        setValue('product_promo_is_discount', type !== '');
    };

    useEffect(() => {
        if (!productPrice) return;

        if (promoType === 'cashback' && promoCashbackPrice) {
            const finalPrice = productPrice - promoCashbackPrice;
            setValue('product_promo_final_price', Math.max(0, finalPrice));
        } else if (promoType === 'discount_percentage' && discountPercentage) {
            const discountAmount = (productPrice * discountPercentage) / 100;
            const finalPrice = productPrice - discountAmount;
            setValue('product_promo_final_price', finalPrice);
            setValue('product_promo_price', discountAmount);
        } else if (promoType === 'discount_rupiah' && promoCashbackPrice) {
            const finalPrice = productPrice - promoCashbackPrice;
            const percentage = (promoCashbackPrice / productPrice) * 100;
            setValue('product_promo_final_price', Math.max(0, finalPrice));
            setValue('product_promo_discount_percentage', Math.round(percentage));
        } else {
            setValue('product_promo_final_price', productPrice);
            setValue('product_promo_price', 0);
            setValue('product_promo_discount_percentage', 0);
        }
    }, [promoType, productPrice, promoCashbackPrice, discountPercentage, setValue]);

    return (
        <div className="grid gap-4">
            <div>
                <label htmlFor="product_price">
                    Price <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                    <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">Rp</div>
                    <Controller
                        control={control}
                        name="product_price"
                        render={({ field: { onChange, value } }) => (
                            <NumberFormat
                                thousandSeparator="."
                                decimalSeparator=","
                                id="product_price"
                                className="form-input rounded-l-none"
                                placeholder="Enter price"
                                value={value}
                                onValueChange={(values) => {
                                    const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                    onChange(Number(numericValue));
                                }}
                            />
                        )}
                    />
                </div>
                {errors.product_price && <span className="text-red-500 text-sm">{errors.product_price.message}</span>}
            </div>

            <div>
                <label htmlFor="product_promo_type">
                    Promo <span className="text-red-500">*</span>
                </label>
                <select id="product_promo_type" className="form-select" {...register('product_promo_type')} onChange={handlePromoTypeChange}>
                    <option value="">No</option>
                    {promoTypes?.map((type) => (
                        <option key={type.code} value={type.code}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="product_promo_expired_date">Expired Date</label>
                <input type="datetime-local" id="product_promo_expired_date" className="form-input" {...register('product_promo_expired_date')} />
                {errors.product_promo_expired_date && <span className="text-danger">{errors.product_promo_expired_date.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {promoType === 'cashback' && (
                    <div className="col-span-2">
                        <label htmlFor="product_promo_price">Cashback Amount</label>
                        <Controller
                            control={control}
                            name="product_promo_price"
                            render={({ field: { onChange, value } }) => (
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        Rp
                                    </div>
                                    <NumberFormat
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        id="product_promo_price"
                                        className="form-input rounded-l-none"
                                        placeholder="Enter cashback amount"
                                        value={value}
                                        onValueChange={(values) => {
                                            const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                            onChange(Number(numericValue));
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                )}

                {promoType === 'discount_rupiah' && (
                    <>
                        <div>
                            <label htmlFor="product_promo_price">Discount Amount</label>
                            <Controller
                                control={control}
                                name="product_promo_price"
                                render={({ field: { onChange, value } }) => (
                                    <div className="flex">
                                        <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp
                                        </div>
                                        <NumberFormat
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            id="product_promo_price"
                                            className="form-input rounded-l-none"
                                            placeholder="Enter discount amount"
                                            value={value}
                                            onValueChange={(values) => {
                                                const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                onChange(Number(numericValue));
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <div>
                            <label>Percentage</label>
                            <Controller
                                control={control}
                                name="product_promo_discount_percentage"
                                render={({ field: { value } }) => <NumberFormat className="form-input bg-gray-100" value={value} suffix="%" disabled />}
                            />
                        </div>
                    </>
                )}

                {promoType === 'discount_percentage' && (
                    <>
                        <div>
                            <label htmlFor="product_promo_discount_percentage">Discount Percentage (%)</label>
                            <Controller
                                control={control}
                                name="product_promo_discount_percentage"
                                render={({ field: { onChange, value } }) => (
                                    <NumberFormat
                                        id="product_promo_discount_percentage"
                                        className="form-input"
                                        value={value}
                                        onValueChange={(values) => onChange(Number(values.value))}
                                        allowNegative={false}
                                        decimalScale={0}
                                        max={100}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <label>Discount Amount</label>
                            <Controller
                                control={control}
                                name="product_promo_price"
                                render={({ field: { value } }) => (
                                    <div className="flex">
                                        <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp
                                        </div>
                                        <NumberFormat thousandSeparator="." decimalSeparator="," className="form-input rounded-l-none bg-gray-100" value={value} disabled />
                                    </div>
                                )}
                            />
                        </div>
                    </>
                )}

                <div className="col-span-2">
                    <label htmlFor="product_promo_final_price">Final Price</label>
                    <Controller
                        control={control}
                        name="product_promo_final_price"
                        render={({ field: { value } }) => (
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    Rp
                                </div>
                                <NumberFormat thousandSeparator="." decimalSeparator="," id="product_promo_final_price" className="form-input rounded-l-none bg-gray-100" value={value} disabled />
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceSection;
