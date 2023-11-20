import {useEffect, useRef, useState} from 'react';

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

export function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return { isOpen, openModal, closeModal };
}
