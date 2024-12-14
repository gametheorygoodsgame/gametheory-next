import { Button, Container, Group, Modal, Stack } from '@mantine/core';
import React from 'react';

interface ButtonModalProps {
    children?: React.ReactNode;
    opened: boolean;
    onClose: () => void;
    title?: string;
    leftButton?: {
        text: string;
        callback: () => void;
    }
    rightButton: {
        text: string;
        callback: () => void;
    }
}

/**
 * A modal component that displays customizable content and two buttons (left and right).
 * The modal has an optional left button and a required right button with customizable 
 * text and callback actions. It also includes a customizable title and prevents closing 
 * when clicking outside the modal.
 * 
 * 
 * @param {ButtonModalProps} props - The props for the ButtonModal component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal.
 * @param {boolean} props.opened - A boolean that controls whether the modal is open or closed.
 * @param {Function} props.onClose - A function that is called when the modal is closed.
 * @param {Object} [props.leftButton] - An optional button on the left side of the modal.
 * @param {string} props.leftButton.text - The text displayed on the left button (optional).
 * @param {Function} props.leftButton.callback - The callback function executed when the left button is clicked (optional).
 * @param {Object} props.rightButton - The button on the right side of the modal (required).
 * @param {string} props.rightButton.text - The text displayed on the right button.
 * @param {Function} props.rightButton.callback - The callback function executed when the right button is clicked.
 * @param {string} [props.title] - An optional title displayed at the top of the modal.
 * 
 * @returns {JSX.Element} A modal with customizable content and two buttons, with optional left and right actions.
 */

export default function ButtonModal({ children, opened, onClose, leftButton, rightButton, title }:
    ButtonModalProps) {
    return (
        <Modal
          opened={opened}
          onClose={onClose}
          centered
          withCloseButton={false}
          title={title}
          closeOnClickOutside={false}
        >
            <Container>
                <Stack fz={18} fw={700} p={40} className="lbl-round">
                    {children}
                </Stack>
                <Group justify="end">
                    {leftButton ? (
                        <Button
                          variant="outline"
                          color="#cc4444"
                          bg="white"
                          onClick={leftButton.callback}
                        >
                            {leftButton.text}
                        </Button>
                    ) : null}
                    <Button onClick={rightButton.callback}>{rightButton.text}</Button>
                </Group>
            </Container>
        </Modal>
    );
}
