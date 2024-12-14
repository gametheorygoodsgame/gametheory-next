'use client';

import { useParams } from 'next/navigation';
import StudentLogin from '../page';

/**
 * Component for linking a game ID to the student login page.
 *
 * Extracts the `gameIdIn` parameter from the URL and passes it to the `StudentLogin` component so that the gameId Login field is already filled.
 *
 * @returns {JSX.Element} The rendered component that links a game ID to the student login page.
 */
export default function LinkGameID() {
    const { gameIdIn } = useParams<{ gameIdIn?: string }>();

    return (
        <StudentLogin gameIdIn={gameIdIn ?? ''} />
    );
}
