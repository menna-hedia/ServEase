export async function getProviders(search = '', page = 1) {
  try {
    const token = localStorage.getItem('admin_token');

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));

    const res = await fetch(`/api/admin/providers?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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