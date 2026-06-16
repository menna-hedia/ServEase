export async function getAdminRequests(page = 1, status = '', minPrice = '', maxPrice = '') {
  try {
    const token = localStorage.getItem('admin_token');

    const params = new URLSearchParams();
    params.append('page', String(page));
    if (status) params.append('status', status.toUpperCase());
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const res = await fetch(`/api/admin/requests?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log('Admin requests response:', result);

    if (res.ok) {
      const data = result.requests || result.data || (Array.isArray(result) ? result : []);

      return {
        success: true,
        data,
        totalPages: result.totalPages ?? 1,
        totalRequests: result.totalRequests ?? result.total ?? data.length,
        currentPage: result.currentPage ?? 1,
      };
    }

    return { success: false, error: result.message || 'Failed to fetch requests' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function cancelAdminRequest(id: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/requests/${id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Request cancelled' };
    }

    return { success: false, error: result.message || 'Failed to cancel request' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}