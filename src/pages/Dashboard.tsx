
import { Users, Activity, CreditCard, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomerGrowthChart } from "@/components/dashboard/CustomerGrowthChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

const customerGrowthData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 140 },
  { name: "Mar", value: 130 },
  { name: "Apr", value: 170 },
  { name: "May", value: 220 },
  { name: "Jun", value: 250 },
  { name: "Jul", value: 290 },
  { name: "Aug", value: 310 },
  { name: "Sep", value: 350 },
  { name: "Oct", value: 370 },
  { name: "Nov", value: 390 },
  { name: "Dec", value: 410 },
];

const recentActivities = [
  {
    id: "1",
    user: {
      name: "John Doe",
      initials: "JD",
    },
    action: "closed a deal with",
    target: "Acme Inc.",
    date: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Sarah Chen",
      initials: "SC",
    },
    action: "scheduled a meeting with",
    target: "Tech Solutions",
    date: "5 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    action: "added a new lead",
    target: "Global Enterprises",
    date: "Yesterday",
  },
  {
    id: "4",
    user: {
      name: "Maria Garcia",
      initials: "MG",
    },
    action: "sent a proposal to",
    target: "Digital Innovators",
    date: "Yesterday",
  },
];

const upcomingTasks = [
  {
    id: "1",
    title: "Follow up with Tech Solutions",
    dueDate: "Today, 3:00 PM",
    priority: "high" as const,
    status: "pending" as const,
  },
  {
    id: "2",
    title: "Prepare proposal for New Horizons",
    dueDate: "Tomorrow, 12:00 PM",
    priority: "medium" as const,
    status: "in-progress" as const,
  },
  {
    id: "3",
    title: "Send contract to Acme Inc.",
    dueDate: "May 5, 2025",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: "4",
    title: "Client onboarding: Global Enterprises",
    dueDate: "May 7, 2025",
    priority: "low" as const,
    status: "completed" as const,
  },
];

export default function Dashboard() {
  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Here's what's happening with your CRM today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value="412"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Deals"
          value="27"
          icon={Activity}
          description="$342,500 total value"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value="$86,400"
          icon={CreditCard}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Conversion Rate"
          value="24.8%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerGrowthChart data={customerGrowthData} />
        <RecentActivities activities={recentActivities} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingTasks tasks={upcomingTasks} />
        <div className="lg:col-span-2 bg-muted/30 border rounded-lg p-4 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground mb-4">Our AI has analyzed your customer data and found opportunities to improve your business.</p>
            <div className="space-y-2 text-left">
              <div className="p-3 bg-background border rounded-lg">
                <p className="text-sm">Leads from social media have a 35% higher conversion rate than other sources.</p>
              </div>
              <div className="p-3 bg-background border rounded-lg">
                <p className="text-sm">Customers in the technology sector have the shortest sales cycle (avg. 14 days).</p>
              </div>
              <div className="p-3 bg-background border rounded-lg">
                <p className="text-sm">Your follow-up response time has improved by 28%, leading to 15% more closed deals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
