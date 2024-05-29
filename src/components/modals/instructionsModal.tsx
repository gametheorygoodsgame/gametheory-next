import { Button, Container, Group, Modal, Stack, Image } from '@mantine/core';
import React from 'react';
import NextImage from 'next/image';
import instructionSheet from '../../../public/instructionSheet.png';

interface InstructionsModalProps {
    children?: React.ReactNode;
    opened: boolean;
    onClose: () => void;
    rightButton: {
        text: string;
        callback: () => void;
    }
}

export default function InstructionsModal({ children, opened, onClose, rightButton }:
    InstructionsModalProps) {
    return (
        <Modal
          opened={opened}
          onClose={onClose}
          centered
          withCloseButton={false}
          closeOnClickOutside={false}
          size={'85%'}
        >
            <Container>
                <Stack fz={18} fw={70} p={40} className="lbl-round">
                    {children}
                </Stack>
                <Image src={instructionSheet} component={NextImage} alt='Anleitung zum Spiel' style={{width:'100%', height:'auto'}}/>
                <Group justify="end">
                    <Button onClick={rightButton.callback}>{rightButton.text}</Button>
                </Group>
            </Container>
        </Modal>
    );
}