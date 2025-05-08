'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  Container,
  Flex,
  Group,
  Loader,
  Text,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconPigMoney } from '@tabler/icons-react';
import { IoInformationCircle } from 'react-icons/io5';
import { GiClockwork, GiCardAceHearts, GiCardPlay, GiStack } from 'react-icons/gi';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { Game, GameApi, GamePlayerMoveApi, Move } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';
import { MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi';
import PlayCardGrid from '@/components/playCards/playCardGrid';
import { useInterval } from '@/utils/hooks';
import LoadModal from '@/components/modals/loadModal';
import ButtonModal from '@/components/modals/buttonModal';
import InstructionsModal from '@/components/modals/instructionsModal';
import { getCookie } from '@/utils/getCookie';

/**
 * Component for handling a player's interaction with the game state by selecting cards. Including the effect the card selection of a player has on the game state.
 *
 */
export default function CardSelection() {
  const [loading, setLoading] = useState(true);

  const [selectedCount, setSelectedCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [numTurns, setNumTurns] = useState(0);
  const [numRedCards, setNumRedCards] = useState(0);
  const [potCards, setPotCards] = useState<number[]>([]);
  const [isWaitingForNextTurn, { open: openWaitingForNextTurnModal,
    close: closeWaitingForNextTurnModal }] = useDisclosure(true);
  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [isWaitingForGameStart, { open: openWaitingForGameStartModal,
    close: closeWaitingForGameStartModal }] = useDisclosure(true);
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [redCardHandValue, setRedCardHandValue] = useState(0);
  const [game, setGame] = useState<Game | null>(null);


    const [errorDescription, setErrorDescription] = useState('');

  const [
      isInstructionsModalOpen, {
      open: openInstructionsModal,
      close: closeInstructionsModal },
  ] = useDisclosure();

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

  /**
   * Retrieves the score of a player by parameters currentGameObject and ID of the player.
   * @param {Game} aGame - The game object.
   * @param {string} aPlayerId - The ID of the player.
   * @returns {number} - The score of the player.
   */
  const getPlayerScore = (aGame: Game, aPlayerId: string): number => {
    let player = null;
    if (aGame.players) {
      player = aGame.players.find((p) => p.id === aPlayerId);
    }
    return player ? player.score : 0;
  };

   /**
   * Retrieves the number of moves made by a player. Parameters currentGameObject and PlayerId are needed.
   * @param {Game} aGame - The current game object.
   * @param {string} aPlayerId - The ID of the player.
   * @returns {number} - The number of moves by the player.
   */
  const getPlayerMoveCount = (aGame: Game, aPlayerId: string): number => {
    let player = null;
    if (aGame.players) {
      player = aGame.players.find((p) => p.id === aPlayerId);
    }
    return player ? player.moves.length : 0;
  };

  /**
   * Retrieves the number of red cards from the last card selection.
   * @param {Game} aGame - The game object.
   * @param {string} aPlayerId - The ID of the player.
   * @returns {number} - The number of red cards in the last move.
   */
  const getPlayerRedCards = (aGame: Game, aPlayerId: string): number => {
    let player = null;
    if (aGame.players) {
      player = aGame.players.find((p) => p.id === aPlayerId);
    }
    return player ? player.moves[player.moves.length - 1].numRedCards : 0;
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

    const hasPlayerMovedThisRound = (game: Game | undefined, playerId: string): boolean => {
        if (!game || !game.players) return false;

        const player = game.players.find(p => p.id === playerId);
        if (!player) return false;

        const isInactive = typeof player.inactiveSinceTurn === 'number' && game.currentTurn >= player.inactiveSinceTurn;
        const moveThisTurn = player.moves.find(m => m.numTurn === game.currentTurn);

        return !isInactive && !!moveThisTurn;
    };

    const checkGameStatus = async () => {
        try {
            const response = await gameApi.getGameById(gameId);
            const game: Game = response.data;

            if (response.status === 200 && game) {
                const newCurrentTurn = game.currentTurn;

                // 📦 Setze Spielstatus
                setNumTurns(game.numTurns);
                setPotCards(game.potCards);
                setPlayerScore(getPlayerScore(game, playerId));
                setRedCardHandValue(game.cardHandValue ? game.cardHandValue[newCurrentTurn] : 1);

                // 🧼 Immer beide Modals schließen – nur eines wird im Anschluss geöffnet
                closeWaitingForGameStartModal();
                closeWaitingForNextTurnModal();

                // 🛑 Falls das Spiel beendet ist → Endscreen
                if (game.isFinished === true) {
                    router.push('../../game/endScreen');
                    return;
                }

                // ⏳ Warte auf Spielstart (nur bei Turn 0)
                if (newCurrentTurn === 0) {
                    openWaitingForGameStartModal();
                }

                // 🔄 Setze Turnwechsel
                if (newCurrentTurn !== currentTurn) {
                    setCurrentTurn(newCurrentTurn);
                    resetSelection();
                }

                // ✅ Spieler identifizieren
                const player = Array.isArray(game.players)
                    ? game.players.find(p => p.id === playerId)
                    : undefined;

                // 🚫 Spieler inaktiv?
                const isInactive = typeof player.inactiveSinceTurn === 'number'
                    && newCurrentTurn >= player.inactiveSinceTurn;

                // ✅ Spieler hat bereits Karte abgegeben?
                const move = player.moves.find(m => m?.numTurn === newCurrentTurn);

                if (!isInactive && move && newCurrentTurn !== 0) {
                    setNumRedCards(move.numRedCards);
                    openWaitingForNextTurnModal();
                }
            }
        } catch (error) {
            logger.error(error);
            const message =
                (error as any)?.response?.data?.message || error.message || 'Unbekannter Fehler';
            setErrorDescription(message);
            openErrorModal();
        } finally {
            setLoading(false);
        }
    };



    /**
   * Makes a move for the current player.
   * Updates the game state through the API.
   */
    const handleMakeMove = async () => {
        try {
            if (!gameId || !playerId) return;

            const move = {
                numRedCards: numRedCards as MoveNumRedCardsEnum,
                numTurn: currentTurn,
            };

            const moveApi = new GamePlayerMoveApi(); // erzeugt die API-Instanz
            const response = await moveApi.createMoveForPlayerInGame(gameId, playerId, move);

            if (response.status === 200) {
                closeErrorModal();
                await checkGameStatus(); // öffnet Modal nur, wenn Spieler aktiv ist
            } else {
                openErrorModal();
            }
        } catch (error: unknown) {
            const err = error as Error;
            logger.error(err);
            const message = (err as any)?.response?.data?.message || err.message || 'Unbekannter Fehler';
            setErrorDescription(message);
            openErrorModal();
        }
    };

    /**
   * Fetches game data periodically using a 10-second interval.
   */
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
            leftButton={{
                  text: 'Zurück zum Login',
                  callback: () => router.push('/login/player'),
              }}
            {...(!errorDescription?.includes('inaktiv') && {
                  rightButton: {
                      text: 'Erneut senden',
                      callback: () => {
                          closeErrorModal();
                          handleMakeMove();
                      },
                  },
              })}
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
            <Tooltip label="Gespielte Runden" events={{ hover: true, focus: true, touch: true }}>
              <Flex align={Center}>
                <GiClockwork size={50} color="#334d80" />
                <Text size="xl" c="#334d80" fw={900} ml={10}>  {currentTurn} / {numTurns} </Text>
              </Flex>
            </Tooltip>
            <Tooltip label="Aktueller roter Kartenwert" events={{ hover: true, focus: true, touch: true }}>
              <Flex>
                <GiCardAceHearts color="#cc4444" size={45} />
              <Text size="xl" c="#334d80" fw={900} ta={Center}> -Wert:  {redCardHandValue}</Text>
              </Flex>

            </Tooltip>
            <Tooltip label="Kontostand" events={{ hover: true, focus: true, touch: true }}>
              <Flex align={Center}>
            <Text size="xl" c="#334d80" fw={900} ml={10}> {playerScore} ct </Text>
            <IconPigMoney size={50} color="#334d80" />
              </Flex>
            </Tooltip>
         </Flex>
          {currentTurn > 0 && (
            <Center>
              <Tooltip label="Anzahl roter Karten im Pot der letzten Runde" events={{ hover: true, focus: true, touch: true }}>
                <Flex align={Center}>
                <GiStack size={45} color="#334d80" />
                <GiCardPlay size={45} color="#334d80" />
                <Text size="xl" c="#334d80" w="100%" fw={900} ml={10}> - Pot letzter Runde: {potCards[currentTurn - 1]}
                </Text>
                </Flex>
              </Tooltip>

            </Center>
          )}
          <PlayCardGrid onChange={handleInputChangeCard} />
          <Center my="xl">
            <Button
              disabled={selectedCount !== 2}
              onClick={() => {
                  handleMakeMove();
                }}
            >
              {selectedCount !== 2 ? 'Bitte zwei Karten auswählen' : 'Auswahl abgeben'}
            </Button>
          </Center>
        </Container>
        <Container style={{ position: 'fixed', bottom: 0, left: 0 }}>
                <ActionIcon onClick={openInstructionsModal}>
                  <IoInformationCircle size={45} />
                </ActionIcon>
        </Container>

        <InstructionsModal
          opened={isInstructionsModalOpen}
          onClose={closeInstructionsModal}
          rightButton={{ callback: closeInstructionsModal, text: 'Schließen' }}
        />
      </>
  );
}
