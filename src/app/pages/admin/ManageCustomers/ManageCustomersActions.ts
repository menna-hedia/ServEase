export async function getCustomers(params: {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const token = localStorage.getItem('admin_token');

    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.city)   query.append('city', params.city);
    if (params.page)   query.append('page', String(params.page));
    query.append('limit', String(params.limit || 100));

    const res = await fetch(`/api/admin/customers?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.customers || result.data || result,
        totalPages: result.totalPages ?? 1,
        totalCustomers: result.totalCustomers ?? 0,
        currentPage: result.currentPage ?? 1,
      };
    }

    return { success: false, error: result.message || 'Failed to fetch customers' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/delete/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Customer deleted' };
    }

    return { success: false, error: result.message || 'Failed to delete customer' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}