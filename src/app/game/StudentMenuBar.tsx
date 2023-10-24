import React from 'react';
import { Container, Title, Flex, StyleProp} from '@mantine/core';
import Image from 'next/image';

import gameTheoryLogo from 'public/GameTheory_Header.png';

export default function StudentMenuBar() {
    return (
        <Container bg="brand.7" fluid px={40} p={10}>
            <Flex align="center">
                <Image src={gameTheoryLogo} height={70} alt={"."}/>
                <Title
                    c="white"
                    ta="left"
                    //justify="center"
                    ff="Castellar, sans-serif"
                    fw={700}
                >
                    Game Theory
                </Title>
            </Flex>
        </Container>
    );
}