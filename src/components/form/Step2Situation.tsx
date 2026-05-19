"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SegmentedControl } from "@/components/SegmentedControl";
import {
    situationsAge0to6,
    situationsAge7to18,
    frequencyOptions,
} from "@/lib/schemas";

export function Step2Situation() {
    const { control, watch } = useFormContext();
    const ageGroup = watch("ageGroup");

    const situations =
        ageGroup === "0-6" ? situationsAge0to6 : situationsAge7to18;

    if (!ageGroup) {
        return (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                Vänligen välj en åldersgrupp i steg 1 för att se situationerna.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Situation</TableHead>
                            <TableHead className="text-center">Frekvens</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {situations.map((situation) => (
                            <React.Fragment key={situation}>
                                <TableRow>
                                    <TableCell className="font-medium">{situation}</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            name={`situationalRatings.${situation}`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <SegmentedControl
                                                            options={frequencyOptions}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                {situation === "Vid läggdags" && (
                                    <TableRow className="h-8 border-0 hover:bg-transparent pointer-events-none">
                                        <TableCell colSpan={2} className="p-0 border-b" />
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
