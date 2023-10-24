"use client"
// Import necessary libraries
import { CacheProvider } from "@emotion/react";
import {createTheme, MantineProvider, MantineTheme} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { useServerInsertedHTML } from "next/navigation";
import React from 'react';
import {useEmotionCache} from "@mantine/styles";

// Define the RootStyleRegistry component
export default function RootStyleRegistry({children}: {children: React.ReactNode;}) {
    // Get the Emotion cache
    const cache = useEmotionCache();
    cache.compat = true;

    // Use server-inserted HTML to insert HTML styles
    useServerInsertedHTML(() => (
        <style
            data-emotion={
                `${cache.key} ${Object.keys(cache.inserted).join(" ")}`
            }
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(" "),
            }}
        />
    ));

    const theme = createTheme({
        colors: {
            brand: ["#0dcd83", "#0e8e95", "#1195a7", "#1a839a", "#216980", "#265980", "#3a4d74", "#334d80", "#002060", "#F26C4F"]
        },
        components: {
            Button: {
                // Subscribe to theme and component params
                styles: (theme: MantineTheme) => ({
                    root: {
                        backgroundColor: theme.colors.brand[8]
                    }
                })
            }
        },
        primaryColor: 'brand',
    });

    // Embed child components with CacheProvider and MantineProvider
    return (
        <CacheProvider value={cache}>
            <MantineProvider theme={theme}>
                <Notifications />
                {children}
            </MantineProvider>
        </CacheProvider>
    );
}
