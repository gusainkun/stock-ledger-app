import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Verify = () => {
  const [transactionType, setTransactionType] = useState("");
  const [recordId, setRecordId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerificationResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/verify/${transactionType}/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      setVerificationResult(data);

      if (data.verified) {
        toast({
          title: "Verification Successful",
          description: "Transaction is verified on the blockchain",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Transaction could not be verified",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-blockchain" />
            Blockchain Verification
          </h1>
          <p className="text-muted-foreground">Verify transactions on the blockchain</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify Transaction</CardTitle>
            <CardDescription>
              Enter transaction details to verify its authenticity on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transaction_type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOMING">Incoming Stock</SelectItem>
                    <SelectItem value="SALE">Sale Record</SelectItem>
                    <SelectItem value="INVENTORY_UPDATE">Inventory Update</SelectItem>
                    <SelectItem value="MONTHLY_SALES_SUMMARY">Monthly Sales Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="record_id">Record ID</Label>
                <Input
                  id="record_id"
                  type="number"
                  placeholder="Enter record ID"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !transactionType}>
                {loading ? "Verifying..." : "Verify on Blockchain"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {verificationResult && (
          <Card className="border-2 border-blockchain/20 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationResult.verified ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    Verification Successful
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" />
                    Verification Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                className={
                  verificationResult.verified
                    ? "bg-accent/10 border-accent"
                    : "bg-destructive/10 border-destructive"
                }
              >
                <AlertDescription>
                  {verificationResult.verified
                    ? "This transaction has been verified and exists on the blockchain."
                    : verificationResult.message || "This transaction could not be verified on the blockchain."}
                </AlertDescription>
              </Alert>

              {verificationResult.block_hash && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Block Hash</p>
                    <p className="text-xs font-mono break-all text-foreground">
                      {verificationResult.block_hash}
                    </p>
                  </div>
                  {verificationResult.block_id && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Block ID</p>
                      <p className="text-sm font-mono text-foreground">
                        {verificationResult.block_id}
                      </p>
                    </div>
                  )}
                  {verificationResult.timestamp && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                      <p className="text-sm text-foreground">
                        {new Date(verificationResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {verificationResult.note && (
                <Alert>
                  <AlertDescription>{verificationResult.note}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-blockchain/5 border-blockchain/20">
          <CardHeader>
            <CardTitle className="text-sm">How Blockchain Verification Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Each transaction is recorded with a unique cryptographic hash on the blockchain
            </p>
            <p>• The hash ensures data integrity and prevents tampering</p>
            <p>• Verification checks if the transaction exists and matches the blockchain record</p>
            <p>• This provides an immutable audit trail for all pharmacy operations</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Verify;
