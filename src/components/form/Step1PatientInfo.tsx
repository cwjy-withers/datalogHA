"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";

export function Step1PatientInfo() {
    const { control, watch, setValue } = useFormContext();
    const ageGroup = watch("ageGroup");
    const currentBirthYear = watch("birthYear");

    const currentYear = new Date().getFullYear(); // e.g. 2026

    // Calculate allowed years based on age group.
    // 0-6 years means birth year is between (currentYear) and (currentYear - 6)
    // 7-18 years means birth year is between (currentYear - 7) and (currentYear - 18)
    const birthYears = ageGroup === "0-6"
        ? Array.from({ length: 7 }, (_, i) => (currentYear - i).toString()) // 2026 to 2020
        : Array.from({ length: 12 }, (_, i) => (currentYear - 7 - i).toString()); // 2019 to 2008

    // Reset birth year if it's no longer valid for the newly selected age group
    useEffect(() => {
        if (currentBirthYear && !birthYears.includes(currentBirthYear)) {
            setValue("birthYear", "");
        }
    }, [ageGroup, currentBirthYear, birthYears, setValue]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Patient ID */}
                <FormField
                    control={control}
                    name="patientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient ID / Namn</FormLabel>
                            <FormControl>
                                <Input placeholder="Ange ID eller namn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date Picker */}
                <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Datum</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "yyyy-MM-dd")
                                            ) : (
                                                <span>Välj datum</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Age Group */}
                <FormField
                    control={control}
                    name="ageGroup"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Åldersgrupp</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value ?? ""}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="0-6" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            0–6 år
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="7-18" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            7–18 år
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Birth Year */}
                <FormField
                    control={control}
                    name="birthYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Födelseår</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj födelseår" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {birthYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
