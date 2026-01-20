import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Car, Service, ServiceRecord, Payment } from "@/types/crpms";
import { carService, serviceService, recordService, paymentService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  cars: Car[];
  services: Service[];
  serviceRecords: ServiceRecord[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addCar: (car: Omit<Car, "id" | "createdAt">) => Promise<boolean>;
  addService: (service: Omit<Service, "id" | "code">) => Promise<boolean>;
  addServiceRecord: (record: Omit<ServiceRecord, "id" | "createdAt">) => Promise<boolean>;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => Promise<boolean>;
  deleteServiceRecord: (id: string) => Promise<boolean>;
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => Promise<boolean>;
  getCarById: (id: string) => Car | undefined;
  getServiceById: (id: string) => Service | undefined;
  getServiceRecordById: (id: string) => ServiceRecord | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Transform backend data to frontend types
const transformCar = (data: any): Car => ({
  id: String(data.carID),
  plateNumber: data.carPlate,
  type: data.carType,
  model: data.carModel,
  manufacturingYear: data.carYear,
  driverPhone: data.driverNum,
  mechanicName: data.mechName,
  createdAt: new Date(),
});

const transformService = (data: any): Service => ({
  id: String(data.servID),
  code: data.servCode,
  name: data.servName,
  price: data.servPrice,
});

const transformRecord = (data: any): ServiceRecord => ({
  id: String(data.recID),
  carId: String(data.carID),
  serviceId: String(data.servID),
  serviceDate: new Date(data.recDate),
  createdAt: new Date(data.created_at),
});

const transformPayment = (data: any): Payment => ({
  id: String(data.payID),
  serviceRecordId: String(data.recID),
  amountPaid: data.amount,
  paymentDate: new Date(data.payDate),
  createdAt: new Date(data.created_at),
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [carsRes, servicesRes, recordsRes, paymentsRes] = await Promise.all([
        carService.getAll(),
        serviceService.getAll(),
        recordService.getAll(),
        paymentService.getAll(),
      ]);

      if (carsRes.success && carsRes.data) {
        setCars(carsRes.data.map(transformCar));
      }
      if (servicesRes.success && servicesRes.data) {
        setServices(servicesRes.data.map(transformService));
      }
      if (recordsRes.success && recordsRes.data) {
        setServiceRecords(recordsRes.data.map(transformRecord));
      }
      if (paymentsRes.success && paymentsRes.data) {
        setPayments(paymentsRes.data.map(transformPayment));
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(errorMessage);
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = async () => {
    await fetchData();
  };

  const addCar = async (carData: Omit<Car, "id" | "createdAt">): Promise<boolean> => {
    try {
      const response = await carService.create({
        num: carData.plateNumber,
        type: carData.type,
        model: carData.model,
        year: carData.manufacturingYear,
        phone: carData.driverPhone,
        name: carData.mechanicName,
      });
      
      if (response.success) {
        toast({ title: "Success", description: "Car added successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to add car",
        variant: "destructive"
      });
      return false;
    }
  };

  const addService = async (serviceData: Omit<Service, "id" | "code">): Promise<boolean> => {
    try {
      const code = `SRV${String(services.length + 1).padStart(3, "0")}`;
      const response = await serviceService.create({
        code,
        name: serviceData.name,
        price: serviceData.price,
      });
      
      if (response.success) {
        toast({ title: "Success", description: "Service added successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to add service",
        variant: "destructive"
      });
      return false;
    }
  };

  const addServiceRecord = async (recordData: Omit<ServiceRecord, "id" | "createdAt">): Promise<boolean> => {
    try {
      const response = await recordService.create({
        servID: Number(recordData.serviceId),
        carID: Number(recordData.carId),
        recDate: recordData.serviceDate.toISOString().split('T')[0],
      });
      
      if (response.success) {
        toast({ title: "Success", description: "Service record created successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to create service record",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateServiceRecord = async (id: string, recordData: Partial<ServiceRecord>): Promise<boolean> => {
    try {
      const existingRecord = serviceRecords.find(r => r.id === id);
      if (!existingRecord) return false;

      const response = await recordService.update(Number(id), {
        servID: Number(recordData.serviceId || existingRecord.serviceId),
        carID: Number(recordData.carId || existingRecord.carId),
        recDate: (recordData.serviceDate || existingRecord.serviceDate).toISOString().split('T')[0],
      });
      
      if (response.success) {
        toast({ title: "Success", description: "Service record updated successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to update service record",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteServiceRecord = async (id: string): Promise<boolean> => {
    try {
      const response = await recordService.delete(Number(id));
      
      if (response.success) {
        toast({ title: "Success", description: "Service record deleted successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to delete service record",
        variant: "destructive"
      });
      return false;
    }
  };

  const addPayment = async (paymentData: Omit<Payment, "id" | "createdAt">): Promise<boolean> => {
    try {
      const response = await paymentService.create({
        recID: Number(paymentData.serviceRecordId),
        amount: paymentData.amountPaid,
        payDate: paymentData.paymentDate.toISOString().split('T')[0],
      });
      
      if (response.success) {
        toast({ title: "Success", description: "Payment recorded successfully" });
        await fetchData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to record payment",
        variant: "destructive"
      });
      return false;
    }
  };

  const getCarById = (id: string) => cars.find((car) => car.id === id);
  const getServiceById = (id: string) => services.find((service) => service.id === id);
  const getServiceRecordById = (id: string) => serviceRecords.find((record) => record.id === id);

  return (
    <DataContext.Provider
      value={{
        cars,
        services,
        serviceRecords,
        payments,
        loading,
        error,
        refreshData,
        addCar,
        addService,
        addServiceRecord,
        updateServiceRecord,
        deleteServiceRecord,
        addPayment,
        getCarById,
        getServiceById,
        getServiceRecordById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
