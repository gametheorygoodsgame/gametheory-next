// Importieren der Funktion redirect aus dem Modul next/navigation
import { redirect } from 'next/navigation';
import { logger } from '@/utils/logger';

/**
 * A simple component that logs an info message and redirects the user to the "/login/player" route.
 * This component does not render any UI elements; it performs a redirect when executed.
 * 
 * @returns {null} This component doesn't return any JSX, as it is designed to redirect the user.
 */
export default function Home() {
  logger.info('Redirecting user to "/login/player".');
  // redirect to '/login/student'
  redirect('/login/player');
}
