import * as yup from "yup";

const YupConstant = {
    REQUIRED: (fieldName: string) => `${fieldName} is required`,
    EMAIL: (fieldName: string) => `${fieldName} format is not valid`,
};

export const loginSchema = yup.object().shape({
    email: yup.string().required(YupConstant.REQUIRED("Email")),
    password: yup.string().required(YupConstant.REQUIRED("Password")),
});

export const registerSchema = yup.object().shape({
    firstname: yup.string().required(YupConstant.REQUIRED("First name")),
    lastname: yup.string().required(YupConstant.REQUIRED("Last name")),
    email: yup.string()
        .required(YupConstant.REQUIRED("Email"))
        .email(YupConstant.EMAIL("Email")),
    password: yup.string()
        .required(YupConstant.REQUIRED("Password"))
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, ' '),
});

// enum YupConstant {
//     REQUIRED = `${fieldName} is required`,
//     BAR = 'BAR',
//     BAZ = 'BAZ',
// }

// declare module 'yup' {
//     interface StringSchema {
//         required(fieldName: string): StringSchema;
//         fieldEmail(fieldName: string): StringSchema;
//     }
// }
//
// yup.addMethod<yup.StringSchema>(yup.string, 'required', function (fieldName?: string) {
//     return this.required(fieldName + ' is required');
// });
// yup.addMethod<yup.StringSchema>(yup.string, 'fieldEmail', function (fieldName?: string) {
//     return this.email(fieldName + ' format is not valid');
// });
