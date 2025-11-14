import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/data/mockMedicines";
import { Package } from "lucide-react";

interface InventoryTableProps {
  medicines: Medicine[];
}

export function InventoryTable({ medicines }: InventoryTableProps) {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity < 1000) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 90) return { label: "Expiring Soon", variant: "destructive" as const };
    if (daysUntilExpiry < 180) return { label: "Monitor", variant: "secondary" as const };
    return { label: "Good", variant: "default" as const };
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Medicine Inventory</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Current stock levels and details</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Expiry Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((med) => {
              const stockStatus = getStockStatus(med.quantity);
              const expiryStatus = getExpiryStatus(med.expiryDate);
              return (
                <TableRow key={med.id}>
                  <TableCell className="font-mono text-sm">{med.id}</TableCell>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell className="font-bold">{med.quantity.toLocaleString()}</TableCell>
                  <TableCell>${med.price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(med.arrivalDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(med.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
