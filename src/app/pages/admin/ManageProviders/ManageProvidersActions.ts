export async function getProviders(params: {
  search?: string;
  city?: string;
  page?: number;
} = {}) {
  try {
    const token = localStorage.getItem('admin_token');

    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.city)   query.append('city', params.city);
    query.append('page', String(params.page || 1));

    const res = await fetch(`/api/admin/providers?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.providers,
        totalPages: result.totalPages,
        totalProviders: result.totalProviders,
        currentPage: result.currentPage,
      };
    }

    return { success: false, error: result.message || 'Failed to fetch providers' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function deleteProvider(id: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/delete/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Provider deleted' };
    }

    return { success: false, error: result.message || 'Failed to delete provider' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}