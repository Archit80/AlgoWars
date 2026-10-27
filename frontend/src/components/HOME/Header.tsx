import React from "react";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import Link from "next/link";

const Header = ({ streak, player }: { streak: number; player: { name: string; profilePic: string; id: string; username?: string } }) => {
  return (
    <header className="border-b top-0 sticky z-40 border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BrandLogo size={40} />

          <h1 className="text-xl font-semibold text-blue-900">
            AlgoLearn
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          {/* Mobile: only flame and number, md+: full badge */}
          <Badge
            variant="outline"
            className="border-slate-200 bg-slate-50 border h-8 w-12 text-sm rounded-md text-slate-700 flex items-center justify-center md:w-36 md:justify-start"
          >
            <Flame className="!h-4 !w-4 text-blue-700" />
            <span className="ml-1">{streak}</span>
            <span className="hidden md:inline ml-1">day streak</span>
          </Badge>
          <Link href={`/profile/${player.username || player.id}`} className="flex items-center space-x-2">
            <span className="rounded-full border border-slate-200 bg-blue-50 h-10 w-10 flex items-center justify-center hover:border-blue-700 hover:cursor-pointer transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={player.profilePic || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-50 text-blue-900">{player.name}</AvatarFallback>
              </Avatar>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
