
import { useState, useEffect, useCallback } from 'react';
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
import { getAllServices } from '../../shared/Services/ServicesActions';
import { getStates, getCities } from '../../../services/locationService';
import { useNavigate } from 'react-router';

export default function ManageProviders() {
  const navigate = useNavigate();

  const [providers,        setProviders]        = useState<any[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<any | null>(null);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [totalPages,       setTotalPages]       = useState(1);
  const [totalProviders,   setTotalProviders]   = useState(0);

  // ── Filters ──────────────────────────────────────────────
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState,    setSelectedState]    = useState('');
  const [selectedCity,     setSelectedCity]     = useState('');

  // ── Dropdowns data ───────────────────────────────────────
  const [categories,     setCategories]     = useState([{ value: '', label: 'All Categories' }]);
  const [states,         setStates]         = useState<any[]>([]);
  const [cities,         setCities]         = useState<any[]>([]);
  const [loadingStates,  setLoadingStates]  = useState(false);
  const [loadingCities,  setLoadingCities]  = useState(false);

  // Load services + states on mount
  useEffect(() => {
    const loadServices = async () => {
      const result = await getAllServices();
      if (result.success) {
        setCategories([
          { value: '', label: 'All Categories' },
          ...result.data.map((s: any) => ({ value: s.name, label: s.name })),
        ]);
      }
    };

    const loadStates = async () => {
      setLoadingStates(true);
      const data = await getStates();
      setStates(data);
      setLoadingStates(false);
    };

    loadServices();
    loadStates();
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

  // ── Fetch providers ──────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const result = await getProviders({
      search: searchTerm || undefined,
      city:   selectedCity || selectedState || undefined,
      page:   currentPage,
    });
    setLoading(false);

    if (result.success) {
      setProviders(result.data);
      setTotalPages(result.totalPages ?? 1);
      setTotalProviders(result.totalProviders ?? 0);
    } else {
      toast.error(result.error || 'Failed to load providers');
    }
  }, [searchTerm, selectedCity, selectedState, currentPage]);

  useEffect(() => {
    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [load]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedState, selectedCity]);

  // ── Category filter (client-side) ────────────────────────
  const filteredProviders = selectedCategory
    ? providers.filter((p) => {
        const serviceName = typeof p.service === 'object' ? p.service?.name : p.service;
        return serviceName === selectedCategory;
      })
    : providers;

  // ── Delete ───────────────────────────────────────────────
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Providers</h1>
          <p className="text-muted-foreground">{totalProviders} providers total</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>

            {/* Category */}
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loadingStates}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s.iso2} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* City */}
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
          {(searchTerm || selectedCategory || selectedState || selectedCity) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {selectedCategory && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}>×</button>
                </span>
              )}
              {selectedState && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedState}
                  <button onClick={() => { setSelectedState(''); setSelectedCity(''); }}>×</button>
                </span>
              )}
              {selectedCity && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('')}>×</button>
                </span>
              )}
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSelectedState(''); setSelectedCity(''); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}
        </Card>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
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
                    className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/admin/details/${provider._id}`)}
                  />
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/admin/details/${provider._id}`)}
                    >
                      {provider.fullName || `${provider.firstName} ${provider.lastName}`}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{provider.email}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {typeof provider.service === 'object' ? provider.service?.name : provider.service || '—'}
                    </p>
                    <div className="flex items-center gap-4">
                      {provider.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{provider.averageRating}</span>
                          <span className="text-sm text-muted-foreground">({provider.reviewsCount})</span>
                        </div>
                      )}
                      {provider.state && (
                        <span className="text-sm text-muted-foreground">
                          {[provider.city, provider.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={provider.adminApproved === 'Active' ? 'completed' : 'pending'}>
                      {provider.adminApproved || 'Pending'}
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => { setProviderToDelete(provider); setShowDeleteModal(true); }}
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
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
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