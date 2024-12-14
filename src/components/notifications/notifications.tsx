import { notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';

/**
 * Displays an error notification with a customizable title and message.
 * The notification has a red color and includes an exclamation icon.
 * It will automatically close after 3 seconds.
 *
 * @param {Object} params - The parameters for the error notification.
 * @param {string} [params.title] - The title of the error notification.
 * @param {string} [params.message] - The message of the error notification.
 *
 */
export const error = ({ title, message }: { title?: string; message?: string }) => {
  notifications.update({
    id: 'load-data',
    color: 'red',
    title: title ? `Upps, ${title}.😵‍💫` : 'Upps😵‍💫',
    message: message || 'Ein Fehler ist aufgetreten!',
    icon: <IconExclamationCircle size="1rem" />,
    autoClose: 3000,
  });
};

/**
 * Displays a success notification with a customizable title and message.
 * The notification has a teal color and includes a checkmark icon.
 * It will automatically close after 3 seconds.
 *
 * @param {Object} params - The parameters for the success notification.
 * @param {string} [params.title] - The title of the success notification.
 * @param {string} [params.message] - The message of the success notification.
 *
 */
export const success = ({ title, message }: { title?: string; message?: string }) => {
  notifications.update({
    id: 'load-data',
    color: 'teal',
    title: title ? `Erfolg, ${title}!` : 'Erfolg!',
    message: message || 'Operation erfolgreich!',
    icon: <IconCheck size="1rem" />,
    autoClose: 3000,
  });
};


/**
 * Displays a pending notification with a customizable title and message.
 * The notification has a brand color, shows a loading spinner, and prevents closing.
 *
 * @param {Object} params - The parameters for the pending notification.
 * @param {string} [params.title] - The title of the pending notification.
 * @param {string} [params.message] - The message of the pending notification.
 *
 */
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
