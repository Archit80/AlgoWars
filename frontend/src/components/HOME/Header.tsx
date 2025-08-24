import React from "react";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});
const Header = ({ streak, player }: { streak: number; player: { name: string; profilePic: string; id: string; username?: string } }) => {
  return (
    <header className={`${spaceGrotesk.className} border-b top-0 sticky border-gray-800 bg-black/50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            width={96}
            height={96}
            src="/logo.png"
            alt="AlgoWars"
            className="h-12 w-12"
          />

          <h1 className="text-2xl font-bold font-space text-[#84CC16]">
            AlgoWars
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          {/* Mobile: only flame and number, md+: full badge */}
          <Badge
            variant="outline"
            className="border-lime-500 border-2 h-8 w-12 text-md rounded-full text-[#84CC16] flex items-center justify-center md:w-36 md:justify-start"
          >
            <Flame className="!h-4 !w-4" />
            <span className="ml-1">{streak}</span>
            <span className="hidden md:inline ml-1">day streak</span>
          </Badge>
          <Link href={`/profile/${player.username || player.id}`} className="flex items-center space-x-2">
            <Button variant="ghost" className="rounded-full bg-lime-400 h-10 w-10 hover:bg-lime-500 hover:cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src={player.profilePic || "/placeholder.svg"} />
                <AvatarFallback>{player.name}</AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
