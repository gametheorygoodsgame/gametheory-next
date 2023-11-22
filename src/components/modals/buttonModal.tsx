import {Button, Center, Container, Group, Loader, Modal, Stack, Text} from "@mantine/core";
import React from "react";

interface ButtonProps {
    text: string;
    callback: () => void;
}

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

export default function ButtonModal({children, opened, onClose, leftButton, rightButton, title}: ButtonModalProps) {
    return(
        <Modal opened={opened} onClose={onClose} centered withCloseButton={false} title={title} closeOnClickOutside={false}>
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