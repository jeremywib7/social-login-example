import { FieldValues, UseFormTrigger } from "react-hook-form";

export {};

interface ValidationResult {
    data: any;
    errors: Record<string, string>;
}

export const validateFormData = async (
    formData: any,
    schema: any,
    trigger: UseFormTrigger<FieldValues>
): Promise<ValidationResult> => {
    try {
        const validatedData = await schema.validate(formData, {
            abortEarly: false,
        });
        return { data: validatedData, errors: {} };
    } catch (error: any) {
        const validationErrors = error.inner.reduce(
            (acc: Record<string, string>, currentError: any) => ({
                ...acc,
                [currentError.path]: currentError.message,
            }),
            {}
        );

        const firstErrorField = Object.keys(validationErrors)[0];
        const firstErrorElement = document.getElementsByName(
            firstErrorField
        )[0] as HTMLElement;
        firstErrorElement.focus();
        await trigger();

        return { data: {}, errors: validationErrors };
    }
};
