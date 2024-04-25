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
import { router } from 'next/client';
import { getCookie } from '@/utils/getCookie';
import {useRouter} from "next/navigation";

export default function endScreen() {
    const gameApi = new GameApi();
    const [gameId, setGameId] = useState<string>('');
    //const [playerId, setPlayerId] = useState<string>('');
    const [game, setGame] = useState<Game>();
    //const [map, setMap] = useState<Map<string, number>>();
    const router = useRouter();

    const init = async () => {
        if (gameId !== '') {
            const response = await gameApi.getGameById(gameId);
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
              gap="md"
              justify="flex-end"
              align="flex-end"
              direction="column"
              wrap="wrap"
            >
                <Container>
                    <Text>Spielende!</Text>
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
