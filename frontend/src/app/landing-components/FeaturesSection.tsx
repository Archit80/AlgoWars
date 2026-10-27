import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Users, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "XP System",
    description: "Earn experience points for every solo challenge and peer challenge you complete",
  },
  {
    icon: Users,
    title: "Peer Challenges",
    description: "Work head-to-head with other learners in real-time coding sessions and demonstrate your skills",
  },
  {
    icon: Target,
    title: "Solo Mode",
    description: "Practice with a bank of challenges across difficulty levels and languages",
  },
];

const FeaturesSection = () => (
  <section id="features" className="px-4 py-20 bg-slate-50 border-b border-slate-200">
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 max-w-2xl">
        <p className="section-label mb-2">01 &middot; Overview</p>
        <h2 className="rule-title text-3xl lg:text-4xl font-bold text-slate-900 mb-4 inline-block">
          Key Features
        </h2>
        <p className="text-lg text-slate-600">
          The core capabilities that support practice, competition and progress tracking.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={f.title} className="bg-white border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-blue-700" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Fig. {i + 1}
                </span>
              </div>
              <CardTitle className="font-heading text-slate-900 text-xl">{f.title}</CardTitle>
              <CardDescription className="text-slate-600">{f.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
