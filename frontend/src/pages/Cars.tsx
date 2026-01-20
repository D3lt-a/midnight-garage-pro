import { useState } from "react";
import { Car, Plus, Loader2 } from "lucide-react";
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

const carTypes = ["Sedan", "SUV", "Pickup", "Hatchback", "Van", "Truck", "Coupe"];

const Cars = () => {
  const { cars, addCar, loading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    type: "",
    model: "",
    manufacturingYear: "",
    driverPhone: "",
    mechanicName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.plateNumber || !formData.type || !formData.model) {
      return;
    }

    setIsSubmitting(true);
    const success = await addCar({
      plateNumber: formData.plateNumber,
      type: formData.type,
      model: formData.model,
      manufacturingYear: parseInt(formData.manufacturingYear) || new Date().getFullYear(),
      driverPhone: formData.driverPhone,
      mechanicName: formData.mechanicName,
    });

    if (success) {
      setFormData({
        plateNumber: "",
        type: "",
        model: "",
        manufacturingYear: "",
        driverPhone: "",
        mechanicName: "",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cars</h1>
          <p className="text-muted-foreground">Register and manage vehicles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Form */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="h-5 w-5 text-primary" />
                Register New Car
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number *</Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., RAB 123A"
                    value={formData.plateNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, plateNumber: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Car Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {carTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Toyota Corolla"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Manufacturing Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.manufacturingYear}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturingYear: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Driver Phone</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +250788123456"
                    value={formData.driverPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPhone: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mechanic">Mechanic Name</Label>
                  <Input
                    id="mechanic"
                    placeholder="Assigned mechanic"
                    value={formData.mechanicName}
                    onChange={(e) =>
                      setFormData({ ...formData, mechanicName: e.target.value })
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
                    <Car className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? "Registering..." : "Register Car"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Cars Table */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Registered Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">Plate</TableHead>
                      <TableHead className="text-muted-foreground">Type</TableHead>
                      <TableHead className="text-muted-foreground">Model</TableHead>
                      <TableHead className="text-muted-foreground">Year</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Mechanic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : cars.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No cars registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      cars.map((car) => (
                        <TableRow
                          key={car.id}
                          className="border-border hover:bg-secondary/30"
                        >
                          <TableCell className="font-medium text-foreground">
                            {car.plateNumber}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {car.type}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {car.model}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {car.manufacturingYear}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {car.driverPhone}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {car.mechanicName}
                          </TableCell>
                        </TableRow>
                      ))
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

export default Cars;
