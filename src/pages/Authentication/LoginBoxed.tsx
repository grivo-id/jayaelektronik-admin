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
        <div>
            <div className="relative flex min-h-screen items-center justify-center">
                <div className="relative w-full max-w-[870px] p-2">
                    <div className="relative flex flex-col justify-center rounded-xl bg-white/40 backdrop-blur-md dark:bg-black/40 shadow-[0_0_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_0_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(255,255,255,0.1)] px-6 lg:min-h-[758px] py-20">
                        <div className="absolute top-6 end-6"></div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="user_email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className={`form-input ps-10 placeholder:text-white-dark ${errors.user_email ? 'border-danger' : ''}`}
                                            {...register('user_email')}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {errors.user_email && <p className="text-danger mt-1">{errors.user_email.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="user_password"
                                            type="password"
                                            placeholder="Enter Password"
                                            className={`form-input ps-10 placeholder:text-white-dark ${errors.user_password ? 'border-danger' : ''}`}
                                            {...register('user_password')}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {errors.user_password && <p className="text-danger mt-1">{errors.user_password.message}</p>}
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
