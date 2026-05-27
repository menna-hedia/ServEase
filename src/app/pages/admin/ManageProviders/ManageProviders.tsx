import { useState, useEffect } from 'react';
import { Search, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { getProviders, deleteProvider } from './ManageProvidersActions';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'CARPENTRY', label: 'Carpentry' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'AC', label: 'AC Technician' },
  { value: 'MECHANICAL', label: 'Mechanical' },
  { value: 'INTERNET', label: 'Internet Technician' },
  { value: 'OTHER', label: 'Other' },
];

export default function ManageProviders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<any | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getProviders(searchTerm, currentPage);
      setLoading(false);

      if (result.success) {
        setProviders(result.data);
        setTotalPages(result.totalPages ?? 1);
        setTotalProviders(result.totalProviders ?? 0);
      } else {
        toast.error(result.error || 'Failed to load providers');
      }
    };

    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  // reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============ DELETE ============
  const handleDelete = async () => {
    if (!providerToDelete) return;
    setIsDeleting(true);

    const result = await deleteProvider(providerToDelete._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success('Provider deleted successfully');
      setProviders((prev) => prev.filter((p) => p._id !== providerToDelete._id));
      setShowDeleteModal(false);
      setProviderToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete provider');
    }
  };

  // ============ FILTER CATEGORY CLIENT-SIDE ============
  const filteredProviders = selectedCategory
    ? providers.filter((p) => p.service === selectedCategory)
    : providers;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Providers</h1>
          <p className="text-muted-foreground">{totalProviders} providers total</p>
        </div>

        <Card className="mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProviders.length === 0 ? (
            <EmptyState
              icon={<Users className="w-10 h-10 text-muted-foreground" />}
              title="No providers found"
              description="No service providers match your search criteria."
            />
          ) : (
            filteredProviders.map((provider) => (
              <Card key={provider._id}>
                <div className="flex items-center gap-6">
                  <img
                    src={provider.profileURL || `https://i.pravatar.cc/150?u=${provider._id}`}
                    alt={provider.fullName || provider.email}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {provider.fullName || `${provider.firstName} ${provider.lastName}`}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{provider.email}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {provider.service || '—'}
                    </p>
                    <div className="flex items-center gap-4">
                      {provider.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{provider.averageRating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({provider.reviewsCount})
                          </span>
                        </div>
                      )}
                      {provider.state && (
                        <span className="text-sm text-muted-foreground">
                          {provider.state}, {provider.city}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        provider.adminApproved === 'Active' ? 'completed' : 'pending'
                      }
                    >
                      {provider.adminApproved || 'Pending'}
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setProviderToDelete(provider);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Provider"
          size="sm"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {providerToDelete?.fullName ||
                  `${providerToDelete?.firstName} ${providerToDelete?.lastName}`}
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