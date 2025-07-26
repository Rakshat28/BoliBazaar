import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp } from "lucide-react";
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-section-gradient px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-none">
                Empowering Street Food Vendors Through{" "}
                <span className="text-[#3e6c6c]">Collective Buying</span>
             </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Pool demand, secure better deals, and build trust in your supply chain. 
                Join the movement revolutionizing raw material sourcing for local eateries.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
                variant="default"
                size="lg"
                className="group bg-[#3e6c6c] text-white font-bold p-2 hover:bg-[#2b4b4b] hover:scale-101 hover:shadow-lg transition-all duration-200 flex items-center"
            >
                Discover How It Works
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <Button variant="outline" size="lg">
                Join the Waitlist
            </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3e6c6c]/10 rounded-lg">
                  <Users className="h-6 w-6 text-[#3e6c6c]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">1000+</div>
                  <div className="text-sm text-muted-foreground">Vendors Ready</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">30%</div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="animate-scale-in">
              <Image
                src="/hero.png"
                alt="Street food vendors collaborating through digital platform"
                width={800}
                height={480}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;