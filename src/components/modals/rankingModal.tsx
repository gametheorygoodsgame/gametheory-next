import { useEffect, useState } from 'react';
import { Modal, Table, Text, Stack, Title, Badge } from '@mantine/core';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import { getCookie } from '@/utils/getCookie';

interface RankingModalProps {
    opened: boolean;
    onClose: () => void;
    game?: Game;
}

export default function RankingModal({ opened, onClose }: RankingModalProps) {
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        const fetchGame = async () => {
            const gameId = getCookie('gameID');
            if (!gameId) return;

            const gameApi = new GameApi();
            const response = await gameApi.getGameById(gameId);

            if (response.status === 200 && response.data) {
                setGame(response.data);
            }
        };

        if (opened) {
            fetchGame();
        }
    }, [opened]);

    const [winner, setWinner] = useState<String | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWinner = async () => {
          if (!game?.id) {
            setWinner(null);
            setLoading(false);
            return;
          }
      
          try {
            const gameApi = new GameApi();
            const response = await gameApi.getWinner(game.id);
            console.log('Gewinner vom Backend:', response.data.winner.name);
            setWinner(response.data?.winner.name || null);
          } catch (err) {
            setError(`Fehler beim Abrufen: ${(err as Error).message}`);
          } finally {
            setLoading(false);
          }
        };
      
        fetchWinner();
      }, [game]);

    const sortedPlayers = game?.players?.slice().sort((a, b) => b.score - a.score);
    const winnerScore = game?.players?.find((player) => player.name === winner)?.score;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700}>Spielergebnis</Text>}
            size="lg"
            centered
        >
            {game ? (
                <Stack>
                    {winner && (
                        <Text size="xl" fw={700} c="green" ta="center">
                            🏆 {winner} <Badge color="green">{winnerScore} Punkte</Badge>
                        </Text>
                    )}

                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Kontostand</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sortedPlayers?.map((player) => (
                                <Table.Tr key={player.name}>
                                    <Table.Td>{player.name}</Table.Td>
                                    <Table.Td>{player.score}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Stack>
            ) : (
                <Text>Lade Spielergebnisse…</Text>
            )}
        </Modal>
    );
}
