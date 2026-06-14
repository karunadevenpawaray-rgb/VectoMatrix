import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export const alerts = {
  success: (title: string, text?: string) => {
    Toast.fire({
      icon: 'success',
      title,
      text
    });
  },
  error: (title: string, text?: string) => {
    Toast.fire({
      icon: 'error',
      title,
      text
    });
  },
  info: (title: string, text?: string) => {
    Toast.fire({
      icon: 'info',
      title,
      text
    });
  },
  warning: (title: string, text?: string) => {
    Toast.fire({
      icon: 'warning',
      title,
      text
    });
  },
  loading: (title: string) => {
    MySwal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },
  closeLoading: () => {
    MySwal.close();
  }
};
