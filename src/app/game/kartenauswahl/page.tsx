"use client"

import React, { useState, useEffect } from 'react';
import Card from './Card';
import {Modal, Button, Container, Center, Text, Loader, Stack, Group, CheckboxProps} from '@mantine/core';
//import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';

export default function CardSelection() {
    const [selectedCount, setSelectedCount] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [numRedCards, setNumRedCards] = useState(0);
    //const [opened, { open, close }] = useDisclosure(false);

    const handleInputChangeCard = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked;
        const side = target.getAttribute('data-side');

        if (isChecked && selectedCount >= 2) {
            alert('Please select only 2 cards.');
            target.checked = false;
            return;
        }

        setSelectedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));

        setNumRedCards((prevCount) => {
            if (isChecked && side === 'left') {
                return prevCount + 1;
            } else if (!isChecked && side === 'left') {
                return prevCount - 1;
            }
            return prevCount;
        });
    };

    const handleSubmit = () => {
        // Handle form submission
        open();
    };

    /*useEffect(() => {
        // Fetch current round data
        fetchCurrentRound();
    }, []);*/

    const fetchCurrentRound = async () => {
        try {
            // Simulate fetching current round data
            // Replace this with your actual data fetching logic
            setCurrentRound(1); // Example value
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    return (
        <>
            <Modal opened={false} onClose={open} centered withCloseButton={false}>
                <Stack align="center" justify="center">
                    <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}
                          p={40}
                          className="lbl-round"
                          size={"18"}>
                        <Group>
                            Du hast <Text c="#cc4444">{numRedCards}</Text> rote Karten abgegeben.
                        </Group>
                        <Text>Warten auf nächste Runde</Text>
                    </Text>
                    <Loader variant="dots" />
                </Stack>
            </Modal>
            <Container fluid p={0}>
                <Center>
                    <Text style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}
                          p={40}
                          className="lbl-round"
                          size={"19"}>
                        Runde: {currentRound}
                    </Text>
                </Center>
                <Carousel slideGap="xl" dragFree>
                    <Card id="1" onChange={handleInputChangeCard} side="left" />
                    <Card id="2" onChange={handleInputChangeCard} side="left" />
                    <Card id="3" onChange={handleInputChangeCard} side="right" />
                    <Card id="4" onChange={handleInputChangeCard} side="right" />
                </Carousel>
                <Center my="xl">
                    <Button disabled={selectedCount !== 2} onClick={handleSubmit}>
                        {selectedCount !== 2 ? 'Bitte zwei Karten auswählen' : 'Auswahl bestätigen'}
                    </Button>
                </Center>
            </Container>
        </>
    );
}