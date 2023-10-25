'use client';

import React from 'react';
import { ActionIcon, Container, Menu, Title, Flex, Group } from '@mantine/core';
import { IconUser, IconLogout } from '@tabler/icons-react';
import { getAuth, signOut } from 'firebase/auth';
import { useViewportSize } from '@mantine/hooks';
import Image from 'next/image';

import gameTheoryLogo from 'public/GameTheory_Header.png';
import firebase from '../firebaseApp';

export default function DozentMenueLeiste() {
    const auth = getAuth(firebase);
    const { height: screenHeight, width: screenWidth } = useViewportSize();

    return (
        <Container bg="brand.7" fluid px={40} p={10}>
            <Group justify="space-between" align="center">
                <Flex align="center">
                    <Image src={gameTheoryLogo} height={70} alt="." />
                    {screenWidth > 980 ? (
                        <Title
                          c="white"
                          ta="left"
                          style={{ fontFamily: 'Castellar, sans-serif', fontWeight: 700 }}
                        >
                            Game Theory
                        </Title>
                    ) : (
                        <></>
                    )}
                </Flex>
                <Menu>
                    <Menu.Target>
                        <ActionIcon c="white">
                            <IconUser size="5rem" />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Einstellungen</Menu.Label>
                            <Menu.Item
                              leftSection={<IconLogout size={14} />}
                              onClick={() => signOut(auth)}
                            >
                                Logout
                            </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Container>
    );
}
