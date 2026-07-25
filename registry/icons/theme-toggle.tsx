"use client";

import { AnimatePresence, motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";
import type { Theme } from "@/hooks/useTheme";

export interface ThemeToggleIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface ThemeToggleIconProps extends HTMLAttributes<HTMLDivElement> {
    theme: Theme;
    size?: number;
}

/**
 * Sun (light) / moon (dark) icon that crossfades + rotates on theme change and
 * gives a little spin on hover. Colour is inherited via `currentColor`, so the
 * parent Button's text colour drives it just like the other header icons.
 */
const ThemeToggleIcon = forwardRef<ThemeToggleIconHandle, ThemeToggleIconProps>(
    ({ theme, onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;
            return {
                startAnimation: () => controls.start("animate"),
                stopAnimation: () => controls.start("normal"),
            };
        });

        const handleMouseEnter = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) onMouseEnter?.(e);
                else controls.start("animate");
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) onMouseLeave?.(e);
                else controls.start("normal");
            },
            [controls, onMouseLeave]
        );

        const isDark = theme === "dark";

        return (
            <div
                className={cn("relative inline-flex items-center justify-center", className)}
                style={{ width: size, height: size }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.div
                    animate={controls}
                    variants={{
                        normal: { rotate: 0 },
                        animate: { rotate: isDark ? -25 : 40 },
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    className="inline-flex"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.svg
                                key="moon"
                                width={size}
                                height={size}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key="sun"
                                width={size}
                                height={size}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }
);

ThemeToggleIcon.displayName = "ThemeToggleIcon";

export { ThemeToggleIcon };
