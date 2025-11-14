import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LedgerRecord {
  block_id: number;
  transaction_type: string;
  record_reference: number;
  data_hash: string;
  block_hash: string;
  timestamp?: string;
}

const Ledger = () => {
  const [ledger, setLedger] = useState<LedgerRecord[]>([]);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/ledger", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLedger(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ledger:", error);
    }
  };

  const getTransactionTypeVariant = (type: string) => {
    switch (type) {
      case "INCOMING":
        return "default";
      case "SALE":
        return "secondary";
      case "INVENTORY_UPDATE":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Blockchain Ledger
          </h1>
          <p className="text-muted-foreground">Complete blockchain transaction history</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ledger.length}</div>
              <p className="text-xs text-muted-foreground">Blockchain records</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ledger.length > 0 ? Math.max(...ledger.map((l) => l.block_id)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Block ID</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chain Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-lg font-bold text-accent">Active</span>
              </div>
              <p className="text-xs text-muted-foreground">Blockchain network</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Ledger</CardTitle>
            <CardDescription>
              Immutable record of all blockchain transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Record Ref</TableHead>
                  <TableHead>Data Hash</TableHead>
                  <TableHead>Block Hash</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map((record) => (
                  <TableRow key={record.block_id}>
                    <TableCell className="font-bold">{record.block_id}</TableCell>
                    <TableCell>
                      <Badge variant={getTransactionTypeVariant(record.transaction_type)}>
                        {record.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.record_reference}</TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {record.data_hash.substring(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-blockchain/10 text-blockchain px-2 py-1 rounded">
                        {record.block_hash.substring(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      {record.timestamp
                        ? new Date(record.timestamp).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-gradient-blockchain/5 border-blockchain/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              About the Blockchain Ledger
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              The blockchain ledger maintains an immutable record of all transactions in your
              pharmacy management system.
            </p>
            <p>
              Each block contains a cryptographic hash that links it to the previous block,
              creating a tamper-proof chain of records.
            </p>
            <p>
              This ensures complete transparency and auditability for incoming stock, sales, and
              inventory updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Ledger;
