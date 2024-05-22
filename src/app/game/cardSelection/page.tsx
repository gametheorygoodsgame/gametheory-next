'use client';

import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Center,
  Container, 
  Grid,
  Flex,
  Group,
  Loader,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { Game, GameApi, GamePlayerMoveApi, Move } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';
import { getMoveNumRedCardEnumValue } from '@/utils/helpers';
import PlayCardGrid from '@/components/playCards/playCardGrid';
import { useInterval } from '@/utils/hooks';
import LoadModal from '@/components/modals/loadModal';
import ButtonModal from '@/components/modals/buttonModal';
import { getCookie } from '@/utils/getCookie';

export default function CardSelection() {
  const [loading, setLoading] = useState(true);

  const [selectedCount, setSelectedCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [numTurns, setNumTurns] = useState(0);
  const [numRedCards, setNumRedCards] = useState(0);
  const [potCards, setPotCards] = useState<number[]>([]);
  const [isWaitingForNextTurn, { open: openWaitingForNextTurnModal,
    close: closeWaitingForNextTurnModal }] = useDisclosure(false);
  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [isWaitingForGameStart, { open: openWaitingForGameStartModal,
    close: closeWaitingForGameStartModal }] = useDisclosure(true);
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [redCardHandValue, setRedCardHandValue] = useState(0);

  const [errorDescription, setErrorDescription] = useState('');

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
    setSelectedCount(0);
    setNumRedCards(0);
  };

  const getPlayerScore = (aGame: Game, aPlayerId: string): number => {
    let player = null;
    if (aGame.players) {
      player = aGame.players.find((p) => p.id === aPlayerId);
    }
    return player ? player.score : 0;
  };

  useEffect(() => {
    const playCardIds = ['1', '2', '3', '4'];
    playCardIds.forEach((cardId) => {
      const playCardElement = document.getElementById(`playCard-${cardId}`) as HTMLInputElement;
      if (playCardElement) {
        playCardElement.checked = false;
      }
    });
  }, [currentTurn]);

  const checkGameStatus = async () => {
    try {
      const response = await gameApi.getGameById(gameId);
      const game: Game = response.data;

      if (response.status === 200 && game) {
        const newCurrentTurn = game.currentTurn;
        setNumTurns(game.numTurns);
        setPotCards(game.potCards);
        setPlayerScore(getPlayerScore(game, playerId));
        setRedCardHandValue(game.cardHandValue ? game.cardHandValue[currentTurn] : 1);

        if (game.isFinished === true) {
          router.push('../../game/endScreen');
        }

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
      logger.error(error);
      setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
      openErrorModal();
    } finally {
      setLoading(false);
    }
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

      logger.debug(move);

      const response = await gamePlayerMoveApi.createMoveForPlayerInGame(gameId, playerId, move);

      if (response.status !== 200) {
        openErrorModal();
      } else {
        closeErrorModal();
      }

      await checkGameStatus();
      openWaitingForNextTurnModal();
    } catch (error) {
      logger.error(error);
      setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
      openErrorModal();
    }
  };

  function fetchData() {
    if (!gameId || gameId === '') {
      setGameId(getCookie('gameID') || '');
    }
    if (!playerId || playerId === '') {
      setPlayerId(getCookie('playerID') || '');
    }
    checkGameStatus();
  }

  useInterval(fetchData, 10000);

  useEffect(() => {
    setGameId(getCookie('gameID') || '');
    setPlayerId(getCookie('playerID') || '');
    checkGameStatus();

    const interval = setInterval(checkGameStatus, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [gameId, currentTurn, openWaitingForGameStartModal, closeWaitingForGameStartModal]);

  if (loading) {
    return (
        <Center>
          <Loader />
        </Center>
    );
  }

  return (
      <>
        <LoadModal opened={isWaitingForNextTurn} onClose={closeWaitingForNextTurnModal}>
            <Group> Du hast <Text c="#cc4444">{numRedCards}</Text> rote Karten abgegeben. </Group>
            <Text>Warten auf nächste Runde</Text>
        </LoadModal>
        <LoadModal opened={isWaitingForGameStart} onClose={closeWaitingForGameStartModal}>
            <Text>
              Warten auf den Start des Spiels durch den Spielleiter...
            </Text>
        </LoadModal>
        <ButtonModal
          opened={hasError}
          onClose={closeErrorModal}
          title="Fehler"
          leftButton={{ callback: () => router.push('/login/player'), text: 'Zurück zum Login' }}
          rightButton={{ callback: () => { closeErrorModal(); handleMakeMove(); }, text: 'Erneut senden' }}
        >
            <Text>{errorDescription}</Text>
        </ButtonModal>
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
         <Flex
            mih={50}
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            w="100%"
          >
            <Text size="xl" c={'#334d80'} fw ={900} >Runde: {currentTurn} / {numTurns}</Text>
            <Badge size="xl" color="#334d80">Roter Kartenwert der aktuellen Runde: {redCardHandValue}</Badge>
            <Text size="xl" c={"#334d80"} fw={900} >Konto: {playerScore} ct</Text>
          </Flex>
          {currentTurn > 0 && (
            <Center>
              <Badge size="xl" color="#334d80" w="100%">
                Anzahl der roten Karten im Pot der letzten Runde: {potCards[currentTurn - 1]}
              </Badge>
            </Center>
          )}
          <PlayCardGrid onChange={handleInputChangeCard} />
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
        </Container>
      </>
  );
}
