import { useState, useEffect } from 'react';
import { Plus, UserX } from 'lucide-react';
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
} from './ManageAdminActions';

interface Admin {
  id?: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: string;
  profileImage?: string;
  createdAt?: string;
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ============ LOAD ADMINS ON MOUNT ============
  useEffect(() => {
    loadAdmins();
  }, []);

  // ============ LOAD ALL ADMINS ============
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const result = await getAllAdmins();

      if (result.success) {
        const adminsList = Array.isArray(result.data) ? result.data : [];
        setAdmins(adminsList);

        if (adminsList.length === 0) {
          toast.info('No admins found');
        }
      } else {
        toast.error(result.error || 'Failed to load admins');
        setAdmins([]);
      }
    } catch (error) {
      toast.error('Error loading admins');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // ============ VALIDATE FORM ============
  const validateForm = (): boolean => {
    if (!newAdmin.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }

    if (!newAdmin.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }

    if (!newAdmin.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast.error('Please enter a valid email');
      return false;
    }

    if (!newAdmin.password) {
      toast.error('Password is required');
      return false;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (newAdmin.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  // ============ HANDLE ADD ADMIN ============
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsCreating(true);
      const result = await createAdmin({
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        password: newAdmin.password,
      });

      if (result.success) {
        toast.success(result.message || 'Admin added successfully');
        setShowAddModal(false);
        setNewAdmin({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        await loadAdmins();
      } else {
        toast.error(result.error || 'Failed to add admin');
      }
    } catch (error) {
      toast.error('Error adding admin');
    } finally {
      setIsCreating(false);
    }
  };

  // ============ HANDLE DELETE ADMIN ============
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      setIsDeleting(true);
      const adminId = adminToDelete.id || adminToDelete._id;

      if (!adminId) {
        toast.error('Invalid admin ID');
        return;
      }

      const result = await deleteAdmin(adminId);

      if (result.success) {
        toast.success(result.message || 'Admin deleted successfully');
        setShowDeleteModal(false);
        setAdminToDelete(null);
        await loadAdmins();
      } else {
        toast.error(result.error || 'Failed to delete admin');
      }
    } catch (error) {
      toast.error('Error deleting admin');
    } finally {
      setIsDeleting(false);
    }
  };

  // ============ GET ADMIN DISPLAY NAME ============
  const getAdminName = (admin: Admin): string => {
    if (admin.firstName && admin.lastName) {
      return `${admin.firstName} ${admin.lastName}`;
    }
    return admin.name || 'Unknown Admin';
  };

  // ============ GET ADMIN PHOTO ============
  const getAdminPhoto = (admin: Admin): string => {
    return admin.photo || admin.profileImage || 'https://tse4.mm.bing.net/th/id/OIP.23wzRzOwtSR-WAQZM4mWzAHaHa?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3';
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Admins</h1>
            <p className="text-muted-foreground">Manage administrator accounts</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Admin
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : admins.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<UserX className="w-10 h-10 text-muted-foreground" />}
                title="No admins found"
                description="There are no administrators in the system."
                action={{
                  label: 'Add Admin',
                  onClick: () => setShowAddModal(true),
                }}
              />
            </div>
          ) : (
            admins.map((admin) => (
              <Card key={admin.id || admin._id}>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={getAdminPhoto(admin)}
                    alt={getAdminName(admin)}
                    className="w-20 h-20 rounded-full mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg mb-1">{getAdminName(admin)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{admin.email}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setAdminToDelete(admin);
                      setShowDeleteModal(true);
                    }}
                    disabled={isDeleting}
                  >
                    Delete Admin
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* ============ ADD ADMIN MODAL ============ */}
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
              placeholder="Enter password (min 8 characters)"
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
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
              }
              disabled={isCreating}
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Add Admin'}
            </Button>
          </form>
        </Modal>

        {/* ============ DELETE ADMIN MODAL ============ */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Admin"
          size="sm"
        >
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">
                {adminToDelete && getAdminName(adminToDelete)}
              </p>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this admin? This action cannot be undone.
              </p>
            </div>

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
