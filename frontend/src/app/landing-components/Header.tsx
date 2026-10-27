import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 h-16 flex items-center border-b border-slate-200 bg-white">
    <Link href="/" className="flex items-center space-x-2">
      <BrandLogo size={36} />
      <span className="font-heading text-xl font-bold text-slate-900">
        AlgoLearn
      </span>
    </Link>
    <nav className="ml-auto items-center gap-6 hidden md:flex">
      <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Features</Link>
      <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">How It Works</Link>
      <Link
        href="/login"
        className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
      >
        Sign In
      </Link>
    </nav>
  </header>
);

export default Header;
