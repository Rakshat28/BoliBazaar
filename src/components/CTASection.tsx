import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-[#87a3a3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full text-primary-foreground text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Join the Movement
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your{" "}
            <span className="text-[#1a2e2e]">Sourcing?</span>
          </h2>
          
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Be part of a smarter, more efficient supply chain. Join thousands of vendors 
            and suppliers who are already transforming how local food businesses operate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="secondary" 
              size="lg" 
              className="group font-semibold"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get Early Access
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Learn More
            </Button>
          </div>

          {/* Features highlights */}
          <div className="grid md:grid-cols-3 gap-8 text-primary-foreground/80">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary-foreground">Free</div>
              <div className="text-sm">No setup costs for vendors</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary-foreground">30%</div>
              <div className="text-sm">Average cost savings</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary-foreground">24/7</div>
              <div className="text-sm">Platform support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;