'use client';

import React from 'react';
import { Badge, Stack, Text, px } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';

export default function PlayerList({ game }: { game: Game | undefined; }) {
    
    const trophy = <IconTrophy color='gold' size={32}/>;
  
    const allPlayers = game?.players
    console.log(allPlayers)
    const getRandomNumber = (min: number, max: number) =>{
        return Math.floor(Math.random()*(max-min+1)) + min;
    }

    function getWinnerFromPlayers(){
        if(allPlayers && allPlayers.length > 0){
            const winner = allPlayers[getRandomNumber(0, allPlayers.length - 1)]
            return winner;
        }else{
            return null;
        }
    }

    const winner = getWinnerFromPlayers();
    
    return(
        <Stack>
            <Text style={{textAlign:'center'}}>
                Gewinner des Spiels : 
            </Text>
            <Badge
                fullWidth
                leftSection = {trophy}
                rightSection = {trophy}
                color='#334d80'
                size='xl'
                >
                {winner ? winner.name : 'Niemand'}
            </Badge>
        </Stack>
    ); 
}