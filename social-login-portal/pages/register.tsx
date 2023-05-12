import React, {FC, useContext, useState} from "react";
import {Button} from "primereact/button";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import {registerSchema} from "../utils/schema";
import {NextRouter, useRouter} from "next/router";
import {Messages} from "primereact/messages";
import {Divider} from "primereact/divider";
import InputTextComponent from "../components/InputTextComponent";
import PasswordComponent from "../components/PasswordComponent";
import useShowMessage from "../utils/use-show-message";
import {validateFormData} from "../utils/validation";
import {RegisterRequest, useRegister} from "./api/auth";
import {SeverityEnum, ToastContext} from "../components/ToastContext";

const Register: FC = () => {
    const {msg, showMessage} = useShowMessage();
    const {showToast} = useContext(ToastContext);
    const router: NextRouter = useRouter();
    const {getValues, control, register, formState: {errors}, trigger} = useForm({
        mode: "onChange",
        resolver: yupResolver(registerSchema)
    });
    const {mutate} = useRegister();
    const [loading, setLoading] = useState(false);

    const onRegister = async () => {
        const validationResult = await validateFormData(getValues(), registerSchema, trigger);
        if (Object.keys(validationResult.errors).length === 0) {
            setLoading(true);
            mutate(getValues() as RegisterRequest, {
                onSuccess: async () => {
                    showToast(
                        "",
                        "Please check your email and follow the instructions to verify your account. " +
                        "If you did not receive the email, please check your spam folder or request a new verification link",
                        SeverityEnum.INFO,
                        15000);
                    await router.push("/auth");
                },
                onError: (e: any) => {
                    showMessage(e.response.data.message, SeverityEnum.ERROR);
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }
    }

    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider/>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );

    return (
        <>
            <div
                className="surface-ground flex justify-content-center min-h-screen min-w-screen align-items-center">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                    <div className="flex align-items-center justify-content-between mb-5">
                        <span className="text-2xl font-medium text-900">Register</span>
                        <a tabIndex={0} onClick={() => router.push('/auth')}
                           className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150">Sign
                            in</a>
                    </div>
                    <div className="grid formgrid p-fluid">
                        <InputTextComponent control={control} name='firstname' labelName='Firstname'
                                            error={errors.firstname} register={register}/>
                        <InputTextComponent control={control} name='lastname' labelName='Lastname'
                                            error={errors.lastname}
                                            register={register}/>
                        <InputTextComponent control={control} name='email' labelName='Email' error={errors.email}
                                            register={register}/>
                        <PasswordComponent control={control} feedBack={true} name='password' labelName='Password'
                                           header={header} footer={footer} register={register}
                                           error={errors.password}></PasswordComponent>
                    </div>
                    <Messages ref={msg}/>
                    <Button onClick={onRegister} loading={loading} label="Sign Up"
                            className="w-full py-3 font-medium"></Button>
                </div>
            </div>
        </>
    );
}

export default Register;
