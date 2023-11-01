'use client';

import React, { useEffect, useState } from 'react';
import { Button, Center, Container, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import PlayCard from '../../../components/playCards/playCard';
import { logger } from '@/utils/logger';

export default function CardSelection() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [numRedCards, setNumRedCards] = useState(0);
  const [opened, { open }] = useDisclosure();

  const handleInputChangeCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const side = target.getAttribute('data-side');

    if (isChecked && selectedCount >= 2) {
      logger.debug('Player tried to select more than 2 cards.');
      alert('Please select only 2 cards.');
      target.checked = false;
      return;
    }

    setSelectedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));

    setNumRedCards((prevCount) => {
      if (isChecked && side === 'left') {
        logger.debug('Red card counter for this move increased by 1.');
        return prevCount + 1;
      }
      if (!isChecked && side === 'left') {
        logger.debug('Red card counter for this move decreased by 1.');
        return prevCount - 1;
      }
      return prevCount;
    });
  };

  const handleSubmit = () => {
    open();
  };

  const fetchCurrentRound = async () => {
    try {
      setCurrentRound(1); // Simulated data fetching
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchCurrentRound();
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={open} centered withCloseButton={false}>
        <Stack align="center" justify="center">
          <Text
            style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}
            p={40}
            className="lbl-round"
            size="18"
          >
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
          <Text
            style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 700 }}
            p={40}
            className="lbl-round"
            size="19"
          >
            Runde: {currentRound}
          </Text>
        </Center>
        <Carousel slideGap="xl" dragFree>
          {[
            { id: '1', side: 'left' },
            { id: '2', side: 'left' },
            { id: '3', side: 'right' },
            { id: '4', side: 'right' },
          ].map((card) => (
            <PlayCard
              key={card.id}
              id={card.id}
              onChange={handleInputChangeCard}
              side={card.side}
            />
          ))}
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
