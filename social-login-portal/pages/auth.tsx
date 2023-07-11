import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider"; 
import {validateFormData} from "../utils/validation";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import {loginSchema} from "../utils/schema";
import {signIn} from "next-auth/react";
import {NextRouter, useRouter} from "next/router";
import {Checkbox} from "primereact/checkbox";
import {Messages} from "primereact/messages";
import useShowMessage from "../utils/use-show-message";
import {SeverityEnum} from "../components/ToastContext";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const Auth = () => {
    const {msg, showMessage} = useShowMessage();
    const [checked, setChecked] = useState(false);
    const {executeRecaptcha} = useGoogleReCaptcha();
    const router: NextRouter = useRouter();
    const {getValues, register, formState: {errors}, trigger} = useForm({
        mode: "onChange",
        resolver: yupResolver(loginSchema)
    });
    const [loading, setLoading] = useState(false);

    const onSignInWithCredentials = async (): Promise<any> => {
        setLoading(true);
        const validationResult = await validateFormData(getValues(), loginSchema, trigger);
        if (Object.keys(validationResult.errors).length === 0) {
            if (!executeRecaptcha) {
                setLoading(false);
                return;
            }
            const token = await executeRecaptcha();
            const result = await signIn("credentials", {
                email: getValues().email,
                password: getValues().password,
                token: token,
                redirect: false
            });
            if (result && result.error) {
                setLoading(false);
                return showMessage(result.error, SeverityEnum.ERROR);
            }
            return await router.push('/');
        }
    }

    const onLoginWithGoogle = async () => {
        await signIn('google', {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL
        });
    }

    const onLoginWithFacebook = async () => {
        await signIn('facebook', {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL
        });
    }


    return (
        <div
            className="surface-ground flex justify-content-center min-h-screen min-w-screen align-items-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="flex align-items-center justify-content-between mb-7">
                    <span className="text-2xl font-medium text-900">Login</span>
                    <a tabIndex={0} onClick={() => router.push('/register')}
                       className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150">Sign
                        up</a>
                </div>
                <div className="flex justify-content-between">
                    <button onClick={onLoginWithFacebook}
                            className="mr-2 w-6 font-medium border-1 surface-border surface-100 py-3 px-2 p-component hover:surface-200 active:surface-300 text-900 cursor-pointer transition-colors transition-duration-150 inline-flex align-items-center justify-content-center">
                        <i className="pi pi-facebook text-indigo-500 mr-2"></i>
                        <span>Sign in With Facebook</span>
                    </button>
                    <button onClick={onLoginWithGoogle}
                            className="ml-2 w-6 font-medium border-1 surface-border surface-100 py-3 px-2 p-component hover:surface-200 active:surface-300 text-900 cursor-pointer transition-colors transition-duration-150 inline-flex align-items-center justify-content-center">
                        <i className="pi pi-google text-red-500 mr-2"></i>
                        <span>Sign in With Google</span>
                    </button>
                </div>
                <Divider align="center" className="my-4">
                    <span className="text-600 font-normal text-sm">OR</span>
                </Divider>

                <div className="mb-4">
                    <label htmlFor="email4" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email4" type="text" placeholder="Email address"
                               className={`w-full p-3 mb-1 ${errors.email ? "p-invalid" : ""}`}
                               {...register("email")}></InputText>
                    <small className="p-error">
                        <span>{errors.email?.message as string}</span>
                    </small>
                </div>

                <div className="mb-2">
                    <label htmlFor="password4" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password4" type="password" placeholder="Password"
                               className={`w-full p-3 mb-1 ${errors.password ? "p-invalid" : ""}`}
                               {...register("password")}></InputText>
                    <small className="p-error">
                        <span>{errors.password?.message as string}</span>
                    </small>
                </div>

                <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                        <Checkbox inputId="ingredient1" name="pizza" value="Cheese" checked={checked}
                                  onClick={() => setChecked(true)}/>
                        <label htmlFor="ingredient1" className="ml-2">Remember me</label>
                    </div>
                    <a className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150">Forgot
                        password?</a>
                </div>
                <Messages ref={msg}/>
                <Button onClick={onSignInWithCredentials} loading={loading} label="Sign In"
                        className="w-full py-3 font-medium"></Button>
            </div>
        </div>
    );
}

export default Auth;
