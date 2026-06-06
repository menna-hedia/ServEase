export async function getDetails(id: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('User details response:', result);

    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch user details',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}