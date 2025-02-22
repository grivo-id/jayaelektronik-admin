import { useEffect, useState } from 'react';
import IconX from '../Icon/IconX';
import { Toast } from '../../types/announcer';

interface ToastPreviewProps {
    toast: Toast | null;
    isOpen: boolean;
    onClose: () => void;
}

const ToastPreview = ({ toast, isOpen, onClose }: ToastPreviewProps) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!toast || !isOpen) {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setIsLoading(true);
            return;
        }

        const calculateTime = () => {
            const now = new Date().getTime();
            const expireDate = new Date(toast.toast_expired_date).getTime();
            const distance = expireDate - now;

            if (distance < 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return false;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
            return true;
        };

        const isValid = calculateTime();
        setIsLoading(false);

        if (!isValid) return;

        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [toast, isOpen]);

    if (!toast || !isOpen) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60]">
            <div className="w-full min-h-[40px] py-2 px-4 md:px-6 lg:px-8 flex items-center justify-center relative text-sm text-white bg-gradient-to-r from-[#fe4800] to-[#ff6501]">
                <div className="flex items-center">
                    <div dangerouslySetInnerHTML={{ __html: toast.toast_message }} />
                </div>
                <span className="flex items-center font-semibold text-white ltr:ml-2 rtl:mr-2 ltr:pr-6 rtl:pl-6">
                    {isLoading ? (
                        <div className="flex items-center gap-1">
                            <div className="w-[37px] h-[30px] bg-white/20 animate-pulse rounded"></div>
                            <span>:</span>
                            <div className="w-[37px] h-[30px] bg-white/20 animate-pulse rounded"></div>
                            <span>:</span>
                            <div className="w-[37px] h-[30px] bg-white/20 animate-pulse rounded"></div>
                        </div>
                    ) : (
                        <>
                            {countdown.days > 0 && (
                                <>
                                    <span className="flex items-center justify-center min-w-[30px] md:min-w-[37px] min-h-[30px] bg-white text-[#fe4800] rounded p-1 mx-1 md:mx-1.5">
                                        {String(countdown.days).padStart(2, '0')}
                                    </span>
                                    :
                                </>
                            )}
                            <span className="flex items-center justify-center min-w-[30px] md:min-w-[37px] min-h-[30px] bg-white text-[#fe4800] rounded p-1 mx-1 md:mx-1.5">
                                {String(countdown.hours).padStart(2, '0')}
                            </span>
                            :
                            <span className="flex items-center justify-center min-w-[30px] md:min-w-[37px] min-h-[30px] bg-white text-[#fe4800] rounded p-1 mx-1 md:mx-1.5">
                                {String(countdown.minutes).padStart(2, '0')}
                            </span>
                            :
                            <span className="flex items-center justify-center min-w-[30px] md:min-w-[37px] min-h-[30px] bg-white text-[#fe4800] rounded p-1 mx-1 md:mx-1.5">
                                {String(countdown.seconds).padStart(2, '0')}
                            </span>
                        </>
                    )}
                </span>
                <button
                    aria-label="Close Button"
                    className="absolute flex items-center justify-center transition-colors duration-200 rounded-full outline-none w-7 md:w-8 h-7 md:h-8 ltr:right-0 rtl:left-0 ltr:mr-2 rtl:ml-2 md:ltr:mr-3 lg:ltr:mr-4 md:rtl:ml-7 2xl:rtl:ml-8 hover:bg-white/10 focus:text-white"
                    onClick={onClose}
                >
                    <IconX className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ToastPreview;
