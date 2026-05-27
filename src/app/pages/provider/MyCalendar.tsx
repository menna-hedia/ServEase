import { useState } from 'react';
import { Link } from 'react-router';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ChevronLeft, ChevronRight, X, Clock, DollarSign, MapPin, User } from 'lucide-react';

const appointments = [
  {
    id: 1,
    date: '2026-05-16',
    customer: 'James Wilson',
    customerPhoto: 'https://i.pravatar.cc/150?img=15',
    service: 'Electrician',
    startTime: '10:00',
    endTime: '15:00',
    price: 300,
    status: 'confirmed' as const,
    description: 'Build custom bookshelf',
    location: 'New York, NY',
  },
  {
    id: 2,
    date: '2026-05-18',
    customer: 'Mike Chen',
    customerPhoto: 'https://i.pravatar.cc/150?img=12',
    service: 'Electrician',
    startTime: '14:00',
    endTime: '16:00',
    price: 200,
    status: 'confirmed' as const,
    description: 'Install ceiling fan in bedroom',
    location: 'New York, NY',
  },
  {
    id: 3,
    date: '2026-05-20',
    customer: 'Sarah Johnson',
    customerPhoto: 'https://i.pravatar.cc/150?img=1',
    service: 'Electrician',
    startTime: '09:00',
    endTime: '11:00',
    price: 150,
    status: 'confirmed' as const,
    description: 'Fix electrical outlet in kitchen',
    location: 'New York, NY',
  },
];

export default function MyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 15));
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasAppointment = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.some(apt => apt.date === dateStr);
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Calendar</h1>
          <p className="text-muted-foreground">View and manage your scheduled appointments</p>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const apts = getAppointmentsForDate(day);

              return (
                <div
                  key={day}
                  className="aspect-square rounded-lg p-1 hover:bg-muted transition-all"
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  {apts.length > 0 && (
                    <div className="space-y-1">
                      {apts.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="w-full bg-primary text-white text-xs px-1 py-0.5 rounded hover:bg-primary/90 transition-colors"
                        >
                          {apt.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Appointment Drawer */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedAppointment(null)}
            />
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <Card>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedAppointment.customerPhoto}
                      alt={selectedAppointment.customer}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedAppointment.customer}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.service}</p>
                    </div>
                    <Badge variant={selectedAppointment.status}>
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-sm text-muted-foreground">{selectedAppointment.customer}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedAppointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedAppointment.startTime} - {selectedAppointment.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{selectedAppointment.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-xl font-bold text-primary">${selectedAppointment.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Service Description</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.description}</p>
                  </div>
                </Card>

                <Link to={`/provider/requests/${selectedAppointment.id}`}>
                  <Button className="w-full" size="lg">
                    View Request Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
