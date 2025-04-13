import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function ThemeSelector({ defaultSelectedTheme, onThemeChange }) {
    // provided base themes
    const availableThemes = {
        "Standard": "mapbox://styles/mapbox/standard",
        "Streets": "mapbox://styles/mapbox/streets-v12",
        "Outdoors": "mapbox://styles/mapbox/outdoors-v12",
        "Light": "mapbox://styles/mapbox/light-v11",
        "Dark": "mapbox://styles/mapbox/dark-v11",
        "Satellite": "mapbox://styles/mapbox/satellite-v9",
        "Blueprint": "mapbox://styles/mapbox-map-design/cks97e1e37nsd17nzg7p0308g",
        "Moonlight": "mapbox://styles/mapbox/cj3kbeqzo00022smj7akz3o1e",
        "Decimal": "mapbox://styles/mapbox-map-design/ck4014y110wt61ctt07egsel6",
        "Bubble": "mapbox://styles/mapbox-map-design/cl4wxue5j000c14r17uqrjpqb",
        "North Star": "mapbox://styles/mapbox/cj44mfrt20f082snokim4ungi",
        "Minimo": "mapbox://styles/mapbox-map-design/cksjc2nsq1bg117pnekb655h1",
    };

    const [selectedTheme, setSelectedTheme] = useState(defaultSelectedTheme);

    // handle theme selection
    useEffect(() => {
        if (onThemeChange) {
            onThemeChange(selectedTheme);
        }
    }, [selectedTheme]);

    return (
        <div className="grid grid-cols-3 gap-2">
            {Object.entries(availableThemes).map(([name, url]) => (
                <Button
                    key={name}
                    variant={selectedTheme === url ? "default" : "outline"}
                    onClick={() => setSelectedTheme(url)}
                >
                    {name}
                </Button>
            ))}
        </div>
    );
}
