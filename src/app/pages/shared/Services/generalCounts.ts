// ============ GET GENERAL COUNTS ============
export async function getGeneralCounts() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/common/general-counts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch general counts',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}