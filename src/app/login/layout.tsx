'use client';

import React from 'react';
import { AppShell } from '@mantine/core';

export default function LoginLayout({ children }: { children: any }) {
    return (
        <>
            <AppShell.Header bg="brand.7" />
            <AppShell.Main bg="brand.7">
                {children}
            </AppShell.Main>
        </>
    );
}
