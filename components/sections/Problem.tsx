import { Card } from "@/components/ui/card";

const problems = [
  {
    title: "Rules Without Real Context",
    description: "Textbooks define grammar patterns, but never show you how native speakers naturally reach for them in real sentences",
    icon: "📖",
  },
  {
    title: "Passive Learning Plateau",
    description: "Apps and flashcards build recognition — but when it's time to write or speak, the words and structures just won't come",
    icon: "🧊",
  },
  {
    title: "No Clear Path Forward",
    description: "With hundreds of patterns to choose from, most learners don't know which ones actually matter for natural expression",
    icon: "🗺️",
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Most Japanese Learners Stay Stuck
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You&apos;re putting in the work. Here&apos;s why the results don&apos;t match — and what actually changes the trajectory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Grammar That Actually Builds Fluency
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            bunpo100 curates the 100 patterns every fluent Japanese speaker relies on — with authentic examples that show real usage, not just definitions. Track exactly where you are. Know exactly where to go next.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Curated — the patterns that matter most
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Contextual — real examples, not just definitions
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Trackable — mark progress, stay on course
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
