import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ProfileCard from "@/components/ProfileCard/ProfileCard";

const Footer = () => (
  <footer className="relative px-4 py-12 bg-slate-50 border-t-4 border-blue-900">
    <div className="relative z-10 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Footer Content */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="flex items-center space-x-3 mb-4">
            <BrandLogo size={44} />
            <span className="font-heading text-2xl font-bold text-slate-900">
              AlgoLearn
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-md mb-8">
            A Final Year Project: a competitive web platform for learning data
            structures and algorithms.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-900 mb-4">
                Platform
              </h4>
              <ul className="space-y-2">
                {["Features", "Challenges", "Tournaments"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-slate-600 hover:text-blue-700 transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-900 mb-4">
                Community
              </h4>
              <ul className="space-y-2">
                {["Discord", "GitHub", "Blog", "Forum"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-600 hover:text-blue-700 transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-900 mb-4">
                Tech Stack
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Next.js &amp; React</li>
                <li>Tailwind CSS</li>
                <li>Node.js &amp; Express</li>
                <li>Supabase</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              &copy; 2026 AlgoLearn. Final Year Project.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-full lg:w-auto order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm lg:max-w-none">
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
      </div>
    </div>
  </footer>
);

export default Footer;
