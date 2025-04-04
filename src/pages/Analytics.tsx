
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

const salesData = [
  { name: "Jan", value: 25000 },
  { name: "Feb", value: 32000 },
  { name: "Mar", value: 35000 },
  { name: "Apr", value: 30000 },
  { name: "May", value: 40000 },
  { name: "Jun", value: 42000 },
];

const leadSourceData = [
  { name: "Website", value: 30 },
  { name: "Referral", value: 25 },
  { name: "Social", value: 20 },
  { name: "Email", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = ["#8B5CF6", "#6366F1", "#4F46E5", "#4338CA", "#3730A3"];

const customerActivityData = [
  { name: "Mon", meetings: 5, calls: 8, emails: 12 },
  { name: "Tue", meetings: 7, calls: 6, emails: 15 },
  { name: "Wed", meetings: 3, calls: 7, emails: 10 },
  { name: "Thu", meetings: 6, calls: 9, emails: 13 },
  { name: "Fri", meetings: 8, calls: 5, emails: 11 },
];

export default function Analytics() {
  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Revenue"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Customer Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerActivityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb" }}
                  />
                  <Legend />
                  <Bar dataKey="meetings" name="Meetings" fill="#8B5CF6" />
                  <Bar dataKey="calls" name="Calls" fill="#60A5FA" />
                  <Bar dataKey="emails" name="Emails" fill="#34D399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
