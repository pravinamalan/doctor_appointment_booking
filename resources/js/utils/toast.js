import {
    toast
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'success') => {
    const options = {
        position: 'top-right',
        autoClose: 3000,
        // style: {
        //     borderLeft: '3px solid #4b2405',
        //     paddingLeft: '10px'
        // },
        hideProgressBar: false
    };

    switch (type) {
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'warning':
            toast.warning(message, options);
            break;
        default:
            toast(message, options);
    }
};
