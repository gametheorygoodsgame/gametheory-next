'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import DozentMenueLeiste from './DozentMenueLeiste';
import firebase from '../firebaseApp';

export default function DozentenLayout({ children }: { children: any }) {
    const auth = getAuth(firebase);
    const [user, loading, error] = useAuthState(auth);

    if (user) {
        return (
            <>
                <DozentMenueLeiste />
                <main>{children}</main>
            </>
        );
    }
        if (loading) {
            return <p>Loading...</p>;
        }
            redirect('/');
}
