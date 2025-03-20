"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import DesignGrid from "@/components/design-grid";
import { MapPlus, CornerDownLeft, CornerDownRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-14">
        <h1 className="font-bold text-6xl my-10">My Map Poster</h1>
        <div className="flex flex-row space-x-5 items-center">
          <CornerDownRight className="animate-bounce" size={40} />
          <Button className="font-bold" size="lg" onClick={() => { redirect("/designer"); }}><MapPlus />Design your own poster ...</Button>
          <CornerDownLeft className="animate-bounce" size={40} />
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-center text-3xl font-bold mb-5">... or choose a theme created by other users.</h2>
        <DesignGrid />
      </div>
    </main>
  );
}
