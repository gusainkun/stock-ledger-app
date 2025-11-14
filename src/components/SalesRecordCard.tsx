import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Plus } from "lucide-react";
import { Medicine } from "@/data/mockMedicines";
import { toast } from "sonner";

interface SalesRecordCardProps {
  medicines: Medicine[];
}

interface SaleRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  totalPrice: number;
  date: string;
}

export function SalesRecordCard({ medicines }: SalesRecordCardProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);

  const handleAddSale = () => {
    if (!selectedMedicine || !quantity || parseInt(quantity) <= 0) {
      toast.error("Please select a medicine and enter a valid quantity");
      return;
    }

    const medicine = medicines.find(m => m.id === selectedMedicine);
    if (!medicine) return;

    const saleQuantity = parseInt(quantity);
    if (saleQuantity > medicine.quantity) {
      toast.error("Insufficient stock available");
      return;
    }

    const newSale: SaleRecord = {
      id: `SALE${Date.now()}`,
      medicineId: medicine.id,
      medicineName: medicine.name,
      quantity: saleQuantity,
      totalPrice: medicine.price * saleQuantity,
      date: new Date().toISOString()
    };

    setSalesRecords([newSale, ...salesRecords]);
    setSelectedMedicine("");
    setQuantity("");
    toast.success("Sale recorded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle>Sales Records</CardTitle>
        </div>
        <CardDescription>Add new sales and view transaction history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="medicine">Medicine</Label>
            <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
              <SelectTrigger id="medicine">
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {medicines.map((med) => (
                  <SelectItem key={med.id} value={med.id}>
                    {med.name} (Stock: {med.quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddSale} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Sale
            </Button>
          </div>
        </div>

        {salesRecords.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Recent Sales</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRecords.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                      <TableCell className="font-medium">{sale.medicineName}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell className="font-bold">${sale.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
