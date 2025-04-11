'use client';

import React, { useEffect, useState } from 'react';
import { Badge, Stack, Text, Loader } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';

export default function PlayerList({ game }: { game: Game | undefined }) {
  const [winner, setWinner] = useState<String | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const trophy = <IconTrophy color="gold" size={32} />;

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
  

  if (loading) {
    return (
      <Stack align="center">
        <Text>Wird geladen...</Text>
        <Loader />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center">
        <Text color="red">Fehler: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack>
      <Text style={{ textAlign: 'center' }}>Gewinner des Spiels:</Text>
      <Badge
        fullWidth
        leftSection={trophy}
        rightSection={trophy}
        color="#334d80"
        size="xl"
      >
        {winner || 'Niemand1'}
      </Badge>
    </Stack>
  );
}