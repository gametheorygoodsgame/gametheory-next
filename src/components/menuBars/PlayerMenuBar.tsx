import React from 'react';
import { Container, Flex, Title } from '@mantine/core';
import Image from 'next/image';

import gameTheoryLogo from 'public/GameTheory_Header.png';
import { theme } from '@/utils/theme';

export default function PlayerMenuBar() {
  return (
    <Container bg="brand.7" fluid px={40} p={10}>
      <Flex align="center">
        <Image src={gameTheoryLogo} height={70} alt="." />
        <Title style={theme.components?.Title?.styles.root}>Game Theory</Title>
      </Flex>
    </Container>
  );
}
