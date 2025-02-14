import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import { useAuthMutation } from '../../services/authService';
import { useForm } from 'react-hook-form';
import IconLockDots from '../../components/Icon/IconLockDots';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLoginSchema, LoginFormData } from '../../schema/loginSchema';
import IconLoaderDynamic from '../../components/Icon/IconLoaderDynamic';

const LoginCover = () => {
    const { mutate: login, isPending } = useAuthMutation();
    const loginSchema = useMemo(() => getLoginSchema(), []);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        reValidateMode: 'onBlur',
    });

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-black-light px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(255,255,255,1)_0%,rgba(255,127,80,0.15)_40%,rgba(255,127,80,0.7)_80%,rgba(255,127,80,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/logo/logo.png" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full h-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-full h-auto block lg:hidden">
                                <img src="/assets/logo/logo.png" alt="Logo" className="mx-auto w-15 h-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16 sm:mb-5">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Admin Panel</h1>
                                <p className="text-base font-bold leading-normal text-black dark:text-white">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2">
                                    <label htmlFor="user_email" className="block text-sm font-medium text-black-DEFAULT dark:text-white-DEFAULT">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="user_email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className={`w-full rounded-lg border bg-white px-4 py-3 pl-12 text-black shadow-sm transition duration-300
                        ${errors.user_email ? 'border-danger focus:border-danger focus:ring-primary' : 'border-gray-300 focus:border-primary focus:ring-primary'}
                        dark:bg-black-DEFAULT dark:border-white-dark placeholder:text-gray-400`}
                                            {...register('user_email')}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <IconMail className="h-5 w-5" />
                                        </span>
                                    </div>
                                    {errors.user_email && <p className="text-sm text-danger">{errors.user_email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="user_password" className="block text-sm font-medium text-black-DEFAULT dark:text-white-DEFAULT">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="user_password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className={`w-full rounded-lg border bg-white px-4 py-3 pl-12 text-black shadow-sm transition duration-300
                        ${errors.user_password ? 'border-danger focus:border-danger focus:ring-primary' : 'border-gray-300 focus:border-primary focus:ring-primary'}
                        dark:bg-black-DEFAULT dark:border-white-dark placeholder:text-gray-400`}
                                            {...register('user_password')}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <IconLockDots className="h-5 w-5" />
                                        </span>
                                    </div>
                                    {errors.user_password && <p className="text-sm text-danger">{errors.user_password.message}</p>}
                                </div>

                                <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(255,127,80,0.44)] mb-4" disabled={isPending}>
                                    {isPending ? <IconLoaderDynamic /> : 'SIGN IN'}
                                </button>
                            </form>
                        </div>
                        <div className="absolute bottom-6 w-full text-sm text-center px-4 md:px-0 dark:text-white">
                            <p className="">© {new Date().getFullYear()} Jaya Elektronik. All Rights Reserved. Powered by Grivo.id</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
