import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'success';
}

const Button = ({ children, className, onClick, variant = 'default' }: ButtonProps) => {
    const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    let variantStyle = "";
    switch (variant) {
        case 'default': variantStyle = "bg-[#3e6c6c] text-white hover:bg-[#457C78] h-10 px-4 py-2"; break;
        case 'secondary': variantStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"; break;
        case 'outline': variantStyle = "border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2"; break;
        case 'ghost': variantStyle = "hover:bg-gray-100 h-10 px-4 py-2"; break;
        case 'link': variantStyle = "text-blue-600 underline-offset-4 hover:underline h-10 px-4 py-2"; break;
        case 'success': variantStyle = "bg-green-500 text-white hover:bg-green-600 px-3 py-1 text-xs"; break;
        default: variantStyle = "bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"; break;
    }
    return <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`}>{children}</button>;
};

interface DialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
            {/* Dialog Content */}
            <div className="relative z-50 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl animate-fade-in-scale">
                {children}
            </div>
            {/* Tailwind animations */}
            <style jsx>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

const DialogContent = ({ children, className }: DialogContentProps) => (
    <div className={className}>
        {children}
    </div>
);

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const DialogHeader = ({ children, className }: DialogHeaderProps) => (
    <div className={`flex flex-col space-y-2 text-center sm:text-left mb-6 ${className}`}>
        {children}
    </div>
);

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

const DialogTitle = ({ children, className }: DialogTitleProps) => (
    <h3 className={`text-2xl font-bold text-gray-900 ${className}`}>{children}</h3>
);

interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

const DialogDescription = ({ children, className }: DialogDescriptionProps) => (
    <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'vendor' | 'supplier') => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0"> {/* Remove default padding if you want custom layout */}
        <DialogHeader className="px-6 pt-6"> {/* Add padding back to header */}
          <DialogTitle>Choose Your Role</DialogTitle>
          <DialogDescription>
            Select whether you want to proceed as a Vendor or a Supplier.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"> {/* Add padding to content grid */}
          {/* As Vendor Section */}
          <div className="flex flex-col items-center justify-between p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">As Vendor</h4>
            <p className="text-center text-gray-600 mb-6 flex-grow">
              Manage your orders, track deliveries, and connect with suppliers for your needs.
            </p>
            <Button onClick={() => onSelectRole('vendor')} className="w-full">
              Continue as Vendor
            </Button>
          </div>

          {/* As Supplier Section */}
          <div className="flex flex-col items-center justify-between p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">As Supplier</h4>
            <p className="text-center text-gray-600 mb-6 flex-grow">
              Bid on bulk orders, manage your inventory, and track your payments.
            </p>
            <Button onClick={() => onSelectRole('supplier')} className="w-full">
              Continue as Supplier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
