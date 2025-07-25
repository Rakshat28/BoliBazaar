import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Shield, CheckCircle } from "lucide-react";

const ImpactSection = () => {
  const impacts = [
    {
      icon: DollarSign,
      title: "Empower Your Business",
      description: "Access better rates, reliable quality supplies, and reduce procurement costs by up to 30%.",
      benefits: ["Lower prices through bulk buying", "Consistent quality assurance", "Improved profit margins"],
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Target,
      title: "Streamline Your Sales",
      description: "Gain access to verified, aggregated bulk orders in nearby regions, optimizing logistics and expanding reach.",
      benefits: ["Verified bulk demand", "Optimized delivery routes", "Reduced marketing costs"],
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Shield,
      title: "Build Trust & Transparency",
      description: "Foster a transparent and trustworthy local street food supply chain, benefiting all stakeholders.",
      benefits: ["Verified supplier network", "Transparent pricing", "Quality guarantees"],
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  const metrics = [
    { value: "30%", label: "Cost Reduction", subtitle: "Average savings for vendors" },
    { value: "50+", label: "Verified Suppliers", subtitle: "Quality-assured partners" },
    { value: "1000+", label: "Vendors Ready", subtitle: "Waiting to join platform" },
    { value: "15", label: "Cities Planned", subtitle: "Initial rollout locations" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Transforming the Local{" "}
            <span className="text-[#3e6c6c]">Food Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform creates a win-win situation for all stakeholders, building a stronger, 
            more efficient supply chain that benefits vendors, suppliers, and consumers alike.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {impacts.map((impact, index) => {
            const IconComponent = impact.icon;
            return (
              <Card
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up border-0 bg-card"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mx-auto mb-4 ${impact.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {impact.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {impact.description}
                  </p>
                  <div className="space-y-3">
                    {impact.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Metrics and Visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Metrics */}
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-primary mb-8">
              Impact by the Numbers
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-[#3e6c6c]/10 rounded-xl border border-border hover:bg-[#3e6c6c]/20 transition-colors duration-300"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-scale-in">
            <img
              src="/impact.png"
              alt="Community network showing platform impact"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Quote/Testimonial */}
        <div className="mt-20 text-center animate-fade-in-up">
          <div className="max-w-4xl mx-auto p-8 bg-[#3e6c6c]/5 rounded-2xl border border-[#3e6c6c]/20">
            <div className="text-4xl text-primary mb-4"></div>
            <blockquote className="text-xl italic text-foreground mb-6 leading-relaxed">
              This platform represents the future of local commerce - where technology empowers 
              traditional businesses to thrive through collaboration and transparency.
            </blockquote>
            <div className="text-sm text-muted-foreground">
              — Vision for India&apos;s Street Food Revolution
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;