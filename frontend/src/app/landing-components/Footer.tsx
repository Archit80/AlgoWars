import Link from "next/link";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
// import { Code2 } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const Footer = () => (
  <footer className="relative px-4 py-8 bg-gray-950 border-t border-gray-800">
    <div className="relative z-10 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-fit h-fit flex items-center justify-center">
              {/* <Code2 className="h-6 w-6 text-black" /> */}
              <Image
                src="/logo.png"
                alt="CodeClash Logo"
                width={72}
                height={72}
                className="rounded-lg"
              />
            </div>
            <span
              className={`text-2xl font-bold text-white ${spaceGrotesk.className}`}
            >
              CodeClash
            </span>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4
                className={`font-semibold text-lime-400 mb-4 ${spaceGrotesk.className}`}
              >
                Platform
              </h4>
              <ul className="space-y-2">
                {["Features", "Challenges", "Leaderboard", "Tournaments"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4
                className={`font-semibold text-lime-400 mb-4 ${spaceGrotesk.className}`}
              >
                Community
              </h4>
              <ul className="space-y-2">
                {["Discord", "GitHub", "Blog", "Forum"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2024 CodeClash. Built for developers worldwide.
            </p>
          </div>
        </div>
        <ProfileCard
          avatarUrl="/avatar.png"
          miniAvatarUrl="/mini-avatar.png"
          showBehindGradient={false}
          enableMobileTilt={true}
          name="Archit Taneja"
          title="Full Stack Developer"
          handle="archit80"
          contactText="Github"
          showUserInfo={true}
          onContactClick={() =>
            window.open("https://github.com/archit80", "_blank")
          }
          iconUrl="https://cdn-icons-png.flaticon.com/512/25/25231.png"
        />
      </div>
    </div>
  </footer>
);

export default Footer;
