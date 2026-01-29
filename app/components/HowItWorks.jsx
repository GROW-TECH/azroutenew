import { CardWithHover, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "AI Screening & Report",
      description:
        "Our expert AI will do student screening & generate the report based on the student's strength.",
    },
    {
      number: 2,
      title: "Personal Consultation",
      description:
        "Azroute representative will contact you personally & explain the course plan with expert consultation.",
    },
    {
      number: 3,
      title: "Registration & Payment",
      description:
        "Complete your registration and payment to secure your spot in the program.",
    },
    {
      number: 4,
      title: "Start Your Journey",
      description:
        "Classes scheduling & your progress journey will start.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            How Azroute Chess Institute Works
          </h2>
          <p className="text-muted-foreground">
            Master chess in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <CardWithHover key={step.number} className="text-center p-0 h-full">
              <CardHeader className="flex flex-col items-center p-6 justify-between h-full">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-center text-sm">{step.description}</CardDescription>
                </div>
              </CardHeader>
            </CardWithHover>
          ))}
        </div>
      </div>
    </section>
  );
}
