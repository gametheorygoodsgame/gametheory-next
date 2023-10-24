// Importieren der Funktion redirect aus dem Modul next/navigation
import { redirect } from 'next/navigation';

// Definieren der Komponente Home
export default function Home() {
  // Aufrufen der Funktion redirect mit dem Ziel '/login/student'
  redirect('/login/student');
}
