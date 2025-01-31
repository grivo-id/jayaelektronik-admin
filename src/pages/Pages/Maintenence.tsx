import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';

const UnderDevelopment = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Under Development'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <img
                    src={isDark ? '/assets/images/error/maintenence-dark.svg' : '/assets/images/error/maintenence-light.svg'}
                    alt="maintenance"
                    className="mx-auto w-full max-w-xs object-cover md:max-w-sm"
                />
                <h2 className="mt-4 text-2xl font-bold text-primary md:text-3xl">Under Development</h2>
                <p className="mt-2 text-base">
                    We're working on this feature to improve your experience.
                    <br />
                    Please check back soon.
                </p>
                <Link to="/" className="btn btn-primary mt-4 inline-block">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default UnderDevelopment;
