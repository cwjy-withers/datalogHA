import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
    options: string[];
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export function SegmentedControl({
    options,
    value,
    onChange,
    className,
    disabled,
}: SegmentedControlProps) {
    return (
        <div
            className={cn(
                "flex p-1 rounded-lg bg-secondary text-secondary-foreground w-full overflow-hidden",
                className
            )}
        >
            {options.map((option) => {
                const isSelected = value === option;
                return (
                    <button
                        key={option}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(option)}
                        className={cn(
                            "flex-1 py-1.5 text-xs sm:text-sm font-medium transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isSelected
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:bg-background/50",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
