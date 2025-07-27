import Link from "next/link";
// import { Code2 } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-18 flex items-center border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/logo.png"
        alt="CodeClash Logo"
        width={48}
        height={48}
        className="rounded-lg"
      />
      <span className={`text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent ${spaceGrotesk.className}`}>
        CodeClash
      </span>
    </Link>
    <nav className={`ml-auto  gap-6 hidden md:flex ${spaceGrotesk.className}`}>
      <Link href="#features" className="text-base font-medium hover:text-lime-400 transition-colors">Features</Link>
      <Link href="#how-it-works" className="text-base font-medium hover:text-lime-400 transition-colors">How It Works</Link>
      <Link href="#leaderboard" className="text-base font-medium hover:text-lime-400 transition-colors">Leaderboard</Link>
    </nav>
  </header>
);

export default Header;
