import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface IncomingRecord {
  id: number;
  seller_name: string;
  product_id: string;
  product_name: string;
  quantity?: number;
  boxes_received?: number;
  tablets_per_box?: number;
  price: number;
  date_received?: string;
  blockchain_hash?: string;
}

const Incoming = () => {
  const [records, setRecords] = useState<IncomingRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    seller_name: "",
    product_id: "",
    product_name: "",
    boxes_received: "",
    tablets_per_box: "",
    price: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/incoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/incoming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          boxes_received: parseInt(formData.boxes_received),
          tablets_per_box: parseInt(formData.tablets_per_box),
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to add record");

      toast({
        title: "Success",
        description: "Incoming stock added and recorded on blockchain",
      });

      setOpen(false);
      setFormData({
        seller_name: "",
        product_id: "",
        product_name: "",
        boxes_received: "",
        tablets_per_box: "",
        price: "",
      });
      fetchRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add incoming stock",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              Incoming Stock
            </h1>
            <p className="text-muted-foreground">Manage incoming medicine inventory</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Incoming Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Incoming Stock</DialogTitle>
                <DialogDescription>Record new medicine stock arrival</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seller_name">Seller Name</Label>
                  <Input
                    id="seller_name"
                    value={formData.seller_name}
                    onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_id">Product ID</Label>
                    <Input
                      id="product_id"
                      value={formData.product_id}
                      onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boxes_received">Boxes Received</Label>
                    <Input
                      id="boxes_received"
                      type="number"
                      value={formData.boxes_received}
                      onChange={(e) => setFormData({ ...formData, boxes_received: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tablets_per_box">Tablets per Box</Label>
                    <Input
                      id="tablets_per_box"
                      type="number"
                      value={formData.tablets_per_box}
                      onChange={(e) => setFormData({ ...formData, tablets_per_box: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Stock"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incoming Stock Records</CardTitle>
            <CardDescription>All recorded incoming medicine stock</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Blockchain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.seller_name}</TableCell>
                    <TableCell className="font-mono text-sm">{record.product_id}</TableCell>
                    <TableCell>{record.product_name}</TableCell>
                    <TableCell>
                      {record.boxes_received && record.tablets_per_box
                        ? `${record.boxes_received} boxes × ${record.tablets_per_box}`
                        : record.quantity}
                    </TableCell>
                    <TableCell>${record.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {record.date_received
                        ? new Date(record.date_received).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {record.blockchain_hash ? (
                        <span className="text-xs font-mono text-accent">✓ Verified</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Incoming;
