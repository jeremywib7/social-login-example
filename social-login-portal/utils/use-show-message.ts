import {useRef} from "react";
import {Toast} from "primereact/toast";

enum SeverityEnum {
    SUCCESS = 'success',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

const useShowMessage = () => {
    const msg = useRef<Toast | null>(null);
    const showMessage = (message: string, severity: SeverityEnum) => {
        msg.current?.replace({
            severity: severity,
            detail: message,
        });
    };
    return {msg, showMessage};
}

export default useShowMessage;
