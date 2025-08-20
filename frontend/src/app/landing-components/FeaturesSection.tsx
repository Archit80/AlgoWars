import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Users, Target } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const FeaturesSection = () => (
  <section id="features" className="px-4 py-20 bg-gradient-to-b from-transparent to-gray-900/50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${spaceGrotesk.className}`}>
          <span className="bg-gradient-to-b from-lime-400 to-green-500 bg-clip-text text-transparent">Game-Changing Features</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to dominate the coding arena and level up your programming skills</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-gray-900/50 border-gray-800 hover:border-lime-400/50 transition-all duration-300 group">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <CardTitle className={`text-lime-400 ${spaceGrotesk.className}`}>XP System</CardTitle>
            <CardDescription className="text-gray-400">Earn experience points for every challenge completed, bug fixed, and battle won</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 hover:border-lime-400/50 transition-all duration-300 group">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-black" />
            </div>
            <CardTitle className={`text-lime-400 ${spaceGrotesk.className}`}>1v1 Battles</CardTitle>
            <CardDescription className="text-gray-400">Face off against other developers in real-time coding duels and prove your skills</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 hover:border-lime-400/50 transition-all duration-300 group">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-black" />
            </div>
            <CardTitle className={`text-lime-400 ${spaceGrotesk.className}`}>Solo Mode</CardTitle>
            <CardDescription className="text-gray-400">Practice with thousands of challenges across all difficulty levels and languages</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
