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

/**
 * A modal component that displays instructions along with an optional right button.
 * It contains customizable content and an image showing instructions. The modal size
 * is set to 85% of the screen width, and it can be closed via the close button or by
 * clicking outside (if enabled).
 * 
 * 
 * @param {InstructionsModalProps} props - The props for the InstructionsModal component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal (usually instructions).
 * @param {boolean} props.opened - A boolean that controls whether the modal is open or closed.
 * @param {Function} props.onClose - A function that is called when the modal is closed.
 * @param {Object} props.rightButton - An object representing the right button's properties.
 * @param {string} props.rightButton.text - The text to be displayed on the right button.
 * @param {Function} props.rightButton.callback - The callback function to be executed when the right button is clicked.
 * 
 * @returns {JSX.Element} A modal displaying instructions with a right button and optional content.
 * 
 */
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