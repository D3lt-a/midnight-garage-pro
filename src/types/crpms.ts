export interface Car {
  id: string;
  plateNumber: string;
  type: string;
  model: string;
  manufacturingYear: number;
  driverPhone: string;
  mechanicName: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  price: number;
}

export interface ServiceRecord {
  id: string;
  carId: string;
  serviceId: string;
  serviceDate: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  serviceRecordId: string;
  amountPaid: number;
  paymentDate: Date;
  createdAt: Date;
}
