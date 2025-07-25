import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">VendorConnect</div>
            <p className="text-background/80 text-sm leading-relaxed">
              Empowering street food vendors through collective purchasing. 
              Building a transparent and efficient supply chain for India&apos;s food ecosystem.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">For Vendors</a></li>
              <li><a href="#" className="hover:text-background transition-colors">For Suppliers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-background/80">
              <p>contact@vendorconnect.in</p>
              <p>Built for Hackathon 2025</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/60">
            © 2025 VendorConnect. All rights reserved. | 
            <a href="#" className="hover:text-background transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-background transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;