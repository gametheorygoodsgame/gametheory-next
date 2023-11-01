import { error, pending, success } from '@/components/notifications';

export const missingInput = () => {
  error({ message: 'Bitte geben Sie Ihre Nutzerinformationen ein!' });
};

export const loginFailed = () => {
  error({
    title: 'Upps, Anmeldung fehlgeschlagen. 😕',
    message: 'Bitte überprüfe deine Anmeldeinformationen!',
  });
};

export const loginSuccess = () => {
  success({ message: 'Login erfolgreich!' });
};

export const loginPending = () => {
  pending({ title: 'Versuche Login' });
};
