'use client';

import StudentLogin from '../page';
import {useParams} from "next/navigation";

export default function LinkGameID() {
    const { gameIdIn } = useParams<{ gameIdIn?: string }>();

    return (
        <StudentLogin gameIdIn={gameIdIn ?? ''} />
    );
}
