export async function getCalendarAppointments() {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/service-requests/calendar', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: Array.isArray(result) ? result : [],
      };
    }

    return { success: false, error: result.message || 'Failed to fetch calendar' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}
