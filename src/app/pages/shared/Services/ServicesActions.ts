export async function getAllServices() {
  try {
    const res = await fetch('/api/service/all');
    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: Array.isArray(result) ? result : result.services || [],
      };
    }

    return { success: false, error: result.message || 'Failed to fetch services' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}