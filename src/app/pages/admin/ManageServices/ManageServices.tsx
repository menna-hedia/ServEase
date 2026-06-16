import { useState, useEffect } from 'react';
import { Wrench, Trash2, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { createService, deleteService } from './ManageServicesActions';
import { getAllServices } from '../../shared/Services/ServicesActions';

interface Service {
  _id: string;
  name: string;
}

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getAllServices();
      setLoading(false);

      if (result.success) {
        setServices(result.data);
      } else {
        console.error('Services API error:', result.error);
        setServices([]);
      }
    };

    load();
  }, []);

  // ============ CREATE ============
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newServiceName.trim()) {
      toast.error('Service name is required');
      return;
    }

    setIsCreating(true);
    const result = await createService(newServiceName.trim());
    setIsCreating(false);

    if (result.success) {
      toast.success(result.message || 'Service created successfully');
      setShowAddModal(false);
      setNewServiceName('');
      setServices((prev) => [
        ...prev,
        { _id: Date.now().toString(), name: newServiceName.trim() },
      ]);
    } else {
      toast.error(result.error || 'Failed to create service');
    }
  };

  // ============ DELETE ============
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);

    const result = await deleteService(serviceToDelete._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Service deleted successfully');
      setServices((prev) => prev.filter((s) => s._id !== serviceToDelete._id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete service');
    }
  };

  // ============ FILTER ============
  const filtered = searchTerm.trim()
    ? services.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : services;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Services</h1>
            <p className="text-muted-foreground">{services.length} services total</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Wrench className="w-10 h-10 text-muted-foreground" />}
            title="No services found"
            description={
              searchTerm
                ? 'No services match your search.'
                : 'There are no services yet.'
            }
            action={
              !searchTerm
                ? { label: 'Add Service', onClick: () => setShowAddModal(true) }
                : undefined
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 n">
            {filtered.map((service) => (
              <Card key={service._id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-semibold">{service.name}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setServiceToDelete(service);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ADD MODAL */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setNewServiceName('');
          }}
          title="Add New Service"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Service Name"
              placeholder="Enter service name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              disabled={isCreating}
              required
            />
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Add Service'}
            </Button>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Service"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {serviceToDelete?.name}
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
                onClick={handleDelete}
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