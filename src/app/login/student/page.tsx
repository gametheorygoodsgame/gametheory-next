"use client"

import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Container, Center, Paper, Stack, TextInput, Text, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface StudentLoginProps {
    gameIdIn: string
}

export default function StudentLogin(props: StudentLoginProps) {
    const { gameIdIn } = props;
    const [userName, setUserName] = useState('');
    const [gameId, setGameId] = useState(gameIdIn ? gameIdIn : '');
    //const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        /*if (userName === '' || gameId === '') {
            notifications.show({
                message: 'Bitte einen Wert eingeben!',
                color: "red",
                title: 'Upps😵‍💫',
                icon: <IconExclamationCircle size="1rem" />
            });
            return;
        }

        const response = await fetch('/api/playerList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, gameID: gameId }),
        });

        if (response.status === 404) {
            const error = await response.json();
            notifications.show({
                message: error.message,
                color: "red",
                title: 'Upps😵',
                icon: <IconExclamationCircle size="1rem" />
            });
        } else if (response.status === 200) {
            const playerID = await response.json();
            document.cookie = `playerID=${playerID}`;
            document.cookie = `gameID=${gameId}`;
            await router.push('../../game/kartenauswahl');
        }

        if (response.status !== 200) {
            const error = await response.json();
            notifications.show({
                message: error.message,
                color: "red",
                title: 'Upps😵',
                icon: <IconExclamationCircle size="1rem" />
            });
        }

        setUserName('');
        setGameId('');*/
    };

    return (
        <Center bg="brand.7" style={{ height: '100%' }}>
            <Container size={800} my={40}>
                <Title
                    c="white"
                    ta="center"
                    style={{ fontFamily: 'Castellar, sans-serif', fontWeight: 800 }}
                >
                    Game Theory
                </Title>
                <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
                    <Stack gap="sm">
                        <TextInput
                            label="Benutzername"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value.replace(/\s/g, ''))}
                        />
                        <TextInput
                            label="Spiel-ID"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value.replace(/\s/g, ''))}
                        />
                        <Button onClick={handleSubmit} fullWidth my="xl">
                            Login
                        </Button>
                    </Stack>
                    <Link href="dozent" style={{ textDecoration: 'none' }}>
                        <Container fz={14} c={'darkgray'} w={100} mr={0} p={0} ta={'right'}>
                            <Text >Dozenten-Login</Text>
                            <Center><i className="fa fa-chevron-right"></i></Center>
                        </Container>
                    </Link>
                </Paper>
            </Container>
        </Center>
    );
}