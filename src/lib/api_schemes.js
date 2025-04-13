import { z } from "zod";

const hexColor6Digit = z.string().regex(/^#([A-Fa-f0-9]{6})$/, {
    message: "Invalid hex color (must be 6-digit format like #A1B2C3).",
});

export const designSchemaPOST = z.object({
    location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        zoom: z.number().min(0),
        bearing: z.number().min(0).max(360),
    }),
    base_style: z.string().url(),
    map_style: z.object({
        showPedestrianRoads: z.boolean(),
        showPlaceLabels: z.boolean(),
        showPointOfInterestLabels: z.boolean(),
        showRoadLabels: z.boolean(),
        showTransitLabels: z.boolean(),
        show3dObjects: z.boolean(),
        theme: z.enum(["default", "faded", "monochrome"]),
        lightPreset: z.enum(["dawn", "day", "dusk", "night"]),
        colorMotorways: hexColor6Digit,
        colorTrunks: hexColor6Digit,
        colorRoads: hexColor6Digit
    }),
    cover_style: z.object({
        useCover: z.boolean(),
        coverBgColor: hexColor6Digit,
        coverTextColor: hexColor6Digit,
        coverText: z.string()
    })
});