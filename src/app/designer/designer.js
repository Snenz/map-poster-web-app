"use client"

import { redirect, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { useEffect, useRef, useState } from "react";

// shadcn UI components
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ThemeSelector from "@/components/theme-selector";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// lucide icons
import { SwatchBook, CircleChevronLeft, Printer } from "lucide-react";

// mapbox imports
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const SearchBox = dynamic(() => import("@mapbox/search-js-react").then(mod => mod.SearchBox), { ssr: false });

// css styles used for printing
import "./print-poster.css";


export default function Designer() {
    const searchParams = useSearchParams();

    const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const mapContainerRef = useRef();
    const mapRef = useRef();

    // other map states
    const [locationSearchValue, setLocationSearchValue] = useState("");
    const defaultStyleUrl = "mapbox://styles/mapbox/standard";
    const [baseStyleUrl, setBaseStyleUrl] = useState(defaultStyleUrl);
    const [mapLocation, setMapLocation] = useState({
        lat: 48.77929022604192,
        lng: 9.177216500001691,
        zoom: 11.896203914152048,
        bearing: 0
    });

    // map settings
    const [showPedestrianRoads, setShowPedestrianRoads] = useState(false);
    const [showPlaceLabels, setShowPlaceLabels] = useState(false);
    const [showPointOfInterestLabels, setShowPointOfInterestLabels] = useState(false);
    const [showRoadLabels, setShowRoadLabels] = useState(false);
    const [showTransitLabels, setShowTransitLabels] = useState(false);
    const [show3dObjects, setShow3dObjects] = useState(true);
    const [theme, setTheme] = useState("default");
    const [lightPreset, setLightPreset] = useState("day");
    const [colorMotorways, setColorMotorways] = useState("#f7c96e");
    const [colorTrunks, setColorTrunks] = useState("#f7c96e");
    const [colorRoads, setColorRoads] = useState("#ffffff");

    // cover settings
    const [useCover, setUseCover] = useState(true);
    const [coverBgColor, setCoverBgColor] = useState("#ffffff");
    const [coverTextColor, setCoverTextColor] = useState("#000000");
    const [coverText, setCoverText] = useState("My Map Poster");

    // first render
    useEffect(() => {
        // get design_id from URL
        const design_id = searchParams.get("design_id");

        // if design_id is provided, fetch the design data from the server
        if (design_id && design_id.length === 36) {
            const fetchDesign = async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design?design_id=${design_id}`, {
                    method: "GET"
                });

                if (res.ok) {
                    const data = await res.json();
                    setMapLocation(data.location);
                    setBaseStyleUrl(data.base_style);
                    setShowPedestrianRoads(data.map_style.showPedestrianRoads);
                    setShowPlaceLabels(data.map_style.showPlaceLabels);
                    setShowPointOfInterestLabels(data.map_style.showPointOfInterestLabels);
                    setShowRoadLabels(data.map_style.showRoadLabels);
                    setShowTransitLabels(data.map_style.showTransitLabels);
                    setShow3dObjects(data.map_style.show3dObjects);
                    setTheme(data.map_style.theme);
                    setLightPreset(data.map_style.lightPreset);
                    setColorMotorways(data.map_style.colorMotorways);
                    setColorTrunks(data.map_style.colorTrunks);
                    setColorRoads(data.map_style.colorRoads);
                    setUseCover(data.cover_style.useCover);
                    setCoverBgColor(data.cover_style.coverBgColor);
                    setCoverTextColor(data.cover_style.coverTextColor);
                    setCoverText(data.cover_style.coverText);
                }
            };

            fetchDesign();
        }

        mapboxgl.accessToken = mapboxAccessToken;

        // initialize map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: baseStyleUrl,
            center: [mapLocation.lng, mapLocation.lat],
            zoom: mapLocation.zoom,
            bearing: mapLocation.bearing,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right"); // add map controls
        mapRef.current.setMaxPitch(0); // disable 3D view / pitch

        // save map location after move
        mapRef.current.on("moveend", () => {
            setMapLocation({
                ...mapRef.current.getCenter(),
                zoom: mapRef.current.getZoom(),
                bearing: mapRef.current.getBearing()
            });
        });
    }, [mapboxAccessToken]);

    // handle map style changes
    useEffect(() => {
        if (baseStyleUrl !== "mapbox://styles/mapbox/standard") {
            mapRef.current.setStyle(baseStyleUrl);
        } else { // allow custom map settings for standard style map only
            const style = {
                "config": {
                    "basemap": {
                        "showPedestrianRoads": showPedestrianRoads,
                        "showPlaceLabels": showPlaceLabels,
                        "showPointOfInterestLabels": showPointOfInterestLabels,
                        "showRoadLabels": showRoadLabels,
                        "showTransitLabels": showTransitLabels,
                        "show3dObjects": show3dObjects,
                        "theme": theme,
                        "lightPreset": lightPreset,
                        "colorMotorways": colorMotorways,
                        "colorTrunks": colorTrunks,
                        "colorRoads": colorRoads
                    }
                }
            };
            mapRef.current.setStyle(baseStyleUrl, style);
        }
    }, [baseStyleUrl, showPedestrianRoads, showPlaceLabels, showPointOfInterestLabels, showRoadLabels, showTransitLabels,
        show3dObjects, theme, lightPreset, colorMotorways, colorTrunks, colorRoads]);

    // handle share design button click
    const shareDesign = async () => {
        const payload = {
            location: mapLocation,
            base_style: baseStyleUrl,
            map_style: {
                showPedestrianRoads,
                showPlaceLabels,
                showPointOfInterestLabels,
                showRoadLabels,
                showTransitLabels,
                show3dObjects,
                theme,
                lightPreset,
                colorMotorways,
                colorTrunks,
                colorRoads
            },
            cover_style: {
                useCover,
                coverBgColor,
                coverTextColor,
                coverText
            }
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.error(`Error: ${res.status}`);
            }

            const data = await res.json();
            alert(`Design /designer?design_id=${data.design_id}`);
        } catch (error) {
            console.error("Failed to send data:", error);
        }
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-5">
                <h1 className="font-bold text-4xl">Map Poster Designer</h1>
                <Button size="lg" variant="outline" onClick={() => { redirect("/"); }}><CircleChevronLeft />Back to Homepage</Button>
            </div>

            {/* Settings and Poster Preview */}
            <div className="flex flex-row space-x-5">

                {/* Settings */}
                <div className="flex-1/3">
                    <Card>
                        <CardTitle className="px-6 text-xl">Settings</CardTitle>
                        <CardContent>
                            <Label className="mb-2">Search Location</Label>
                            <SearchBox id="search-box" accessToken={mapboxAccessToken} map={mapRef.current} mapboxgl={mapboxgl} value={locationSearchValue} onChange={(str) => { setLocationSearchValue(str); }} />

                            <div className="my-4">
                                <ThemeSelector defaultSelectedTheme={defaultStyleUrl} onThemeChange={(theme) => { setBaseStyleUrl(theme); }} />
                            </div>

                            <Tabs defaultValue="map" className="w-full">

                                <TabsList className="w-full">
                                    <TabsTrigger value="map">Map Settings</TabsTrigger>
                                    <TabsTrigger value="cover">Cover Settings</TabsTrigger>
                                </TabsList>

                                {/* Map Settings */}
                                <TabsContent value="map">
                                    <Card className="py-0">
                                        <CardContent>
                                            {baseStyleUrl === "mapbox://styles/mapbox/standard" ?
                                                (<>
                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="showPedestrianRoads" defaultChecked={showPedestrianRoads} onCheckedChange={(checked) => { setShowPedestrianRoads(checked); }}>Show Pedestrian Roads</Checkbox>
                                                        <Label htmlFor="showPedestrianRoads">Show Pedestrian Roads</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="showPlaceLabels" defaultChecked={showPlaceLabels} onCheckedChange={(checked) => { setShowPlaceLabels(checked); }}>Show Place Labels</Checkbox>
                                                        <Label htmlFor="showPlaceLabels">Show Place Labels</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="showPointOfInterestLabels" defaultChecked={showPointOfInterestLabels} onCheckedChange={(checked) => { setShowPointOfInterestLabels(checked); }}>Show Point Of Interest Labels</Checkbox>
                                                        <Label htmlFor="showPointOfInterestLabels">Show Point Of Interest Labels</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="showRoadLabels" defaultChecked={showRoadLabels} onCheckedChange={(checked) => { setShowRoadLabels(checked); }}>Show Road Labels</Checkbox>
                                                        <Label htmlFor="showRoadLabels">Show Road Labels</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="showTransitLabels" defaultChecked={showTransitLabels} onCheckedChange={(checked) => { setShowTransitLabels(checked); }}>Show Transit Labels</Checkbox>
                                                        <Label htmlFor="showTransitLabels">Show Transit Labels</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Checkbox id="show3dObjects" defaultChecked={show3dObjects} onCheckedChange={(checked) => { setShow3dObjects(checked); }}>Show 3D Objects</Checkbox>
                                                        <Label htmlFor="show3dObjects">Show 3D Objects</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Select id="theme" defaultValue={theme} onValueChange={(value) => { setTheme(value); }}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Theme" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="default">Default</SelectItem>
                                                                <SelectItem value="faded">Faded</SelectItem>
                                                                <SelectItem value="monochrome">Monochrome</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <Select id="lightPreset" defaultValue={lightPreset} onValueChange={(value) => { setLightPreset(value); }}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Light Preset" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="dawn">Dawn</SelectItem>
                                                                <SelectItem value="day">Day</SelectItem>
                                                                <SelectItem value="dusk">Dusk</SelectItem>
                                                                <SelectItem value="night">Night</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <input type="color" id="colorMotorways" defaultValue={colorMotorways} onChange={(e) => { setColorMotorways(e.target.value); }} />
                                                        <Label htmlFor="colorMotorways">Color Motorways</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <input type="color" id="colorTrunks" defaultValue={colorTrunks} onChange={(e) => { setColorTrunks(e.target.value); }} />
                                                        <Label htmlFor="colorTrunks">Color Trunks</Label>
                                                    </div>

                                                    <div className="flex flex-row gap-x-2 my-4">
                                                        <input type="color" id="colorRoads" defaultValue={colorRoads} onChange={(e) => { setColorRoads(e.target.value); }} />
                                                        <Label htmlFor="colorRoads">Color Roads</Label>
                                                    </div>
                                                </>)
                                                : (<p className="py-2 text-gray-400">No map settings available for the selected theme.</p>)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Cover Settings */}
                                <TabsContent value="cover">
                                    <Card className="py-0">
                                        <CardContent>
                                            <div className="flex flex-row gap-x-2 my-4">
                                                <Switch defaultChecked={useCover} onCheckedChange={(checked) => { setUseCover(checked); }} id="useCover" />
                                                <Label htmlFor="useCover">Use Cover</Label>
                                            </div>

                                            <div className="flex flex-col gap-y-2 my-4">
                                                <Label htmlFor="coverText">Cover Text</Label>
                                                <Textarea defaultValue={coverText} id="coverText" className="max-w-[400px]" onChange={(e) => { setCoverText(e.target.value); }} />
                                            </div>

                                            <div className="flex flex-row gap-x-2 my-4">
                                                <input type="color" id="coverTextColor" defaultValue={coverTextColor} onChange={(e) => { setCoverTextColor(e.target.value); }} />
                                                <Label htmlFor="coverTextColor">Text Color</Label>
                                            </div>

                                            <div className="flex flex-row gap-x-2 my-4">
                                                <input type="color" id="coverBgColor" defaultValue={coverBgColor} onChange={(e) => { setCoverBgColor(e.target.value); }} />
                                                <Label htmlFor="coverBgColor">Background Color</Label>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>

                            {/* Share & Print Buttons */}
                            <div className="mt-4">
                                <Button onClick={() => { shareDesign(); }} type="submit" className="bg-fuchsia-800 mt-2 mr-2">
                                    <SwatchBook />Share Design Publicly
                                </Button>
                                <Button onClick={() => { window.print(); }} type="submit" className="bg-fuchsia-800 mt-2">
                                    <Printer />Print Map Poster
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Poster Preview */}
                <div className="flex-2/3">
                    <Card>
                        <CardTitle className="px-6 text-xl">Poster Preview</CardTitle>
                        <CardContent>
                            <div id="poster" className="relative max-h-[80vh] aspect-[0.70710678118] border-2 border-gray-300 ">

                                {/* Map */}
                                <div className="w-full h-full map-container" id="map-container" ref={mapContainerRef}></div>

                                {/* Cover */}
                                {useCover &&
                                    <div className="absolute bottom-0 left-0 w-full h-1/5 z-10" style={{ backgroundColor: coverBgColor }}>
                                        <div className="flex flex-wrap justify-center content-center w-full h-full overflow-hidden">
                                            <span className="font-bold text-6xl max-w-full max-h-full whitespace-pre-wrap text-center"
                                                style={{ color: coverTextColor }}>
                                                {coverText}
                                            </span>
                                        </div>
                                    </div>
                                }

                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}