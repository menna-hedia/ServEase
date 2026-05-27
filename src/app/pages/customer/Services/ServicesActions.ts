export async function createServiceRequest(data: {
  providerId: string;
  governorate: string;
  city: string;
  street: string;
  exactLocation: string;
  serviceNeeded: string;
  dateNeeded: string;
  startTime: string;
}) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log('Create request response:', result);

    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to submit request',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}