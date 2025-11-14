import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Database, TrendingUp, Shield, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

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
    // Fetch dashboard statistics
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      
      try {
        // Fetch all data in parallel
        const [incomingRes, salesRes, inventoryRes, ledgerRes] = await Promise.all([
          fetch("http://localhost:8000/api/incoming", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/sales", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/inventory", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/ledger", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const incoming = await incomingRes.json();
        const sales = await salesRes.json();
        const inventory = await inventoryRes.json();
        const ledger = await ledgerRes.json();

        setStats({
          totalIncoming: Array.isArray(incoming) ? incoming.length : 0,
          totalSales: Array.isArray(sales) ? sales.length : 0,
          inventoryItems: Array.isArray(inventory) ? inventory.length : 0,
          blockchainRecords: Array.isArray(ledger) ? ledger.length : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
              <CardDescription>Current system health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Connection</span>
                <span className="flex items-center gap-2 text-sm text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blockchain Network</span>
                <span className="flex items-center gap-2 text-sm text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Services</span>
                <span className="flex items-center gap-2 text-sm text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                  Operational
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/incoming"
                className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-medium text-sm">Add Incoming Stock</p>
                <p className="text-xs text-muted-foreground">Record new medicine arrivals</p>
              </a>
              <a
                href="/sales"
                className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-medium text-sm">Record Sale</p>
                <p className="text-xs text-muted-foreground">Process new transactions</p>
              </a>
              <a
                href="/verify"
                className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-medium text-sm">Verify Transaction</p>
                <p className="text-xs text-muted-foreground">Check blockchain records</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
