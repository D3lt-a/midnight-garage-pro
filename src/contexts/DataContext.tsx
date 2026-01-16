import React, { createContext, useContext, useState, ReactNode } from "react";
import { Car, Service, ServiceRecord, Payment } from "@/types/crpms";
import {
  mockCars,
  mockServices,
  mockServiceRecords,
  mockPayments,
} from "@/data/mockData";

interface DataContextType {
  cars: Car[];
  services: Service[];
  serviceRecords: ServiceRecord[];
  payments: Payment[];
  addCar: (car: Omit<Car, "id" | "createdAt">) => void;
  addService: (service: Omit<Service, "id" | "code">) => void;
  addServiceRecord: (record: Omit<ServiceRecord, "id" | "createdAt">) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void;
  getCarById: (id: string) => Car | undefined;
  getServiceById: (id: string) => Service | undefined;
  getServiceRecordById: (id: string) => ServiceRecord | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(mockServiceRecords);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const addCar = (carData: Omit<Car, "id" | "createdAt">) => {
    const newCar: Car = {
      ...carData,
      id: `car-${Date.now()}`,
      createdAt: new Date(),
    };
    setCars((prev) => [...prev, newCar]);
  };

  const addService = (serviceData: Omit<Service, "id" | "code">) => {
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      code: `SRV${String(services.length + 1).padStart(3, "0")}`,
    };
    setServices((prev) => [...prev, newService]);
  };

  const addServiceRecord = (recordData: Omit<ServiceRecord, "id" | "createdAt">) => {
    const newRecord: ServiceRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      createdAt: new Date(),
    };
    setServiceRecords((prev) => [...prev, newRecord]);
  };

  const updateServiceRecord = (id: string, recordData: Partial<ServiceRecord>) => {
    setServiceRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...recordData } : record
      )
    );
  };

  const deleteServiceRecord = (id: string) => {
    setServiceRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const addPayment = (paymentData: Omit<Payment, "id" | "createdAt">) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      createdAt: new Date(),
    };
    setPayments((prev) => [...prev, newPayment]);
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
