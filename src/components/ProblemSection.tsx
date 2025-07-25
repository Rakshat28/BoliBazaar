import { AlertTriangle, DollarSign, Users, Truck } from "lucide-react";

const ProblemSection = () => {
  const challenges = [
    {
      icon: DollarSign,
      title: "Higher Procurement Costs",
      description: "Small-scale purchases lead to inflated prices and reduced profit margins for vendors."
    },
    {
      icon: Users,
      title: "Fragmented Operations",
      description: "Vendors operate in isolation, missing opportunities for collective bargaining power."
    },
    {
      icon: Truck,
      title: "Unreliable Supply Chain",
      description: "Limited access to trusted suppliers causes inconsistent quality and delivery issues."
    },
    {
      icon: AlertTriangle,
      title: "No Market Leverage",
      description: "Individual vendors lack negotiating power against established supplier networks."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Challenge: Sourcing Struggles for{" "}
            <br />
            <span className="text-[#3e6c6c]">Street Food Vendors</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            In India&apos;s vibrant street food ecosystem, vendors face significant barriers in raw material sourcing. 
            Their fragmented nature prevents access to competitive pricing and trusted suppliers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {challenges.map((challenge, index) => {
            const IconComponent = challenge.icon;
            return (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-xl mb-6 group-hover:bg-destructive/20 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {challenge.title}
                </h3>
                <p className="text-muted-foreground">
                  {challenge.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-muted/50 rounded-2xl border border-border animate-fade-in-up">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              The Core Issue
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Vendors in close proximity often purchase similar raw materials but operate in isolation, 
              missing a crucial opportunity to <span className="font-semibold text-[#3e6c6c]">pool their demand</span> for 
              better leverage, competitive pricing, and reliable supply chains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;