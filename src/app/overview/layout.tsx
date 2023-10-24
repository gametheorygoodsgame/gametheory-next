"use client"

import React from 'react';
import DozentMenueLeiste from './DozentMenueLeiste';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import firebase from '../firebaseApp';

export default function DozentenLayout({ children }) {
    const auth = getAuth(firebase);
    const [user, loading, error] = useAuthState(auth);

    if (user) {
        return (
            <>
                <DozentMenueLeiste />
                <main>{children}</main>
            </>
        );
    } else {
        if (loading) {
            return <p>Loading...</p>;
        } else {
            redirect('/');
        }
    }
}