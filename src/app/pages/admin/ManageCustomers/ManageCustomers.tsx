// import { useState, useEffect } from 'react';
// import { Search, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
// import { toast } from 'sonner';
// import AdminSidebar from '../../../components/layout/AdminSidebar';
// import Card from '../../../components/ui/Card';
// import Input from '../../../components/ui/Input';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';
// import EmptyState from '../../../components/ui/EmptyState';
// import { SkeletonCard } from '../../../components/ui/Skeleton';
// import { getCustomers, deleteCustomer } from './ManageCustomersActions';
// import { useNavigate } from 'react-router';

// export default function ManageCustomers() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCustomers, setTotalCustomers] = useState(0);

//   const navigate = useNavigate();

//   // ============ FETCH ============
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       const result = await getCustomers(searchTerm, currentPage);
//       setLoading(false);

//       if (result.success) {
//         setCustomers(result.data);
//         setTotalPages(result.totalPages ?? 1);
//         setTotalCustomers(result.totalCustomers ?? 0);
//       } else {
//         toast.error(result.error || 'Failed to load customers');
//       }
//     };

//     const timer = setTimeout(load, 400);
//     return () => clearTimeout(timer);
//   }, [searchTerm, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   // ============ DELETE ============
//   const handleDelete = async () => {
//     if (!customerToDelete) return;
//     setIsDeleting(true);

//     const result = await deleteCustomer(customerToDelete._id);
//     setIsDeleting(false);

//     if (result.success) {
//       toast.success('Customer deleted successfully');
//       setCustomers((prev) => prev.filter((c) => c._id !== customerToDelete._id));
//       setShowDeleteModal(false);
//       setCustomerToDelete(null);
//     } else {
//       toast.error(result.error || 'Failed to delete customer');
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       <AdminSidebar />

//       <div className="flex-1 p-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Manage Customers</h1>
//           <p className="text-muted-foreground">{totalCustomers} customers total</p>
//         </div>

//         <Card className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
//             <Input
//               placeholder="Search customers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-12"
//             />
//           </div>
//         </Card>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {loading ? (
//             <>
//               <SkeletonCard />
//               <SkeletonCard />
//               <SkeletonCard />
//             </>
//           ) : customers.length === 0 ? (
//             <div className="col-span-full">
//               <EmptyState
//                 icon={<UserX className="w-10 h-10 text-muted-foreground" />}
//                 title="No customers found"
//                 description="No customers match your search criteria."
//               />
//             </div>
//           ) : (
//             customers.map((customer) => (
//               <Card key={customer._id}>
//                 <div className="flex flex-col items-center text-center">
//                   <img
//                     src={customer.profileURL || `https://i.pravatar.cc/150?u=${customer._id}`}
//                     alt={customer.fullName || customer.email}
//                     className="w-20 h-20 rounded-full object-cover mb-3 cursor-pointer hover:opacity-80 transition-opacity"
//                     onClick={() => navigate(`/admin/details/${customer._id}`)} />
//                   <h3
//                     className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
//                     onClick={() => navigate(`/admin/details/${customer._id}`)}>
//                     {customer.fullName ||
//                       `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
//                       customer.userName}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
//                   {/* {customer.mobileNumber && (
//                     <p className="text-sm text-muted-foreground mb-1">{customer.mobileNumber}</p>
//                   )} */}
//                   {customer.city && (
//                     <p className="text-sm text-muted-foreground mb-4">
//                       {customer.city}{customer.state ? `, ${customer.state}` : ''}
//                     </p>
//                   )}
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => {
//                       setCustomerToDelete(customer);
//                       setShowDeleteModal(true);
//                     }}
//                   >
//                     Delete Customer
//                   </Button>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-4 mt-8">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1 || loading}
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Prev
//             </Button>
//             <span className="text-sm text-muted-foreground">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages || loading}
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           </div>
//         )}

//         {/* Delete Modal */}
//         <Modal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           title="Delete Customer"
//           size="sm"
//         >
//           <div className="space-y-4">
//             <p>
//               Are you sure you want to delete{' '}
//               <span className="font-semibold">
//                 {customerToDelete?.fullName ||
//                   `${customerToDelete?.firstName} ${customerToDelete?.lastName}` ||
//                   customerToDelete?.email}
//               </span>
//               ? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowDeleteModal(false)}
//                 className="flex-1"
//                 disabled={isDeleting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleDelete}
//                 className="flex-1"
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? 'Deleting...' : 'Delete'}
//               </Button>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from 'react';
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
import { getStates, getCities } from '../../../services/locationService';
import { useNavigate } from 'react-router';

export default function ManageCustomers() {
  const navigate = useNavigate();

  const [customers,        setCustomers]        = useState<any[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [totalPages,       setTotalPages]       = useState(1);
  const [totalCustomers,   setTotalCustomers]   = useState(0);

  // ── Filters ──────────────────────────────────────────────
  const [searchTerm,     setSearchTerm]     = useState('');
  const [selectedCity,   setSelectedCity]   = useState('');
  const [selectedState,  setSelectedState]  = useState('');

  // ── Location dropdowns ───────────────────────────────────
  const [states,         setStates]         = useState<any[]>([]);
  const [cities,         setCities]         = useState<any[]>([]);
  const [loadingStates,  setLoadingStates]  = useState(false);
  const [loadingCities,  setLoadingCities]  = useState(false);

  // Load states on mount
  useEffect(() => {
    const load = async () => {
      setLoadingStates(true);
      const data = await getStates();
      setStates(data);
      setLoadingStates(false);
    };
    load();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity('');
      return;
    }
    const load = async () => {
      setLoadingCities(true);
      const state = states.find((s) => s.name === selectedState);
      if (state) {
        const data = await getCities(state.iso2);
        setCities(data);
      }
      setLoadingCities(false);
    };
    load();
  }, [selectedState, states]);

  // ── Fetch customers ──────────────────────────────────────
const load = useCallback(async () => {
  setLoading(true);
  const result = await getCustomers({
    search: searchTerm || undefined,
    city:   selectedCity || selectedState || undefined,  // ← لو مفيش city يبعت state
    page:   currentPage,
    limit:  12,
  });
  setLoading(false);

  if (result.success) {
    setCustomers(result.data);
    setTotalPages(result.totalPages ?? 1);
    setTotalCustomers(result.totalCustomers ?? 0);
  } else {
    toast.error(result.error || 'Failed to load customers');
  }
}, [searchTerm, selectedCity, selectedState, currentPage]);

  useEffect(() => {
    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [load]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedState]);

  // ── Delete ───────────────────────────────────────────────
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

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Name / email search */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>

            {/* State dropdown */}
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loadingStates}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s.iso2} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* City dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!selectedState || loadingCities}
            >
              <option value="">
                {!selectedState ? 'Select state first' : loadingCities ? 'Loading...' : 'All Cities'}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          {(searchTerm || selectedCity || selectedState) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-primary/70">×</button>
                </span>
              )}
              {selectedState && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedState}
                  <button onClick={() => { setSelectedState(''); setSelectedCity(''); }} className="hover:text-primary/70">×</button>
                </span>
              )}
              {selectedCity && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('')} className="hover:text-primary/70">×</button>
                </span>
              )}
              <button
                onClick={() => { setSearchTerm(''); setSelectedState(''); setSelectedCity(''); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}
        </Card>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
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
                    className="w-20 h-20 rounded-full object-cover mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/admin/details/${customer._id}`)}
                  />
                  <h3
                    className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/admin/details/${customer._id}`)}
                  >
                    {customer.fullName ||
                      `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                      customer.userName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
                  {(customer.city || customer.state) && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {[customer.city, customer.state].filter(Boolean).join(', ')}
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
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
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