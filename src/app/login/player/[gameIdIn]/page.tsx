'use client';

import { useParams } from 'next/navigation';
import StudentLogin from '../page';

export default function LinkGameID() {
    const { gameIdIn } = useParams<{ gameIdIn?: string }>();

    return (
        <StudentLogin gameIdIn={gameIdIn ?? ''} />
    );
}
