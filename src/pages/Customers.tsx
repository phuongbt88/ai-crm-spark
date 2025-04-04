
import { useState } from "react";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerCard, Customer } from "@/components/customers/CustomerCard";

const customerData: Customer[] = [
  {
    id: "1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    status: "active",
    lastContact: "2 days ago",
    initials: "JC",
  },
  {
    id: "2",
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "+1 (555) 234-5678",
    company: "Global Tech",
    status: "lead",
    initials: "RF",
  },
  {
    id: "3",
    name: "Esther Howard",
    email: "esther.howard@example.com",
    phone: "+1 (555) 345-6789",
    company: "Innovate Solutions",
    status: "active",
    lastContact: "1 week ago",
    initials: "EH",
  },
  {
    id: "4",
    name: "Darlene Robertson",
    email: "darlene.robertson@example.com",
    phone: "+1 (555) 456-7890",
    company: "Tech Dynamics",
    status: "inactive",
    lastContact: "3 weeks ago",
    initials: "DR",
  },
  {
    id: "5",
    name: "Guy Hawkins",
    email: "guy.hawkins@example.com",
    phone: "+1 (555) 567-8901",
    company: "Future Enterprises",
    status: "active",
    lastContact: "Yesterday",
    initials: "GH",
  },
  {
    id: "6",
    name: "Brooklyn Simmons",
    email: "brooklyn.simmons@example.com",
    phone: "+1 (555) 678-9012",
    company: "Digital Frontiers",
    status: "lead",
    initials: "BS",
  },
  {
    id: "7",
    name: "Cameron Williamson",
    email: "cameron.williamson@example.com",
    phone: "+1 (555) 789-0123",
    company: "Bright Systems",
    status: "active",
    lastContact: "3 days ago",
    initials: "CW",
  },
  {
    id: "8",
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    phone: "+1 (555) 890-1234",
    company: "Neo Technologies",
    status: "inactive",
    lastContact: "1 month ago",
    initials: "LA",
  },
];

export default function Customers() {
  const [filteredCustomers, setFilteredCustomers] = useState(customerData);
  
  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    if (!query.trim()) {
      setFilteredCustomers(customerData);
      return;
    }
    
    const filtered = customerData.filter((customer) => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.email.toLowerCase().includes(lowercaseQuery) ||
      customer.company.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredCustomers(filtered);
  };
  
  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <CustomerFilters onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
