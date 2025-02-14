export interface Toast {
    toast_id: string;
    user_id: string;
    toast_title: string;
    toast_message: string;
    toast_expired_date: string;
    toast_created_date: string;
}

export interface ToastDisplay {
    message: string;
    expiresIn: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
}
