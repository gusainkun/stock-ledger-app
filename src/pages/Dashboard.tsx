import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Database, TrendingUp, Shield, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mockMedicines } from "@/data/mockMedicines";
import { InventoryTable } from "@/components/InventoryTable";
import { SalesRecordCard } from "@/components/SalesRecordCard";

interface Stats {
  totalIncoming: number;
  totalSales: number;
  inventoryItems: number;
  blockchainRecords: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalIncoming: 0,
    totalSales: 0,
    inventoryItems: 0,
    blockchainRecords: 0,
  });

  useEffect(() => {
    // Use mock data for statistics
    setStats({
      totalIncoming: 12,
      totalSales: mockMedicines.reduce((sum, med) => sum + med.sales, 0),
      inventoryItems: mockMedicines.length,
      blockchainRecords: 45,
    });
  }, []);

  const statCards = [
    {
      title: "Incoming Stock",
      value: stats.totalIncoming,
      description: "Total incoming records",
      icon: Package,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Sales Records",
      value: stats.totalSales,
      description: "Total sales transactions",
      icon: ShoppingCart,
      gradient: "bg-gradient-success",
    },
    {
      title: "Inventory Items",
      value: stats.inventoryItems,
      description: "Products in stock",
      icon: Database,
      gradient: "bg-primary",
    },
    {
      title: "Blockchain Records",
      value: stats.blockchainRecords,
      description: "Verified transactions",
      icon: Shield,
      gradient: "bg-gradient-blockchain",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your pharmacy management system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="overflow-hidden transition-all hover:shadow-lg animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.gradient}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <SalesRecordCard medicines={mockMedicines} />

        <InventoryTable medicines={mockMedicines} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
