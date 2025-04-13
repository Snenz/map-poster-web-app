"use client"

import { useState, useEffect } from "react";

import DesignCard from "./design-card";

export default function DesignGrid() {
    const [randomDesigns, setRandomDesigns] = useState(null);


    useEffect(() => {
        if (randomDesigns) return; // avoid fetching if already fetched

        const fetchRandomDesigns = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/random_designs?count=8`, {
                method: "GET"
            });

            if (res.ok) {
                const data = await res.json();
                setRandomDesigns(data);
            }
        };

        fetchRandomDesigns();
    }, []);

    return (
        <div className="grid grid-cols-4 grid-rows-1 gap-5 justify-center">
            {randomDesigns ? randomDesigns.map((design) => (
                <DesignCard key={design.design_id} design={design} />
            )) : Array.from({ length: 8 }, (_, i) => (
                <DesignCard key={i} />
            ))}
        </div>
    );
}