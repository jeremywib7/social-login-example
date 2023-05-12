// import React from "react";
// import {GoogleReCaptcha} from "react-google-recaptcha-v3";
// import axios from "axios";
// import {useSession} from "next-auth/react";
//
// const RecaptchaInterceptor = (token: string) => {
//     axios.interceptors.request.use(config => {
//         config.headers['recaptcha'] = token;
//         console.log(config.headers['recaptcha']);
//         return config;
//     });
// };
//
// const RecaptchaComponent = () => {
//     const {data: session} = useSession();
//
//     const onVerify = (token: string) => {
//         console.log(token);
//         RecaptchaInterceptor(token);
//     };
//
//     return (
//         <GoogleReCaptcha onVerify={onVerify}/>
//     );
// }
//
// export default RecaptchaComponent;
