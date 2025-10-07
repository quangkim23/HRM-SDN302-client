import { Bounce, toast } from 'react-toastify';

const toastifyUtils = (type: string, message: string) => {
  switch (type) {
    case 'info':
      return toast.info(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      });
    case 'success':
      toast.dismiss();
      return toast.success(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
        // style: {
        //     borderRadius: '8px',
        //     border: '1px solid var(--Green-Caribbean-Green, #00D9AD)',
        //     background: 'var(--Green-Feta, #defce0)',
        //     maxWidth: '448px',
        //     width: '100%',
        //     top: '102px',
        //     color: '#00D9AD'
        // }
      });
    case 'warning':
      toast.dismiss();
      return toast.warning(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
        // style: {
        //     borderRadius: '8px',
        //     border: '1px solid var(--Yellow-Barley-White, #FED51E)',
        //     background: '#FFFAE9',
        //     fontWeight: 400,
        //     maxWidth: '448px',
        //     width: '100%',
        //     top: '102px',
        //     color: '#FEB21E'
        // }
      });
    case 'error':
      toast.dismiss();
      return toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,

        theme: 'light',
        transition: Bounce
        // style: {
        //     borderRadius: '8px',
        //     border: '1px solid var(--Red-Coral-Red, #FF2D46)',
        //     background: 'var(--Red-Fair-Pink, #feebed)',
        //     maxWidth: '448px',
        //     width: '100%',
        //     top: '102px',
        //     color: '#FF2D46'
        // }
      });
    default:
      // Xử lý mặc định nếu type không khớp với bất kỳ giá trị nào trên
      break;
  }
};

export default toastifyUtils;
