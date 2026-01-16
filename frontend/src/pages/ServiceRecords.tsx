import { useState } from "react";
import { ClipboardList, Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

const ServiceRecords = () => {
  const {
    cars,
    services,
    serviceRecords,
    addServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
    getCarById,
    getServiceById,
  } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    carId: "",
    serviceId: "",
    serviceDate: "",
  });

  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    carId: "",
    serviceId: "",
    serviceDate: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.carId || !formData.serviceId || !formData.serviceDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addServiceRecord({
      carId: formData.carId,
      serviceId: formData.serviceId,
      serviceDate: new Date(formData.serviceDate),
    });

    toast({
      title: "Success",
      description: "Service record added successfully",
    });

    setFormData({ carId: "", serviceId: "", serviceDate: "" });
  };

  const handleEdit = (recordId: string) => {
    const record = serviceRecords.find((r) => r.id === recordId);
    if (record) {
      setEditFormData({
        carId: record.carId,
        serviceId: record.serviceId,
        serviceDate: format(new Date(record.serviceDate), "yyyy-MM-dd"),
      });
      setEditingRecord(recordId);
    }
  };

  const handleEditSubmit = () => {
    if (!editingRecord) return;

    updateServiceRecord(editingRecord, {
      carId: editFormData.carId,
      serviceId: editFormData.serviceId,
      serviceDate: new Date(editFormData.serviceDate),
    });

    toast({
      title: "Success",
      description: "Service record updated successfully",
    });

    setEditingRecord(null);
  };

  const handleDeleteClick = (recordId: string) => {
    setRecordToDelete(recordId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      deleteServiceRecord(recordToDelete);
      toast({
        title: "Deleted",
        description: "Service record deleted successfully",
      });
    }
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Records</h1>
          <p className="text-muted-foreground">
            Track and manage car service history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Record Form */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="h-5 w-5 text-primary" />
                New Service Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="car">Select Car</Label>
                  <Select
                    value={formData.carId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, carId: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select a car" />
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

                <div className="space-y-2">
                  <Label htmlFor="service">Select Service</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceId: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.price.toLocaleString()} RWF)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Service Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceDate: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Service History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">Car</TableHead>
                      <TableHead className="text-muted-foreground">Service</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Price
                      </TableHead>
                      <TableHead className="text-muted-foreground text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceRecords.map((record) => {
                      const car = getCarById(record.carId);
                      const service = getServiceById(record.serviceId);
                      return (
                        <TableRow
                          key={record.id}
                          className="border-border hover:bg-secondary/30"
                        >
                          <TableCell className="font-medium text-foreground">
                            {car?.plateNumber || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {service?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(record.serviceDate), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="text-right text-primary">
                            {service?.price.toLocaleString()} RWF
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record.id)}
                                className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(record.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Service Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Car</Label>
              <Select
                value={editFormData.carId}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, carId: value })
                }
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select a car" />
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

            <div className="space-y-2">
              <Label>Select Service</Label>
              <Select
                value={editFormData.serviceId}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, serviceId: value })
                }
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.price.toLocaleString()} RWF)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Date</Label>
              <Input
                type="date"
                value={editFormData.serviceDate}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, serviceDate: e.target.value })
                }
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRecord(null)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="gradient-primary text-primary-foreground"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Service Record
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this service record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ServiceRecords;
