import { useState } from "react";
import { BarChart3, FileText, Calendar, Printer } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { format, isSameDay, parseISO } from "date-fns";

const Reports = () => {
  const {
    cars,
    services,
    serviceRecords,
    payments,
    getCarById,
    getServiceById,
    getServiceRecordById,
  } = useData();

  const [reportDate, setReportDate] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");

  // Filter payments by date for daily report
  const filteredPayments = reportDate
    ? payments.filter((payment) =>
        isSameDay(new Date(payment.paymentDate), parseISO(reportDate))
      )
    : payments;

  // Get service records for selected car (for bill generation)
  const carServiceRecords = selectedCarId
    ? serviceRecords.filter((record) => record.carId === selectedCarId)
    : [];

  const selectedCar = selectedCarId ? getCarById(selectedCarId) : null;

  // Calculate bill total
  const billTotal = carServiceRecords.reduce((sum, record) => {
    const service = getServiceById(record.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  // Get today's date for bill
  const today = format(new Date(), "MMMM dd, yyyy");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            View daily reports and generate bills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Report Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                Daily Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportDate">Select Date</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="bg-secondary border-border max-w-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">Car</TableHead>
                      <TableHead className="text-muted-foreground">Service</TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => {
                        const record = getServiceRecordById(
                          payment.serviceRecordId
                        );
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
                            <TableCell className="text-right text-success">
                              {payment.amountPaid.toLocaleString()} RWF
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(
                                new Date(payment.paymentDate),
                                "MMM dd, yyyy"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-8"
                        >
                          {reportDate
                            ? "No payments found for this date"
                            : "Select a date to view daily report"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredPayments.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-xl font-bold text-success">
                    {filteredPayments
                      .reduce((sum, p) => sum + p.amountPaid, 0)
                      .toLocaleString()}{" "}
                    RWF
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bill Generation Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-accent" />
                Bill Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Car</Label>
                <Select value={selectedCarId} onValueChange={setSelectedCarId}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select a car to generate bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.plateNumber} - {car.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCar && (
                <div className="mt-4 p-6 rounded-lg border border-border bg-secondary/30">
                  {/* Bill Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-foreground">CRPMS</h3>
                    <p className="text-sm text-muted-foreground">
                      Car Repair Payment Management System
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Service Invoice
                    </p>
                  </div>

                  <Separator className="bg-border mb-4" />

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer:</p>
                      <p className="font-medium text-foreground">
                        {selectedCar.driverPhone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Date:</p>
                      <p className="font-medium text-foreground">{today}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicle:</p>
                      <p className="font-medium text-foreground">
                        {selectedCar.plateNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Model:</p>
                      <p className="font-medium text-foreground">
                        {selectedCar.model}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-border mb-4" />

                  {/* Services List */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Services:
                    </p>
                    {carServiceRecords.length > 0 ? (
                      carServiceRecords.map((record) => {
                        const service = getServiceById(record.serviceId);
                        return (
                          <div
                            key={record.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-foreground">
                              {service?.name || "Unknown Service"}
                            </span>
                            <span className="text-muted-foreground">
                              {service?.price.toLocaleString()} RWF
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No services recorded for this vehicle
                      </p>
                    )}
                  </div>

                  <Separator className="bg-border mb-4" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-gradient">
                      {billTotal.toLocaleString()} RWF
                    </span>
                  </div>

                  {/* Print Button */}
                  <Button
                    className="w-full mt-6 gradient-primary text-primary-foreground"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Bill
                  </Button>
                </div>
              )}

              {!selectedCarId && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a car to generate its service bill</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
