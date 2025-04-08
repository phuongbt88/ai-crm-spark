
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { supabase } from "@/integrations/supabase/client";

interface CustomerFiltersProps {
  onSearch: (query: string) => void;
  onCustomerAdded?: () => void;
  onFilterChange?: (status: string) => void;
}

export function CustomerFilters({ 
  onSearch, 
  onCustomerAdded,
  onFilterChange 
}: CustomerFiltersProps) {
  const [customerCount, setCustomerCount] = useState<number>(0);
  
  useEffect(() => {
    const fetchCustomerCount = async () => {
      const { count, error } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      
      if (error) {
        console.error("Error fetching customer count:", error);
        return;
      }
      
      setCustomerCount(count || 0);
    };
    
    fetchCustomerCount();
  }, []);
  
  const handleStatusChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <div className="bg-background border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Khách hàng</h2>
        <span className="bg-muted rounded-full px-2 py-0.5 text-xs">{customerCount}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm khách hàng..." 
            className="pl-8" 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all" onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="lead">Tiềm năng</SelectItem>
            </SelectContent>
          </Select>
          
          <AddCustomerDialog onCustomerAdded={onCustomerAdded || (() => {})} />
        </div>
      </div>
    </div>
  );
}
