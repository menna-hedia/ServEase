export async function getMyRequests() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('My requests response:', result);

    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch requests',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function cancelRequest(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch(`/api/service-requests/${requestId}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Request cancelled' };
    }

    return {
      success: false,
      error: result.message || 'Failed to cancel request',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}