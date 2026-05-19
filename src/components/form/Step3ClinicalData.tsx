"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function Step3ClinicalData() {
    const { control, setValue } = useFormContext();
    const isSymmetrical = useWatch({ control, name: "symmetricalHearingLoss" });

    const hnsGradeLeft = useWatch({ control, name: "hnsGradeLeft" });
    const hnsGradeRight = useWatch({ control, name: "hnsGradeRight" });
    const hnsTypeLeft = useWatch({ control, name: "hnsTypeLeft" });
    const basnedsattningLeft = useWatch({ control, name: "basnedsattningLeft" });
    const diskantnedsattningLeft = useWatch({ control, name: "diskantnedsattningLeft" });
    const flatLossLeft = useWatch({ control, name: "flatLossLeft" });

    useEffect(() => {
        if (hnsGradeLeft === "Normal (<20)") {
            setValue("hnsTypeLeft", "---");
            setValue("basnedsattningLeft", false);
            setValue("diskantnedsattningLeft", false);
            setValue("flatLossLeft", false);
        }
    }, [hnsGradeLeft, setValue]);

    useEffect(() => {
        if (hnsGradeRight === "Normal (<20)") {
            setValue("hnsTypeRight", "---");
            setValue("basnedsattningRight", false);
            setValue("diskantnedsattningRight", false);
            setValue("flatLossRight", false);
        }
    }, [hnsGradeRight, setValue]);

    useEffect(() => {
        if (isSymmetrical) {
            setValue("hnsGradeRight", hnsGradeLeft);
            setValue("hnsTypeRight", hnsTypeLeft);
            setValue("basnedsattningRight", basnedsattningLeft);
            setValue("diskantnedsattningRight", diskantnedsattningLeft);
            setValue("flatLossRight", flatLossLeft);
        }
    }, [
        isSymmetrical,
        hnsGradeLeft,
        hnsTypeLeft,
        basnedsattningLeft,
        diskantnedsattningLeft,
        flatLossLeft,
        setValue
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Usage Time */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">Datalogging</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Right ear */}
                    <div className="space-y-4">
                        {/* Actual usage — right */}
                        <FormItem>
                            <FormLabel>Höger öra</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name="usageTimeRightHours"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">tim</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="usageTimeRightMinutes"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>

                        {/* Estimated usage — right */}
                        <FormItem>
                            <FormLabel>Uppskattad användningstid</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name="estimatedUsageTimeRightHours"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">tim</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="estimatedUsageTimeRightMinutes"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>
                    </div>
                    {/* Left ear */}
                    <div className="space-y-4">
                        {/* Actual usage — left */}
                        <FormItem>
                            <FormLabel>Vänster öra</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name="usageTimeLeftHours"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">tim</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="usageTimeLeftMinutes"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>

                        {/* Estimated usage — left */}
                        <FormItem>
                            <FormLabel>Uppskattad användningstid</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name="estimatedUsageTimeLeftHours"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">tim</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="estimatedUsageTimeLeftMinutes"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <div className="flex items-center gap-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="0"
                                                        className="text-center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>
                    </div>

                </div>
            </section>

            <Separator />

            {/* Hearing Loss (HNS) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Grad av hörselnedsättning (HNS)</h3>
                    <FormField
                        control={control}
                        name="symmetricalHearingLoss"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        id="symmetrical-hns"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <label
                                    htmlFor="symmetrical-hns"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Liksidig hörselnedsättning
                                </label>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Right Ear HNS */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Höger</h4>
                        <FormField
                            control={control}
                            name="hnsGradeRight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grad</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger disabled={isSymmetrical}>
                                                <SelectValue placeholder="Välj grad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Normal (<20)">Normal (&lt;20)</SelectItem>
                                            <SelectItem value="Mycket lätt (21-25 dB)">Mycket lätt (21-25 dB)</SelectItem>
                                            <SelectItem value="Lätt (26-40 dB)">Lätt (26-40 dB)</SelectItem>
                                            <SelectItem value="Måttlig (41-60 dB)">Måttlig (41-60 dB)</SelectItem>
                                            <SelectItem value="Svår (61-70 dB)">Svår (61-70 dB)</SelectItem>
                                            <SelectItem value="Grav (71-80 dB)">Grav (71-80 dB)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="hnsTypeRight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Typ</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger disabled={isSymmetrical || hnsGradeRight === "Normal (<20)"}>
                                                <SelectValue placeholder="Välj typ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="---">---</SelectItem>
                                            <SelectItem value="Sensorineural">Sensorineural</SelectItem>
                                            <SelectItem value="Ledningshinder">Ledningshinder</SelectItem>
                                            <SelectItem value="Kombinerad">Kombinerad</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 pt-2">
                            <FormField
                                control={control}
                                name="basnedsattningRight"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSymmetrical || hnsGradeRight === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Basnedsättning</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="diskantnedsattningRight"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSymmetrical || hnsGradeRight === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Grav diskantnedsättning</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="flatLossRight"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSymmetrical || hnsGradeRight === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Flat loss</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    {/* Left Ear HNS */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Vänster</h4>
                        <FormField
                            control={control}
                            name="hnsGradeLeft"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grad</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj grad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Normal (<20)">Normal (&lt;20)</SelectItem>
                                            <SelectItem value="Mycket lätt (21-25 dB)">Mycket lätt (21-25 dB)</SelectItem>
                                            <SelectItem value="Lätt (26-40 dB)">Lätt (26-40 dB)</SelectItem>
                                            <SelectItem value="Måttlig (41-60 dB)">Måttlig (41-60 dB)</SelectItem>
                                            <SelectItem value="Svår (61-70 dB)">Svår (61-70 dB)</SelectItem>
                                            <SelectItem value="Grav (71-80 dB)">Grav (71-80 dB)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="hnsTypeLeft"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Typ</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger disabled={hnsGradeLeft === "Normal (<20)"}>
                                                <SelectValue placeholder="Välj typ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="---">---</SelectItem>
                                            <SelectItem value="Sensorineural">Sensorineural</SelectItem>
                                            <SelectItem value="Ledningshinder">Ledningshinder</SelectItem>
                                            <SelectItem value="Kombinerad">Kombinerad</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4 pt-2">
                            <FormField
                                control={control}
                                name="basnedsattningLeft"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={hnsGradeLeft === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Basnedsättning</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="diskantnedsattningLeft"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={hnsGradeLeft === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Grav diskantnedsättning</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="flatLossLeft"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={hnsGradeLeft === "Normal (<20)"}
                                            />
                                        </FormControl>
                                        <div className="leading-none">
                                            <FormLabel>Flat loss</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                </div>

            </section>

            <Separator />

            {/* Hearing Aid Configuration */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">Hörapparat</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Right Ear HA */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Höger</h4>
                        <FormField
                            control={control}
                            name="haTypeRight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Typ</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj typ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="---">---</SelectItem>
                                            <SelectItem value="Baha">Baha</SelectItem>
                                            <SelectItem value="Bakom örat">Bakom örat</SelectItem>
                                            <SelectItem value="Cros">Cros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    {/* Left Ear HA */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Vänster</h4>
                        <FormField
                            control={control}
                            name="haTypeLeft"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Typ</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj typ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="---">---</SelectItem>
                                            <SelectItem value="Baha">Baha</SelectItem>
                                            <SelectItem value="Bakom örat">Bakom örat</SelectItem>
                                            <SelectItem value="Cros">Cros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                </div>
            </section>
        </div>
    );
}
