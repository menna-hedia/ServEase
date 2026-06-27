import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { ChevronLeft, ChevronRight, X, Clock, DollarSign, MapPin, Key } from 'lucide-react';
import { getCalendarAppointments } from './MyCalendarActions';

export default function MyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getCalendarAppointments();
      if (result.success) {
        setAppointments(result.data ?? []);
      } else {
        toast.error(result.error || 'Failed to load calendar');
      }
      setLoading(false);
    };
    load();
  }, []);

  const openDrawer = (apt: any) => {
    setSelectedAppointment(apt);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedAppointment(null), 350);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.dateNeeded?.startsWith(dateStr));
  };

  const getCustomerName = (customer: any) =>
    customer?.userName ||
    (customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : '—');

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

          {loading ? (
            <p className="text-center text-muted-foreground py-8 animate-pulse">Loading calendar...</p>
          ) : (
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
                  <div key={day} className="aspect-square rounded-lg p-1 hover:bg-muted transition-all">
                    <div className="text-sm font-medium mb-1">{day}</div>
                    {apts.length > 0 && (
                      <div className="space-y-1">
                        {apts.map((apt) => (
                          <button
                            key={apt._id || apt.id}
                            onClick={() => openDrawer(apt)}
                            className="w-full bg-purple-600 text-white text-xs px-1 py-0.5 rounded hover:bg-purple-600/90 transition-colors"
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
          )}
        </Card>
      </div>

      {/* ── Overlay ── */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? 'auto' : 'none',
        }}
      />

      {/* ── Drawer ── */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl overflow-y-auto"
        style={{
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {selectedAppointment && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

              {/* Customer */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedAppointment.customer?.profileURL || 'https://i.pravatar.cc/150?img=1'}
                  alt={getCustomerName(selectedAppointment.customer)}
                  className="w-16 h-16 rounded-full object-cover border-4 border-primary"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://i.pravatar.cc/150?img=1';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{getCustomerName(selectedAppointment.customer)}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.serviceNeeded}</p>
                </div>
                <Badge variant="confirmed">Confirmed</Badge>
              </div>

              <div className="h-px bg-border" />

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedAppointment.dateNeeded).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.startTime}
                      {selectedAppointment.endTime ? ` → ${selectedAppointment.endTime}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {[
                        selectedAppointment.exactLocation,
                        selectedAppointment.street,
                        selectedAppointment.city,
                        selectedAppointment.governorate,
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Price</p>
                    <p className="text-2xl font-bold text-primary">EGP {selectedAppointment.price}</p>
                  </div>
                </div>

                {selectedAppointment.completionCode && (
                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold mb-0.5">Completion Code</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 inline-block mt-1">
                        <span className="text-2xl font-bold tracking-widest text-blue-600">
                          {selectedAppointment.completionCode}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              <Link
                to={`/provider/requests/${selectedAppointment._id || selectedAppointment.id}`}
                state={{ request: selectedAppointment }}
              >
                <Button className="w-full" size="lg" onClick={closeDrawer}>
                  View Full Details
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
