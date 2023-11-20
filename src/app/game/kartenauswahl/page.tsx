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
import WaitingModal from "@/components/modals/watingModal";
import ErrorModal from "@/components/modals/errorRetryModal";
import PlayCardGrid from "@/components/playCards/playCardGrid";

interface Card {
  id?: string;
  side?: string;
}

export default function CardSelection() {
  const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 0
  );

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
    setSelectedCount(0);
    setNumRedCards(0);
  };


  const getPlayerScore = (game: Game, playerId: string): number => {
    const player = game.players.find((p) => p.id === playerId) || { score: 0 };
    return player.score;
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
      logger.debug(move);

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
        <WaitingModal isOpen={isWaitingForNextTurn} onClose={closeWaitingForNextTurnModal} text={`Du hast ${numRedCards} rote Karten abgegeben. Warten auf nächste Runde`} />
        <WaitingModal isOpen={isWaitingForGameStart} onClose={closeWaitingForGameStartModal} text="Warten auf den Start des Spiels durch den Spielleiter..." />
        <ErrorModal isOpen={errorModalOpened} onClose={() => setErrorModalOpened(false)} onRetry={handleMakeMove} />
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
            <Container fluid p={0}>
              <Grid  justify = "flex-end" p={20}>
                <Text ff={'Instrument Sans, sans-serif'} fz={19} fw={700} p={10} className="lbl-round">Konto: {playerScore} ct</Text>
                <Text ff={'Instrument Sans, sans-serif'} fz={19} fw={700} p={10} className="lbl-round">Runde: {currentTurn} / {numTurns}</Text>
              </Grid>
            </Container>
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
