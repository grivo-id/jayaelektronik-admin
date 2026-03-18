// Loyalty Program Types

export interface LoyaltyConfig {
    loyalty_config_id: string;
    point_conversion_rate: number;
    is_active: boolean;
    birthday_bonus_points: number;
    created_at: string;
    updated_at: string;
}

export interface LoyaltyTier {
    tier_id: string;
    tier_name: string;
    tier_order: number;
    min_lifetime_spending: number;
    max_lifetime_spending: number | null;
    point_multiplier: number;
    has_free_shipping: boolean;
    customer_count?: number;
    created_at: string;
    updated_at: string;
}

export interface CustomerLoyalty {
    customer_loyalty_id: string;
    user_id: string;
    tier_id: string;
    tier_name: string;
    total_points: number;
    total_points_used: number;
    total_points_available: number;
    lifetime_spending: number;
    current_level_spending: number;
    last_transaction_date: string | null;
    membership_downgraded_at: string | null;
    created_at: string;
    updated_at: string;
    profile?: {
        user_id: string;
        customer_loyalty_id?: string;
        user_email: string;
        user_fname?: string;
        user_lname?: string;
        user_phone?: string;
        tier_name?: string;
        created_at?: string;
        total_points_available?: number;
        total_points_used?: number;
        total_points?: number;
        lifetime_spending?: number;
        current_level_spending?: number;
    };
}

export interface PointTransaction {
    point_transaction_id: string;
    customer_loyalty_id: string;
    order_id: string | null;
    transaction_type: 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE' | 'BONUS';
    points_amount: number;
    points_balance_before: number;
    points_balance_after: number;
    transaction_reason: string;
    multiplier_applied: number;
    base_points: number;
    bonus_points: number;
    is_expired: boolean;
    expires_at: string | null;
    created_at: string;
    customer?: {
        user_id: string;
        user_email: string;
        user_fname?: string;
        user_lname?: string;
    };
}

export interface LoyaltyBonus {
    bonus_id: string;
    loyalty_config_id: string;
    bonus_type: 'DOUBLE_POINT' | 'FLASH_BONUS' | 'BIRTHDAY_BONUS' | 'SPECIAL_EVENT';
    bonus_name: string;
    bonus_description: string | null;
    bonus_multiplier: number | null;
    bonus_fixed_points: number | null;
    start_date: string;
    end_date: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoyaltyStats {
    total_members: number;
    active_members: number;
    total_points_issued: number;
    total_points_redeemed: number;
    points_issued_this_month: number;
    points_redeemed_this_month: number;
    tier_distribution: {
        tier_name: string;
        customer_count: number;
    }[];
    top_earners: {
        user_email: string;
        tier_name: string;
        total_points: number;
        lifetime_spending: number;
    }[];
}
