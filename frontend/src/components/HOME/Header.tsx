import React from "react";
import { Code, Flame } from "lucide-react";
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
const Header = ({ streak, player }: { streak: number; player: { name: string; avatar: string; id: string } }) => {
  return (
    <header className={`${spaceGrotesk.className} border-b top-0 sticky border-gray-800 bg-black/50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* <Code className="h-8 w-8 text-[#84CC16]" /> */}
          <Image
            width={96}
            height={96}
            src="/logo.png"
            alt="CodeClash"
            className="h-12 w-12 "
          />

          <h1 className="text-2xl font-bold font-space text-[#84CC16]">
            CodeClash
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Badge variant="outline" className="border-lime-500 border-2 h-8 w-36 text-md rounded-full text-[#84CC16]">
            <Flame className="!h-4 !w-4 " />
            {streak} day streak
          </Badge>
          <Link href={`/profile/${player.id}`} className="flex items-center space-x-2">
          <Button variant="ghost"  className=" rounded-full bg-lime-400 h-10 w-10 hover:bg-lime-500 hover:cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarImage src={player.avatar || "/placeholder.svg"} />
              <AvatarFallback>{player.name }</AvatarFallback>
            </Avatar>
          </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
