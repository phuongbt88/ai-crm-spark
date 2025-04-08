
import { useState, useEffect } from "react";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerCard, Customer } from "@/components/customers/CustomerCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      const formattedCustomers = data.map((customer): Customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        company: customer.company || "",
        status: (customer.status as "active" | "inactive" | "lead") || "lead",
        lastContact: customer.last_contact ? new Date(customer.last_contact).toLocaleDateString() : undefined,
        initials: customer.initials || "",
        avatar: customer.avatar_url,
      }));
      
      setCustomers(formattedCustomers);
      setFilteredCustomers(formattedCustomers);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khách hàng:", error);
      toast({
        title: "Không thể tải danh sách khách hàng",
        description: "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng làm mới trang.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    
    const filtered = customers.filter((customer) => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.email.toLowerCase().includes(lowercaseQuery) ||
      customer.company.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredCustomers(filtered);
  };

  const handleCustomerAdded = () => {
    fetchCustomers();
  };
  
  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <CustomerFilters onSearch={handleSearch} onCustomerAdded={handleCustomerAdded} />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-6 animate-pulse h-60"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="ml-3 space-y-1 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10">
          <h3 className="text-lg font-medium">Không tìm thấy khách hàng</h3>
          <p className="text-muted-foreground mt-1">
            Không có khách hàng nào khớp với tìm kiếm của bạn.
          </p>
        </div>
      )}
    </div>
  );
}
