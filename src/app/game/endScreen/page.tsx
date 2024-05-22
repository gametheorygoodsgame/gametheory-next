'use client';

import { GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import {
    Button,
    Center,
    Container,
    Flex,
    Table,
    Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { IconArrowLeft } from '@tabler/icons-react';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';
import GameWinner from '@/components/gameWinner/gameWinner';
import { getCookie } from '@/utils/getCookie';

export default function endScreen() {
    const gameApi = new GameApi();
    const [gameId, setGameId] = useState<string>('');
    //const [playerId, setPlayerId] = useState<string>('');
    const [game, setGame] = useState<Game>();
    //const [map, setMap] = useState<Map<string, number>>();
    const router = useRouter();

    const requestOptions = {
        headers: {
            Origin: 'https://gmt.atlasproject.de', // Set the 'Origin' header
        },
    };

    const init = async () => {
        if (gameId !== '') {
            const response = await gameApi.getGameById(gameId, requestOptions);
            if (response.status === 200 && response.data) {
                setGame(response.data);
            }
        }
    };
    function tableContent() {
        const players = game?.players;
        // eslint-disable-next-line array-callback-return
        // @ts-ignore
        const sortedPlayers = players?.sort((a, b) => b.score - a.score);
        const rows = sortedPlayers?.map((player) => (
            <Table.Tr key={player.name}>
                <Table.Td>{player.name}</Table.Td>
                <Table.Td>{player.score}</Table.Td>
            </Table.Tr>
        ));
        return rows;
    }

    useEffect(() => {
        setGameId(getCookie('gameID'));
        init();
    }, [gameId]);

    return (
        <Center>
            <Flex
              mih={50}
              gap="xl"
              justify="flex-end"
              align="flex-end"
              direction="column"
              wrap="wrap"
            >
                <Container>
                    <Text style={{ textAlign: 'center', fontSize: '48px' }}>Spielende!</Text>
                </Container>
                <Container>
                    <GameWinner game={game} />
                </Container>
                <Container>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Kontostand</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{tableContent()}</Table.Tbody>
                    </Table>
                </Container>
                <Container>
                    <Button
                      leftSection={<IconArrowLeft size={18} />}
                      onClick={() => {
                            router.push('/login/player');
                        }}
                    >Zurück zur Hauptseite
                    </Button>
                </Container>
            </Flex>
        </Center>
    );
}
