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
import { getCookie } from '@/utils/getCookie';

export default function endScreen() {
    const gameApi = new GameApi();
    const [gameId, setGameId] = useState<string>('');
    //const [playerId, setPlayerId] = useState<string>('');
    const [game, setGame] = useState<Game>();
    const [map, setMap] = useState<Map<string, number>>();

    const init = async () => {
        if (gameId !== '') {
            const response = await gameApi.getGameById(gameId);
            if (response.status === 200 && response.data) {
                setGame(response.data);
            }
        }
    };
    function tableContent(): Map<string, number> {
        const result = new Map();
        game?.players.forEach((player) => {
            console.log('String lauf');
            result.set(player.name, player.score);
        });
        console.log(result);
        return result;
        // @ts-ignore
        //return new Map([...result.entries()].sort((a, b) => b[1] - a[1]));
    }

    useEffect(() => {
        setGameId(getCookie('gameID'));
        init().then(() => { setMap(tableContent()); });
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
                    <Text>Test text lorum </Text>
                </Container>
                <Container>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Td>{JSON.stringify(map)}</Table.Td>
                                <Table.Th>Score</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                    </Table>
                </Container>
                <Container>
                    <Button>Zurück zur Hauptseite</Button>
                </Container>
            </Flex>
        </Center>
    );
}
