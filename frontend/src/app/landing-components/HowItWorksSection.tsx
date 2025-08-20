import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const howItWorksSteps = [
  {
    id: 1,
    title: "Sign Up & Choose Your Weapon",
    description: "Create your account and select your preferred programming language to start your coding journey",
    details:
      "Choose from 15+ programming languages including JavaScript, Python, Java, C++, Rust, and more. Set up your profile with your coding preferences and skill level.",
    icon: "1",
  },
  {
    id: 2,
    title: "Battle & Solve Challenges",
    description: "Jump into 1v1 battles or tackle solo challenges to sharpen your skills and earn XP",
    details:
      "Access over 1000+ coding challenges ranging from beginner to expert level. Participate in real-time battles with other developers or practice at your own pace.",
    icon: "2",
  },
  {
    id: 3,
    title: "Climb the Leaderboard",
    description: "Rise through the ranks, unlock achievements, and establish yourself as a coding champion",
    details:
      "Earn XP, unlock badges, and climb regional and global leaderboards. Participate in weekly tournaments and seasonal events for exclusive rewards.",
    icon: "3",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="px-4 py-12 bg-gradient-to-b to-gray-900/50 from-transparent">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${spaceGrotesk.className}`}>
          <span className="bg-gradient-to-b from-lime-400 to-green-500 bg-clip-text text-transparent">How It Works</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get started in minutes and begin your journey to coding mastery</p>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-0.5 top-16 bottom-16 w-0.5 bg-gradient-to-b from-lime-400 via-green-500 to-lime-400 hidden md:block" />
        <div className="space-y-12">
          {howItWorksSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="flex-1 group">
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-lime-400/50 transition-all duration-300 transform hover:scale-102">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lime-400 ${spaceGrotesk.className}`}>{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-400">{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-md shadow-lime-400/25">
                    <span className="text-2xl font-bold text-black">{step.icon}</span>
                  </div>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
