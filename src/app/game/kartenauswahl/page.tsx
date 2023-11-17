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
import {Game, GameApi, GamePlayerMoveApi, Move} from '@gametheorygoodsgame/gametheory-openapi/api';
import PlayCard from '../../../components/playCards/playCard';
import { logger } from '@/utils/logger';
import { getMoveNumRedCardEnumValue } from '@/utils/helpers';

interface Card {
  id?: string;
  side?: string;
}

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
  const [numTurns, setNumTurns] = useState(0);
  const [numRedCards, setNumRedCards] = useState(0);
  const [isWaitingForNextTurn, { open: openWaitingForNextTurnModal, close: closeWaitingForNextTurnModal }] = useDisclosure(false);
  const [errorModalOpened, setErrorModalOpened] = useState(false);
  const [isWaitingForGameStart, { open: openWaitingForGameStartModal, close: closeWaitingForGameStartModal }] = useDisclosure(true);
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [redCardHandValue, setRedCardHandValue] = useState(0);

  const gameApi = new GameApi();
  const gamePlayerMoveApi = new GamePlayerMoveApi();
  const router = useRouter();

  const handleInputChangeCard = (event: React.ChangeEvent<HTMLInputElement>, side: string) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const cardId = target.getAttribute('value');

    if (!cardId) {
      // handle the case when id is null
      return;
    }

    setSelectedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));

    setNumRedCards((prevCount) =>
        side === 'left' ? isChecked ? prevCount + 1 : prevCount - 1 : prevCount
    );
  };

  const resetSelection = () => {
    // Using the functional form of state update to ensure correct order of updates
    setSelectedCount((prevCount) => {
      if (prevCount !== 0) {
        return 0;
      }
      return prevCount;
    });

    setNumRedCards((prevCount) => {
      if (prevCount !== 0) {
        return 0;
      }
      return prevCount;
    });
  };

  function getPlayerScore(game: Game, playerId: string): number {
    const player = game.players.find((p) => p.id === playerId);

    if (player) {
      return player.score;
    }

    return 0;
  }

  useEffect(() => {
    const playCardIds = ['1', '2', '3', '4'];
    playCardIds.forEach((cardId) => {
      const playCardElement = document.getElementById(`playCard-${cardId}`) as HTMLInputElement;
      if (playCardElement) {
        playCardElement.checked = false;
      }
    });
  }, [currentTurn]);

  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };



  const handleMakeMove = async () => {
    try {
      if (!gameId || !playerId) {
        throw new Error();
      }

      const move: Move = {
        numTurn: currentTurn,
        numRedCards: getMoveNumRedCardEnumValue(numRedCards),
      };
      logger.warn(move);

      const response = await gamePlayerMoveApi.createMoveForPlayerInGame(gameId, playerId, move);

      if (response.status !== 200) {
        setErrorModalOpened(true);
      } else {
        setErrorModalOpened(false);
      }

      await checkGameStatus();
      openWaitingForNextTurnModal();
    } catch (error) {
      setErrorModalOpened(true);
    }
  };

  const checkGameStatus = async () => {
    try {
      const response = await gameApi.getGameById(gameId);

      if (response.status === 200 && response.data) {
        const newCurrentTurn = response.data.currentTurn;
        setNumTurns(response.data.numTurns);
        setPlayerScore(getPlayerScore(response.data, playerId));
        setRedCardHandValue(response.data.cardHandValue[currentTurn]);

        if (newCurrentTurn === 0) {
          openWaitingForGameStartModal();
          closeWaitingForNextTurnModal();
        } else {
          closeWaitingForGameStartModal();
        }

        if (newCurrentTurn !== currentTurn) {
          setCurrentTurn(newCurrentTurn);
          resetSelection();
          closeWaitingForNextTurnModal();
        }
      }
    } catch (error) {
      setErrorModalOpened(true);
    }
  };

  useEffect(() => {
    setGameId(getCookie('gameID') || '');
    setPlayerId(getCookie('playerID') || '');
    checkGameStatus();

    const interval = setInterval(checkGameStatus, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [gameId, currentTurn, openWaitingForGameStartModal, closeWaitingForGameStartModal]);

  return (
      <>
        <Modal opened={isWaitingForNextTurn} onClose={closeWaitingForNextTurnModal} centered withCloseButton={false}>
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
        <Modal opened={isWaitingForGameStart} onClose={closeWaitingForGameStartModal} centered withCloseButton={false}>
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
              <Button onClick={() => router.push('/login/player')}>Zurück zum Login</Button>
              <Button
                  onClick={() => {
                    setErrorModalOpened(false);
                    openWaitingForNextTurnModal();
                    handleMakeMove();
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
                  Runde: {currentTurn} / {numTurns}
                </Text>
              </Center>
              <Center>
                <Text c="#cc4444">
                  Kartenwert: {numRedCards}
                </Text>
              </Center>
              <Center>
                <Text ff="Instrument Sans, sans-serif" fz={19} fw={700} p={40} className="lbl-round">
                  Score: {playerScore}
                </Text>
              </Center>
            </Container>
              <Grid gutter="md">
                {[
                  { id: '1', side: 'left' },
                  { id: '2', side: 'left' },
                  { id: '3', side: 'right' },
                  { id: '4', side: 'right' },
                ].map((card) => (
                    <Grid.Col span={3} key={card.id}>
                      <PlayCard
                          id={card.id}
                          onChange={handleInputChangeCard}
                          side={card.side}
                      />
                    </Grid.Col>
                ))}
              </Grid>
              <Center my="xl">
                <Button
                    disabled={selectedCount !== 2}
                    onClick={() => {
                      openWaitingForNextTurnModal();
                      handleMakeMove();
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
