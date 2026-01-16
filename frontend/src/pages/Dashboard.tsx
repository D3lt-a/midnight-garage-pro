import { Car, Wrench, ClipboardList, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

const Dashboard = () => {
  const { cars, services, serviceRecords, payments, getCarById, getServiceById } = useData();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const recentRecords = serviceRecords.slice(-5).reverse();

  const stats = [
    {
      title: "Total Cars",
      value: cars.length,
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Services Available",
      value: services.length,
      icon: Wrench,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Service Records",
      value: serviceRecords.length,
      icon: ClipboardList,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} RWF`,
      icon: CreditCard,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your garage management overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Service Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecords.length > 0 ? (
                  recentRecords.map((record) => {
                    const car = getCarById(record.carId);
                    const service = getServiceById(record.serviceId);
                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {car?.plateNumber || "Unknown Car"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {service?.name || "Unknown Service"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">
                            {service?.price.toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(record.serviceDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent service records
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-success" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(-5).reverse().map((payment) => {
                  const record = serviceRecords.find(
                    (r) => r.id === payment.serviceRecordId
                  );
                  const car = record ? getCarById(record.carId) : null;
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {car?.plateNumber || "Unknown Car"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <p className="text-success font-semibold">
                        +{payment.amountPaid.toLocaleString()} RWF
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
