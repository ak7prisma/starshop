import { useState, useCallback } from 'react';

interface UseModal {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export const useModal = (openModal: boolean = false): UseModal => {
    const [isOpen, setIsOpen] = useState(openModal);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, open, close, toggle };
};