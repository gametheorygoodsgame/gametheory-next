import { notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';

export const error = ({ title, message }: { title?: string; message?: string }) => {
  notifications.update({
    id: 'load-data',
    color: 'red',
    title: title ? `Upps, ${title}.😵‍💫` : 'Upps😵‍💫',
    message: message || 'Ein Fehler ist aufgetreten!',
    icon: <IconExclamationCircle size="1rem" />,
    autoClose: 3000
  });
};

export const success = ({ title, message }: { title?: string; message?: string }) => {
  notifications.update({
    id: 'load-data',
    color: 'teal',
    title: title ? `Erfolg, ${title}!` : 'Erfolg!',
    message: message || 'Operation erfolgreich!',
    icon: <IconCheck size="1rem" />,
    autoClose: 3000
  });
};

export const pending = ({ title, message }: { title?: string; message?: string }) => {
  notifications.show({
    id: 'load-data',
    color: 'brand.0',
    loading: true,
    title: title ? `${title} läuft...` : 'Läuft...',
    message: message || 'Du kannst das noch nicht schließen.',
    autoClose: false,
    withCloseButton: false,
  });
};
