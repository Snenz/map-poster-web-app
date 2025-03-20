"use client"

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import dynamic from "next/dynamic";
import { SwatchBook, CircleChevronLeft } from "lucide-react";

const SearchBox = dynamic(() => import("@mapbox/search-js-react").then(mod => mod.SearchBox), { ssr: false });

import "mapbox-gl/dist/mapbox-gl.css";

export default function Designer() {
    const searchParams = useSearchParams();
    const design_id = searchParams.get("design_id");

    const mapContainerRef = useRef();
    const mapRef = useRef();

    const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const [locationSearchValue, setLocationSearchValue] = useState("");

    useEffect(() => {
        mapboxgl.accessToken = mapboxAccessToken;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [9.177216500001691, 48.77929022604192],
            zoom: 11.896203914152048
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        mapRef.current.setMaxPitch(0);

        mapRef.current.on("moveend", () => {
            console.table({
                ...mapRef.current.getCenter(),
                zoom: mapRef.current.getZoom(),
                bearing: mapRef.current.getBearing()
            });
        });
    }, []);

    return (
        <div className="h-full">
            <div className="flex flex-row justify-between items-center mb-5">
                <h1 className="font-bold text-4xl">Map Poster Designer</h1>
                <Button size="lg" variant="outline" onClick={() => { redirect("/"); }}><CircleChevronLeft />Back to Homepage</Button>
            </div>
            <div className="flex flex-row space-x-5">
                <div className="flex-1/3">
                    <Card>
                        <CardTitle className="px-6 text-xl">Settings</CardTitle>
                        <CardContent>
                            <Label className="mb-2">Search Location</Label>
                            <SearchBox id="search-box" accessToken={mapboxAccessToken} map={mapRef.current} mapboxgl={mapboxgl} value={locationSearchValue} onChange={(str) => { setLocationSearchValue(str); }} />
                            <Button type="submit"><SwatchBook />Share Design Publicly</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-2/3">
                    <Card>
                        <CardTitle className="px-6 text-xl">Poster Preview</CardTitle>
                        <CardContent>
                            <AspectRatio ratio={1 / Math.sqrt(2)}>
                                <div className="w-full h-full map-container" ref={mapContainerRef}></div>
                            </AspectRatio>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}