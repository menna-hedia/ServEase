import { useState, useEffect } from 'react';
import { Search, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { getCustomers, deleteCustomer } from './ManageCustomersActions';

export default function ManageCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getCustomers(searchTerm, currentPage);
      setLoading(false);

      if (result.success) {
        setCustomers(result.data);
        setTotalPages(result.totalPages ?? 1);
        setTotalCustomers(result.totalCustomers ?? 0);
      } else {
        toast.error(result.error || 'Failed to load customers');
      }
    };

    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============ DELETE ============
  const handleDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);

    const result = await deleteCustomer(customerToDelete._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success('Customer deleted successfully');
      setCustomers((prev) => prev.filter((c) => c._id !== customerToDelete._id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete customer');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Customers</h1>
          <p className="text-muted-foreground">{totalCustomers} customers total</p>
        </div>

        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : customers.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<UserX className="w-10 h-10 text-muted-foreground" />}
                title="No customers found"
                description="No customers match your search criteria."
              />
            </div>
          ) : (
            customers.map((customer) => (
              <Card key={customer._id}>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={customer.profileURL || `https://i.pravatar.cc/150?u=${customer._id}`}
                    alt={customer.fullName || customer.email}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                  <h3 className="font-semibold text-lg mb-1">
                    {customer.fullName ||
                      `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                      customer.userName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
                  {/* {customer.mobileNumber && (
                    <p className="text-sm text-muted-foreground mb-1">{customer.mobileNumber}</p>
                  )} */}
                  {customer.city && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {customer.city}{customer.state ? `, ${customer.state}` : ''}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCustomerToDelete(customer);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete Customer
                  </Button>
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
          title="Delete Customer"
          size="sm"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {customerToDelete?.fullName ||
                  `${customerToDelete?.firstName} ${customerToDelete?.lastName}` ||
                  customerToDelete?.email}
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