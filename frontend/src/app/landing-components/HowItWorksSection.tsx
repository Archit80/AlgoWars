import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const howItWorksSteps = [
  {
    id: 1,
    title: "Sign Up & Choose Your Language",
    description: "Create your account and select your preferred programming language to start your coding journey",
    icon: "1",
  },
  {
    id: 2,
    title: "Practice & Peer Challenges",
    description: "Join peer challenges or tackle solo challenges to sharpen your skills and earn XP",
    icon: "2",
  },
  {
    id: 3,
    title: "Track Your Progress",
    description: "Progress with every challenge and monitor your growth over time",
    icon: "3",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="px-4 py-20 bg-white border-b border-slate-200">
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 max-w-2xl">
        <p className="section-label mb-2">02 &middot; Methodology</p>
        <h2 className="rule-title text-3xl lg:text-4xl font-bold text-slate-900 mb-4 inline-block">
          How It Works
        </h2>
        <p className="text-lg text-slate-600">Getting started takes three steps.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {howItWorksSteps.map((step) => (
          <Card key={step.id} className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
                Step {step.icon}
              </p>
              <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center mb-3">
                <span className="font-heading text-lg font-bold text-white">{step.icon}</span>
              </div>
              <CardTitle className="font-heading text-slate-900 text-xl">{step.title}</CardTitle>
              <CardDescription className="text-slate-600">{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
