'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { GameApi, GamePlayerMoveApi, Move } from '@eikermannlfh/gametheoryapi/api';
import PlayCard from '../../../components/playCards/playCard';
import { logger } from '@/utils/logger';
import { getMoveNumRedCardEnumValue } from '@/utils/helpers';

export default function CardSelection() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedCount, setSelectedCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [numRedCards, setNumRedCards] = useState(0);
  const [opened, { open }] = useDisclosure();
  const [errorModalOpened, setErrorModalOpened] = useState(false);
  const [waitingForGameStart, { open: startGame, close: closeGame }] = useDisclosure(true);

  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');

  const gameApi = new GameApi();
  const gamePlayerMoveApi = new GamePlayerMoveApi();
  const router = useRouter();

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

  const resetSelection = () => {
    setSelectedCount(0);
    setNumRedCards(0);
  };

  function getCookie(name: string) {
    // Cookies-String in einzelne Cookies aufteilen
    const cookies = document.cookie.split(';');

    // Nach dem gewünschten Cookie suchen und den Wert zurückgeben
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }

    // Wenn der Cookie nicht gefunden wurde, null zurückgeben
    return null;
  }

  async function waitForNextTurn() {
    try {
      const response = await gameApi.getGameById(gameId);
      if (response.status === 200 && response.data && response.data.currentTurn) {
        setCurrentTurn(response.data.currentTurn);
        resetSelection();
      }
    } catch (error) {
      setErrorModalOpened(true);
    }
  }

  const handleMakeMove = async () => {
    try {
      if (!gameId || !playerId) {
        throw new Error();
      }

      const move: Move = {
        numTurn: currentTurn,
        numRedCards: getMoveNumRedCardEnumValue(numRedCards),
      };

      const response = await gamePlayerMoveApi.createMoveForPlayerInGame(gameId, playerId, move);

      // Überprüfen, ob die Netzwerkantwort OK ist
      if (response.status !== 200) {
        setErrorModalOpened(true);
      } else {
        setErrorModalOpened(false);
      }
      // Antwortdaten verarbeiten, falls erforderlich
      await waitForNextTurn();
      // eslint-disable-next-line no-restricted-globals
      close();
    } catch (error) {
      // Fehler behandeln, falls vorhanden
      setErrorModalOpened(true);
    }
  };

  const fetchCurrentTurn = async () => {
    try {
      const response = await gameApi.getGameById(gameId);
      if (response.status === 200 && response.data && response.data.currentTurn) {
        setCurrentTurn(response.data.currentTurn);
      }
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    setGameId(getCookie('gameID') || '');
    setPlayerId(getCookie('playerID') || '');
    const checkGameStarted = async () => {
      try {
        await waitForNextTurn();
        await fetchCurrentTurn();
        logger.info('Current round:', currentTurn);
        closeGame();
      } catch (error) {
        logger.error('Error checking game status:', error);
        setErrorModalOpened(true);
      }
    };
    checkGameStarted();
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={open} centered withCloseButton={false}>
        <Stack align="center" justify="center">
          <Text ff="Instrument Sans, sans-serif" fz={18} fw={700} p={40} className="lbl-round">
            <Group>
              {' '}
              Du hast <Text c="#cc4444">{numRedCards}</Text> rote Karten abgegeben.{' '}
            </Group>
            <Text>Warten auf nächste Runde</Text>
          </Text>
          <Loader variant="dots" />
        </Stack>
      </Modal>
      <Modal opened={waitingForGameStart} onClose={startGame} centered withCloseButton={false}>
        <Stack align="center">
          <Text ff="Instrument Sans, sans-serif" fz={18} fw={700} p={40} className="lbl-round">
            Warten auf den Start des Spiels durch den Spielleiter...
          </Text>
          <Loader variant="dots" />
        </Stack>
      </Modal>
      <Modal opened={errorModalOpened} onClose={() => setErrorModalOpened(false)} title="Fehler">
        <Stack gap="xl" align="center">
          <Text>Spiel wurde nicht gefunden!</Text>
          <Group>
            <Button onClick={() => router.push('/login/student')}>Zurück zum Login</Button>
            <Button
              onClick={() => {
                setErrorModalOpened(false);
                handleMakeMove();
                open(); // Erneut die Runde an den Server senden
              }}
            >
              Erneut senden
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Container
        fluid
        p={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Flex align="center" direction="column" justify="center">
          <Container ta="center" w="100%">
            <Center>
              <Text ff="Instrument Sans, sans-serif" fz={19} fw={700} p={40} className="lbl-round">
                Runde: {currentTurn}
              </Text>
            </Center>
          </Container>
          <Flex direction="row" justify="center" wrap="wrap">
            <Grid gutter="md">
              {[
                { id: '1', side: 'left' },
                { id: '2', side: 'left' },
                { id: '3', side: 'right' },
                { id: '4', side: 'right' },
              ].map((card) => (
                <Grid.Col span={3} key={card.id}>
                  <PlayCard id={card.id} onChange={handleInputChangeCard} side={card.side} />
                </Grid.Col>
              ))}
            </Grid>
          </Flex>
          <Center my="xl">
            <Button
              disabled={selectedCount !== 2}
              onClick={() => {
                handleMakeMove();
                open();
              }}
            >
              {selectedCount !== 2 ? 'Bitte zwei Karten auswählen' : 'Auswahl bestätigen'}
            </Button>
          </Center>
        </Flex>
      </Container>
    </>
  );
}
