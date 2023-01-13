import { useToasts } from 'react-toast-notifications';

const useToast = () => {
  const { addToast } = useToasts();

  const error = (message: string) => {
    addToast(message, { appearance: 'error', autoDismiss: true });
  };

  const success = (message: string) => {
    addToast(message, { appearance: 'success', autoDismiss: true });
  };

  return { error, success, addToast };
};

export default useToast;
