import { useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { useAuthMutation } from '../../services/authService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLoginSchema, LoginFormData } from '../../schema/loginSchema';
import IconLoaderDynamic from '../../components/Icon/IconLoaderDynamic';

const LoginBoxed = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light dark:from-dark-DEFAULT dark:to-black-DEFAULT">
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-[870px]">
                    <div className="relative rounded-2xl bg-white/90 backdrop-blur-lg dark:bg-black/80 shadow-xl dark:shadow-[0_0_2px_rgba(255,255,255,0.1),0_8px_16px_rgba(255,255,255,0.1)] px-8 py-12 lg:px-12 lg:py-16">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-12 text-center">
                                <h1 className="mb-3 text-4xl font-extrabold uppercase tracking-wide text-primary dark:text-primary-light md:text-5xl">Sign in</h1>
                                <p className="text-lg text-black-DEFAULT/70 dark:text-white-DEFAULT/70">Enter your email and password to login</p>
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
                                            className={`w-full rounded-lg border bg-white px-4 py-3 pl-12 text-base shadow-sm transition duration-300
                        ${errors.user_email ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-gray-300 focus:border-primary focus:ring-primary/20'}
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
                                            className={`w-full rounded-lg border bg-white px-4 py-3 pl-12 text-base shadow-sm transition duration-300
                        ${errors.user_password ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-gray-300 focus:border-primary focus:ring-primary/20'}
                        dark:bg-black-DEFAULT dark:border-white-dark placeholder:text-gray-400`}
                                            {...register('user_password')}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <IconLockDots className="h-5 w-5" />
                                        </span>
                                    </div>
                                    {errors.user_password && <p className="text-sm text-danger">{errors.user_password.message}</p>}
                                </div>

                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" disabled={isPending}>
                                    {isPending ? <IconLoaderDynamic /> : 'SIGN IN'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
