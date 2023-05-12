import {Control, FieldError, FieldErrorsImpl} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import React, {ReactNode} from "react";
import {Merge} from "type-fest";

type InputTextProps = {
    control: Control;

    name: string;

    labelName: string;

    placeholder?: string;

    register: any;

    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;

    col?: string;

}

const InputTextComponent = ({col = "12", name, labelName, placeholder, error, register}: InputTextProps) => {
    return (
        <div className={`field col-12 mb-4 md:col-${col}`}>
            <label htmlFor={name} className={"font-medium text-900"}>{labelName}</label>
            <InputText
                id={name}
                placeholder={placeholder ? placeholder : 'Enter ' + labelName + '...'}
                className={error && "p-invalid"}
                {...register(name)}
            />
            <small className="p-error">
                {error && <p className="mt-2 mb-2">{error.message as ReactNode}</p>}
            </small>
        </div>
    );
}

export default InputTextComponent;
