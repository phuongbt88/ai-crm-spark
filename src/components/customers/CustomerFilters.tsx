
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";

interface CustomerFiltersProps {
  onSearch: (query: string) => void;
}

export function CustomerFilters({ onSearch }: CustomerFiltersProps) {
  return (
    <div className="bg-background border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Customers</h2>
        <span className="bg-muted rounded-full px-2 py-0.5 text-xs">210</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-8" 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
