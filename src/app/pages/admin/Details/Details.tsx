import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Mail, Phone, MapPin, Star,
    Briefcase, FileText, ShieldCheck, ShieldOff,
    CalendarDays, CreditCard, AlertTriangle, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { getDetails } from './DetailsActions';
import { getAllServices } from './../../shared/Services/ServicesActions';


const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
            <span className="text-muted-foreground shrink-0">{icon}</span>
            <span className="text-sm text-muted-foreground w-36 shrink-0">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function Details() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        const loadServices = async () => {
            const result = await getAllServices();
            if (result.success) setServices(result.data);
        };
        loadServices();
    }, []);

    const getServiceName = (serviceId: string) => {
        if (typeof serviceId === 'object') return (serviceId as any)?.name || '—';
        const found = services.find((s) => s._id === serviceId);
        return found?.name || serviceId || '—';
    };

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);
            const result = await getDetails(id);
            setLoading(false);
            if (result.success) {
                setUser(result.data);
            } else {
                toast.error(result.error || 'Failed to load user details');
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">User not found.</p>
                </div>
            </div>
        );
    }

    const isProvider = user.role === 'Provider';
    const fullName =
        user.fullName ||
        `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
        user.userName ||
        '—';

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="max-w-2xl mx-auto space-y-6">

                    {/* ── Header ── */}
                    <Card>
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={user.profileURL || DEFAULT_AVATAR}
                                alt={fullName}
                                className="w-28 h-28 rounded-full object-cover border-4 border-primary mb-4"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                                }}
                            />
                            <h1 className="text-2xl font-bold mb-1">{fullName}</h1>
                            <p className="text-muted-foreground text-sm mb-3">{user.email}</p>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Badge variant={isProvider ? 'completed' : 'pending'}>
                                    {user.role}
                                </Badge>
                                <Badge variant={user.isVerified ? 'completed' : 'refused'}>
                                    {user.isVerified ? 'Verified' : 'Not Verified'}
                                </Badge>
                                {user.isDeleted && (
                                    <Badge variant="refused">Deleted</Badge>
                                )}
                                {isProvider && user.adminApproved && (
                                    <Badge variant={user.adminApproved === 'Active' ? 'completed' : 'pending'}>
                                        {user.adminApproved}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* ── Personal Info ── */}
                    <Card>
                        <h2 className="text-lg font-semibold mb-3">Personal Information</h2>

                        {user.email && (
                            <InfoRow
                                icon={<Mail className="w-4 h-4" />}
                                label="Email"
                                value={user.email}
                            />
                        )}

                        {user.mobileNumber && (
                            <InfoRow
                                icon={<Phone className="w-4 h-4" />}
                                label="Mobile"
                                value={user.mobileNumber}
                            />
                        )}

                        {(user.city || user.state) && (
                            <InfoRow
                                icon={<MapPin className="w-4 h-4" />}
                                label="Location"
                                value={[user.city, user.state].filter(Boolean).join(', ')}
                            />
                        )}

                        {user.dob && (
                            <InfoRow
                                icon={<CalendarDays className="w-4 h-4" />}
                                label="Date of Birth"
                                value={new Date(user.dob).toLocaleDateString()}
                            />
                        )}

                        {user.age && (
                            <InfoRow
                                icon={<span className="text-sm">🎂</span>}
                                label="Age"
                                value={`${user.age} years`}
                            />
                        )}

                        {user.gender && (
                            <InfoRow
                                icon={<span className="text-sm">👤</span>}
                                label="Gender"
                                value={user.gender.charAt(0) + user.gender.slice(1).toLowerCase()}
                            />
                        )}

                        {user.isVerified !== undefined && (
                            <InfoRow
                                icon={
                                    user.isVerified
                                        ? <ShieldCheck className="w-4 h-4 text-green-500" />
                                        : <ShieldOff className="w-4 h-4 text-destructive" />
                                }
                                label="Verified"
                                value={
                                    <span className={user.isVerified ? 'text-green-600' : 'text-destructive'}>
                                        {user.isVerified ? 'Yes' : 'No'}
                                    </span>
                                }
                            />
                        )}

                        {user.createdAt && (
                            <InfoRow
                                icon={<CalendarDays className="w-4 h-4" />}
                                label="Joined"
                                value={new Date(user.createdAt).toLocaleDateString()}
                            />
                        )}
                    </Card>

                    {/* ── Provider Details ── */}
                    {isProvider && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-3">Provider Details</h2>

                            {user.service && (
                                <InfoRow
                                    icon={<Briefcase className="w-4 h-4" />}
                                    label="Service"
                                    value={getServiceName(user.service)}
                                />
                            )}

                            {user.hourPrice !== undefined && user.hourPrice !== null && (
                                <InfoRow
                                    icon={<Clock className="w-4 h-4" />}
                                    label="Hour Price"
                                    value={`${user.hourPrice} EGP/hr`}
                                />
                            )}

                            {user.nationalNumber && (
                                <InfoRow
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="National Number"
                                    value={user.nationalNumber}
                                />
                            )}

                            {user.averageRating > 0 && (
                                <InfoRow
                                    icon={<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                                    label="Rating"
                                    value={`${user.averageRating} (${user.reviewsCount} reviews)`}
                                />
                            )}

                            {user.debt !== undefined && (
                                <InfoRow
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Debt"
                                    value={
                                        <span className={user.debt > 0 ? 'text-destructive font-semibold' : ''}>
                                            {user.debt > 0 ? `EGP ${user.debt}` : 'No debt'}
                                        </span>
                                    }
                                />
                            )}

                            {user.providerCancelCount !== undefined && (
                                <InfoRow
                                    icon={<AlertTriangle className="w-4 h-4" />}
                                    label="Cancellations"
                                    value={
                                        <span className={user.providerCancelCount > 0 ? 'text-orange-500' : ''}>
                                            {user.providerCancelCount}
                                            {user.providerCancelFees > 0 && ` — EGP ${user.providerCancelFees} fees`}
                                        </span>
                                    }
                                />
                            )}

                            {user.specialization && (
                                <InfoRow
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Specialization"
                                    value={user.specialization}
                                />
                            )}

                            {user.writtenCv && (
                                <div className="pt-3">
                                    <p className="text-sm font-medium mb-1">CV</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/40 rounded-lg p-3">
                                        {user.writtenCv}
                                    </p>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* ── Account Status ── */}
                    {user.isDeleted && (
                        <Card className="border-destructive/40 bg-destructive/5">
                            <h2 className="text-lg font-semibold text-destructive mb-3">Account Status</h2>
                            <InfoRow
                                icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
                                label="Deleted At"
                                value={
                                    user.deletedAt
                                        ? new Date(user.deletedAt).toLocaleDateString()
                                        : 'Unknown'
                                }
                            />
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}