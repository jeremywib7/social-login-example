import {Control, Controller, FieldError, FieldErrorsImpl} from "react-hook-form";
import React, {ReactNode} from "react";
import {Password} from "primereact/password";
import {classNames} from "primereact/utils";
import {Merge} from "type-fest";

type PasswordProps = {
    control: Control;

    feedBack: boolean;

    name: string;

    labelName: string;

    placeholder?: string;

    register: any;

    isNewPassword?: boolean;

    header?: React.ReactNode;

    footer?: React.ReactNode;

    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;

    col?: string;

}

const PasswordComponent = ({
                               col = "12",
                               control,
                               header,
                               footer,
                               feedBack,
                               name,
                               labelName,
                               placeholder,
                               error,
                               register
                           }: PasswordProps) => {
    return (
        <div className={`field mb-4 col-${col}`}>
            <label htmlFor={name} className={"font-medium text-900"}>{labelName}</label>
            <Controller
                name={name}
                defaultValue=""
                control={control}
                render={({field, fieldState}) => (
                    <>
                        <Password
                            id={field.name}
                            {...field}
                            inputRef={field.ref}
                            placeholder={placeholder ? placeholder : 'Enter ' + labelName + "..."}
                            header={header}
                            footer={footer}
                            toggleMask
                            autoComplete={"new-password"}
                            className={classNames(
                                {'p-invalid': fieldState.error})}
                            feedback={feedBack}/>
                    </>
                )}
            />
            <small className="p-error">
                {error && <p className="mt-2">{error.message as ReactNode}</p>}
            </small>
        </div>
    );
}

export default PasswordComponent;
