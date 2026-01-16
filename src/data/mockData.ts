import { Car, Service, ServiceRecord, Payment } from "@/types/crpms";

export const mockCars: Car[] = [
  {
    id: "car-1",
    plateNumber: "RAB 123A",
    type: "Sedan",
    model: "Toyota Corolla",
    manufacturingYear: 2020,
    driverPhone: "+250788123456",
    mechanicName: "John Mugabo",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "car-2",
    plateNumber: "RAC 456B",
    type: "SUV",
    model: "Honda CR-V",
    manufacturingYear: 2019,
    driverPhone: "+250788234567",
    mechanicName: "Peter Habimana",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "car-3",
    plateNumber: "RAD 789C",
    type: "Pickup",
    model: "Ford Ranger",
    manufacturingYear: 2021,
    driverPhone: "+250788345678",
    mechanicName: "John Mugabo",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "car-4",
    plateNumber: "RAE 012D",
    type: "Hatchback",
    model: "Volkswagen Golf",
    manufacturingYear: 2018,
    driverPhone: "+250788456789",
    mechanicName: "Eric Uwimana",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "car-5",
    plateNumber: "RAF 345E",
    type: "Sedan",
    model: "Mercedes C-Class",
    manufacturingYear: 2022,
    driverPhone: "+250788567890",
    mechanicName: "Peter Habimana",
    createdAt: new Date("2024-02-15"),
  },
];

export const mockServices: Service[] = [
  { id: "srv-1", code: "SRV001", name: "Oil Change", price: 25000 },
  { id: "srv-2", code: "SRV002", name: "Brake Repair", price: 75000 },
  { id: "srv-3", code: "SRV003", name: "Tire Rotation", price: 15000 },
  { id: "srv-4", code: "SRV004", name: "Engine Tune-up", price: 120000 },
  { id: "srv-5", code: "SRV005", name: "Wheel Alignment", price: 35000 },
  { id: "srv-6", code: "SRV006", name: "Battery Replacement", price: 85000 },
  { id: "srv-7", code: "SRV007", name: "Transmission Service", price: 150000 },
  { id: "srv-8", code: "SRV008", name: "Air Filter Replacement", price: 20000 },
  { id: "srv-9", code: "SRV009", name: "Coolant Flush", price: 45000 },
  { id: "srv-10", code: "SRV010", name: "Spark Plug Replacement", price: 30000 },
];

export const mockServiceRecords: ServiceRecord[] = [
  {
    id: "rec-1",
    carId: "car-1",
    serviceId: "srv-1",
    serviceDate: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "rec-2",
    carId: "car-1",
    serviceId: "srv-3",
    serviceDate: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "rec-3",
    carId: "car-2",
    serviceId: "srv-2",
    serviceDate: new Date("2024-03-05"),
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "rec-4",
    carId: "car-3",
    serviceId: "srv-4",
    serviceDate: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "rec-5",
    carId: "car-4",
    serviceId: "srv-6",
    serviceDate: new Date("2024-03-12"),
    createdAt: new Date("2024-03-12"),
  },
];

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    serviceRecordId: "rec-1",
    amountPaid: 25000,
    paymentDate: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "pay-2",
    serviceRecordId: "rec-2",
    amountPaid: 15000,
    paymentDate: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "pay-3",
    serviceRecordId: "rec-3",
    amountPaid: 75000,
    paymentDate: new Date("2024-03-06"),
    createdAt: new Date("2024-03-06"),
  },
  {
    id: "pay-4",
    serviceRecordId: "rec-4",
    amountPaid: 120000,
    paymentDate: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
  },
];
