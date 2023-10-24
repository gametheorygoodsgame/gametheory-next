"use client"

import React, { useState, useEffect } from 'react';
import DataCollection from "./datacollection";
import { Button, Container, Center, ScrollArea, Stack, Text, NumberInput, Grid, Group, Modal } from '@mantine/core';
import { useViewportSize, useDisclosure } from '@mantine/hooks';

export default function DozentGame({ params }) {
    const { height, width } = useViewportSize();
    const gameId = params.dozentgame;
    const [redCardValue, setRedCardValue] = useState<number | string>(1)
    const [opened, { open, close }] = useDisclosure(false);
    const [currentRound, setCurrentRound] = useState(0)

    const handleNextRound = async () => {
        await fetch('/api/rounds', {
            method: 'POST',
            body: JSON.stringify({gameID: gameId, redCardValue: redCardValue}),
            headers: { 'Content-Type': 'application/json' }
        });
        fetchCurrentRound();
        close();
    };

    async function fetchCurrentRound() {
        try {
            const response = await fetch(`../api/rounds?gameID=${gameId}`);
            const data = await response.json();
            setCurrentRound(data.currentRound);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    useEffect(() => {
        fetchCurrentRound();
    }, [gameId]);

    useEffect(() => {
        const interval = setInterval(fetchCurrentRound, 10000); // Fetch current round every 10 seconds

        return () => {
            clearInterval(interval);
        };
    }, [gameId]);

    return (
        <>
            <Modal opened={opened} onClose={close} title={currentRound === 0 ? "Spiel Starten" : "Nächste Runde"}>
                <Stack gap="xl">
                    <NumberInput
                        type="text"
                        label="Roter Kartenwert"
                        value={redCardValue}
                        onChange={setRedCardValue} />

                    <Group align="right">
                        {currentRound === 0 ? (
                            <Button bg="brand.0" onClick={handleNextRound}>Spiel Starten</Button>
                        ) : (
                            <Button onClick={handleNextRound}>Nächste Runde</Button>
                        )}
                    </Group>
                </Stack>
            </Modal>
            <Container p={60} fluid h={height - 63}>
                <Grid grow justify="space-around" h={height - 200}>
                    <Grid.Col span={1}>
                        <ScrollArea h={height - 220}>
                            <DataCollection gameId={gameId} />
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Stack justify="space-between" h={height - 200}>
                            <Group align="right" px={90}>
                                <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }} >
                                    Runde: {currentRound}
                                </Text>
                            </Group>
                            <Center >Rundenauswertung</Center>
                            <Group align="right" gap="xl">
                                <Button variant="outline" color= "red" bg="white" >Spielabbruch</Button>
                                {currentRound === 0 ? (
                                    <Button bg="brand.0" onClick={open}>Spiel Starten</Button>
                                ) : (
                                    <Button onClick={open}>Nächste Runde</Button>
                                )}
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}
