import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Gavel, Truck, ArrowRight } from "lucide-react";
import Image from 'next/image';

const SolutionSection = () => {
  const steps = [
    {
      icon: Users,
      title: "Form Local Collectives",
      description: "Vendors in the same area connect and group together on our platform"
    },
    {
      icon: ShoppingCart,
      title: "Create Bulk Orders",
      description: "Pool raw material needs to form larger, more attractive orders"
    },
    {
      icon: Gavel,
      title: "Suppliers Compete",
      description: "Registered suppliers bid competitively for collective orders"
    },
    {
      icon: Truck,
      title: "Secure Best Deal",
      description: "Lowest bidder with acceptable terms wins and delivers"
    }
  ];

  return (
    <section className="py-20 bg-section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Introducing <span className="text-[#3e6c6c]">VendorConnect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A digital platform that empowers collective purchasing, connecting vendors with suppliers 
            through transparent bidding for better prices and reliable supply chains.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div className="order-2 lg:order-1 animate-scale-in">
            <Image
              src="/solution.png"
              alt="Digital platform connecting vendors and suppliers"
              width={800}
              height={480}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Collective Power, Individual Benefits
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform transforms the traditional supply chain by aggregating demand from multiple vendors, 
                creating bulk orders that attract competitive bids from verified suppliers. This collective approach 
                ensures better pricing, quality assurance, and delivery reliability.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Verified Suppliers:</span> All suppliers undergo thorough vetting for quality and reliability
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Transparent Bidding:</span> Open competition ensures fair pricing and best terms
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Local Focus:</span> Geographic grouping optimizes logistics and delivery efficiency
                </p>
              </div>
            </div>

            <Button variant="default" size="lg" className="p-2 text-white font-bold bg-[#3e6c6c] hover:bg-[#2b4b4b] hover:scale-101 hover:shadow-lg transition-all duration-200">
              Learn More About Our Platform
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="animate-fade-in-up">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Simple Steps to Smarter Sourcing
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="relative text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#3e6c6c] text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3e6c6c]/10 rounded-xl mb-4">
                      <IconComponent className="h-8 w-8 text-[#3e6c6c]" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;