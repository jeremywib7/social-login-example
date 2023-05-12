import React, {createContext, useRef, useCallback} from 'react';
import {Toast} from 'primereact/toast';

export enum SeverityEnum {
    SUCCESS = 'success',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

interface ToastContextProps {
    showToast: (summary: string, detail: string, severity: SeverityEnum, life?: number) => void;
}

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastContext = createContext<ToastContextProps>({
    showToast: () => {
    },
});

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
    const toastRef = useRef<Toast>(null);

    const show = useCallback((summary: string, detail: string, severity: SeverityEnum, life?: number) => {
        toastRef.current?.show({
            summary: summary,
            detail: detail,
            severity: severity,
            life: life ? life : 3000
        });
    }, []);

    return (
        <ToastContext.Provider value={{showToast: show}}>
            {children}
            <Toast ref={toastRef}/>
        </ToastContext.Provider>
    );
};
