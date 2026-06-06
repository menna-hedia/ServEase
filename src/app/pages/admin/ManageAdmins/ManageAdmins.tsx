import { useState, useEffect } from 'react';
import { Plus, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  searchAdmins,
} from './ManageAdminActions';

interface Admin {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: string;
  profileImage?: string;
  profileURL?: string;
  isVerified?: boolean;
  createdAt?: string;
}

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

export default function ManageAdmins() {
  const [admins, setAdmins]               = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm]       = useState('');
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [loading, setLoading]             = useState(true);
  const [isCreating, setIsCreating]       = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    firstName:       '',
    lastName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });

  // ============ FETCH (search or all) ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const result = searchTerm.trim()
        ? await searchAdmins(searchTerm)
        : await getAllAdmins();

      setLoading(false);

      if (result.success) {
        setAdmins(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error(result.error || 'Failed to load admins');
        setAdmins([]);
      }
    };

    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const reloadAdmins = async () => {
    setLoading(true);
    const result = searchTerm.trim()
      ? await searchAdmins(searchTerm)
      : await getAllAdmins();
    setLoading(false);
    if (result.success) {
      setAdmins(Array.isArray(result.data) ? result.data : []);
    }
  };

  // ============ VALIDATE ============
  const validateForm = (): boolean => {
    if (!newAdmin.firstName.trim()) { toast.error('First name is required'); return false; }
    if (!newAdmin.lastName.trim())  { toast.error('Last name is required');  return false; }
    if (!newAdmin.email.trim())     { toast.error('Email is required');      return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      toast.error('Please enter a valid email'); return false;
    }
    if (!newAdmin.password)                               { toast.error('Password is required');          return false; }
    if (newAdmin.password.length < 8)                     { toast.error('Password must be at least 8 characters'); return false; }
    if (newAdmin.password !== newAdmin.confirmPassword)   { toast.error('Passwords do not match');        return false; }
    return true;
  };

  // ============ ADD ============
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsCreating(true);
    const result = await createAdmin({
      firstName: newAdmin.firstName,
      lastName:  newAdmin.lastName,
      email:     newAdmin.email,
      password:  newAdmin.password,
    });
    setIsCreating(false);

    if (result.success) {
      toast.success(result.message || 'Admin added successfully');
      setShowAddModal(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
      await reloadAdmins();
    } else {
      toast.error(result.error || 'Failed to add admin');
    }
  };

  // ============ DELETE ============
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    const adminId = adminToDelete.id || adminToDelete._id;
    if (!adminId) { toast.error('Invalid admin ID'); return; }

    setIsDeleting(true);
    const result = await deleteAdmin(adminId);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Admin deleted successfully');
      setShowDeleteModal(false);
      setAdminToDelete(null);
      await reloadAdmins();
    } else {
      toast.error(result.error || 'Failed to delete admin');
    }
  };

  const getAdminName = (admin: Admin) =>
    admin.fullName ||
    (admin.firstName && admin.lastName ? `${admin.firstName} ${admin.lastName}` : null) ||
    admin.name ||
    'Unknown Admin';

  const getAdminPhoto = (admin: Admin) =>
    admin.profileURL || admin.photo || admin.profileImage || DEFAULT_AVATAR;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Admins</h1>
            <p className="text-muted-foreground">Manage administrator accounts</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Admin
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search admins by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </Card>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : admins.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<UserX className="w-10 h-10 text-muted-foreground" />}
                title={searchTerm ? 'No admins found' : 'No admins yet'}
                description={
                  searchTerm
                    ? 'No admins match your search.'
                    : 'There are no administrators in the system.'
                }
                action={
                  !searchTerm
                    ? { label: 'Add Admin', onClick: () => setShowAddModal(true) }
                    : undefined
                }
              />
            </div>
          ) : (
            admins.map((admin) => (
              <Card key={admin.id || admin._id}>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={getAdminPhoto(admin)}
                    alt={getAdminName(admin)}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <h3 className="font-semibold text-lg mb-1">{getAdminName(admin)}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{admin.email}</p>
                  {admin.createdAt && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Joined {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { setAdminToDelete(admin); setShowDeleteModal(true); }}
                    disabled={isDeleting}
                  >
                    Delete Admin
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* ADD MODAL */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Admin"
        >
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={newAdmin.firstName}
                onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                disabled={isCreating}
                required
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={newAdmin.lastName}
                onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                disabled={isCreating}
                required
              />
            </div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter email address"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              disabled={isCreating}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Min 8 characters"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              disabled={isCreating}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              value={newAdmin.confirmPassword}
              onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
              disabled={isCreating}
              required
            />
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Add Admin'}
            </Button>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Admin"
          size="sm"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {adminToDelete && getAdminName(adminToDelete)}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAdmin}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}