import { Variants } from "framer-motion";

export const fadeIn = (direction: "up" | "down" | "left" | "right" | "none", delay: number): Variants => {
    return {
        hidden: {
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
            opacity: 0,
        },
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                type: 'tween',
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75],
            }
        }
    }
}

export const staggerContainer = (staggerChildren: number, delayChildren?: number): Variants => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delayChildren || 0,
            },
        },
    };
};
