// Importieren der Funktion redirect aus dem Modul next/navigation
import { redirect } from 'next/navigation';
import { logger } from '@/utils/logger';

// Definieren der Komponente Home
export default function Home() {
  logger.info('Redirecting user to "/login/player".');
  // Aufrufen der Funktion redirect mit dem Ziel '/login/student'
  redirect('/login/player');
}
