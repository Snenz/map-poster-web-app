"use client"

import DesignCard from "./design-card";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function DesignGrid() {
    const { random_designs, error, isLoading } = useSWR('/api/random_designs', fetcher);

    return (
        <div className="grid grid-cols-4 grid-rows-1 gap-5 justify-center">
            {!isLoading && !error && random_designs ? random_designs.map((design) => (
                <DesignCard key={design.id} design={design} />
            )) : Array.from({ length: 8 }, (_, i) => (
                <DesignCard key={i} />
            ))}
        </div>
    );
}