import { useState } from "react";
import { CreditCard, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

const Payments = () => {
  const {
    serviceRecords,
    payments,
    addPayment,
    getCarById,
    getServiceById,
    getServiceRecordById,
    loading,
  } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceRecordId: "",
    amountPaid: "",
    paymentDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.serviceRecordId || !formData.amountPaid || !formData.paymentDate) {
      return;
    }

    setIsSubmitting(true);
    const success = await addPayment({
      serviceRecordId: formData.serviceRecordId,
      amountPaid: parseFloat(formData.amountPaid),
      paymentDate: new Date(formData.paymentDate),
    });

    if (success) {
      setFormData({ serviceRecordId: "", amountPaid: "", paymentDate: "" });
    }
    setIsSubmitting(false);
  };

  // Auto-fill amount when service record is selected
  const handleRecordSelect = (recordId: string) => {
    const record = getServiceRecordById(recordId);
    if (record) {
      const service = getServiceById(record.serviceId);
      setFormData({
        ...formData,
        serviceRecordId: recordId,
        amountPaid: service?.price.toString() || "",
      });
    }
  };

  const totalPayments = payments.reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Record and track service payments</p>
        </div>

        {/* Total Revenue Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-success">
                  {totalPayments.toLocaleString()} RWF
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/10">
                <CreditCard className="h-8 w-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="h-5 w-5 text-primary" />
                Record Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="record">Service Record</Label>
                  <Select
                    value={formData.serviceRecordId}
                    onValueChange={handleRecordSelect}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select service record" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceRecords.map((record) => {
                        const car = getCarById(record.carId);
                        const service = getServiceById(record.serviceId);
                        return (
                          <SelectItem key={record.id} value={record.id}>
                            {car?.plateNumber} - {service?.name} (
                            {format(new Date(record.serviceDate), "MMM dd")})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Paid (RWF)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.amountPaid}
                    onChange={(e) =>
                      setFormData({ ...formData, amountPaid: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? "Recording..." : "Record Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">Car</TableHead>
                      <TableHead className="text-muted-foreground">Service</TableHead>
                      <TableHead className="text-muted-foreground">
                        Payment Date
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No payments recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => {
                        const record = getServiceRecordById(payment.serviceRecordId);
                        const car = record ? getCarById(record.carId) : null;
                        const service = record
                          ? getServiceById(record.serviceId)
                          : null;
                        return (
                          <TableRow
                            key={payment.id}
                            className="border-border hover:bg-secondary/30"
                          >
                            <TableCell className="font-medium text-foreground">
                              {car?.plateNumber || "Unknown"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {service?.name || "Unknown"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="text-right text-success font-semibold">
                              {payment.amountPaid.toLocaleString()} RWF
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
