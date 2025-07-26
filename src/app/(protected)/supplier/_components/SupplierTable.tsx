'use client'
import React, { useState } from 'react';

interface TableProps {
  children?: React.ReactNode;
  className?: string;
}

const Table = ({ children, className }: TableProps) => <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>;
const TableHeader = ({ children, className }: TableProps) => <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;
const TableBody = ({ children, className }: TableProps) => <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
const TableRow = ({ children, className }: TableProps) => <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr>;
const TableHead = ({ children, className }: TableProps) => <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
const TableCell = ({ children, className }: TableProps) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'blue' | 'yellow' | 'purple' | 'green' | 'red';
}

const Badge = ({ children, className, variant }: BadgeProps) => {
  const baseStyle = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  let variantStyle = "";
  switch (variant) {
    case 'default': variantStyle = "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"; break;
    case 'secondary': variantStyle = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"; break;
    case 'destructive': variantStyle = "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"; break;
    case 'outline': variantStyle = "text-foreground"; break;
    case 'blue': variantStyle = "bg-blue-200 text-blue-800"; break;
    case 'yellow': variantStyle = "bg-yellow-200 text-yellow-800"; break;
    case 'purple': variantStyle = "bg-purple-200 text-purple-800"; break;
    case 'green': variantStyle = "bg-green-200 text-green-800"; break;
    case 'red': variantStyle = "bg-red-200 text-red-800"; break;
    default: variantStyle = "bg-gray-200 text-gray-800"; break;
  }
  return <div className={`${baseStyle} ${variantStyle} ${className}`}>{children}</div>;
};

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
        case 'default': variantStyle = "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"; break;
        case 'secondary': variantStyle = "bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"; break;
        case 'outline': variantStyle = "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"; break;
        case 'ghost': variantStyle = "hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"; break;
        case 'link': variantStyle = "text-primary underline-offset-4 hover:underline h-10 px-4 py-2"; break;
        case 'success': variantStyle = "bg-green-500 text-white hover:bg-green-600 px-3 py-1 text-xs"; break;
        default: variantStyle = "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"; break;
    }
    return <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`}>{children}</button>;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

const Select = ({ value, onValueChange, children, className }: SelectProps) => (
    <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`p-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    >
        {children}
    </select>
);

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
}

const SelectItem = ({ value, children }: SelectItemProps) => <option value={value}>{children}</option>;


const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

interface Order {
    id: string;
    item: string;
    quantity: string;
    agreedPrice: number;
    status: 'Pending' | 'In Progress' | 'Ready for Pickup' | 'Delivered';
    payment: 'Paid' | 'Unpaid';
    grabDate: string;
}

const initialOrders: Order[] = [
    { id: 'ORD12345', item: 'Fresh Tomatoes', quantity: '500 kg', agreedPrice: 2800, status: 'In Progress', payment: 'Unpaid', grabDate: '2025-07-20' },
    { id: 'ORD12346', item: 'Rice Bags', quantity: '100 bags', agreedPrice: 4500, status: 'Ready for Pickup', payment: 'Paid', grabDate: '2025-07-18' },
    { id: 'ORD12347', item: 'Bananas', quantity: '200 kg', agreedPrice: 1200, status: 'Delivered', payment: 'Paid', grabDate: '2025-07-15' },
    { id: 'ORD12348', item: 'Milk Packets', quantity: '150 units', agreedPrice: 800, status: 'Pending', payment: 'Unpaid', grabDate: '2025-07-22' },
    { id: 'ORD12349', item: 'Onions', quantity: '300 kg', agreedPrice: 1750, status: 'In Progress', payment: 'Paid', grabDate: '2025-07-19' },
];

export default function SupplierTable() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const getStatusVariant = (status: Order['status']): BadgeProps['variant'] => {
        switch (status) {
            case 'Pending': return 'yellow';
            case 'In Progress': return 'blue';
            case 'Ready for Pickup': return 'purple';
            case 'Delivered': return 'green';
            default: return 'default';
        }
    };

    const getPaymentVariant = (payment: Order['payment']): BadgeProps['variant'] => {
        switch (payment) {
            case 'Paid': return 'green';
            case 'Unpaid': return 'red';
            default: return 'default';
        }
    };

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        alert(`Order ${orderId} status updated to: ${newStatus}`); 
    };

    const handleMarkPaid = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, payment: 'Paid' } : order
            )
        );
        alert(`Order ${orderId} marked as Paid.`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="overflow-x-auto">
                <Table className="min-w-full bg-white rounded-xl shadow-md">
                    <TableHeader className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <TableRow>
                            <TableHead className="py-3 px-6 text-left">ORDER ID</TableHead>
                            <TableHead className="py-3 px-6 text-left">ITEM</TableHead>
                            <TableHead className="py-3 px-6 text-left">QUANTITY</TableHead>
                            <TableHead className="py-3 px-6 text-left">AGREED PRICE</TableHead>
                            <TableHead className="py-3 px-6 text-left">STATUS</TableHead>
                            <TableHead className="py-3 px-6 text-left">PAYMENT</TableHead>
                            <TableHead className="py-3 px-6 text-left">GRAB DATE</TableHead>
                            <TableHead className="py-3 px-6 text-left">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-700 text-sm font-light">
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <TableCell className="py-3 px-6 text-left whitespace-nowrap">
                                    {order.id.substring(0, 7)}...
                                </TableCell>
                                <TableCell className="py-3 px-6 text-left">{order.item}</TableCell>
                                <TableCell className="py-3 px-6 text-left">{order.quantity}</TableCell>
                                <TableCell className="py-3 px-6 text-left">
                                    {formatCurrency(order.agreedPrice)}
                                </TableCell>
                                <TableCell className="py-3 px-6 text-left">
                                    <Badge variant={getStatusVariant(order.status)}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 px-6 text-left">
                                    <Badge variant={getPaymentVariant(order.payment)}>
                                        {order.payment}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 px-6 text-left">
                                    {formatDate(order.grabDate)}
                                </TableCell>
                                <TableCell className="py-3 px-6 text-left flex items-center space-x-2">
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                                    >
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                    </Select>
                                    {order.payment === 'Unpaid' && (
                                        <Button
                                            variant="success"
                                            onClick={() => handleMarkPaid(order.id)}
                                            className="ml-2"
                                        >
                                            Mark Paid
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
