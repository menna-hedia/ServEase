const getToken = () => localStorage.getItem('access_token');

// ============ PROVIDER — GET AVAILABLE BROADCASTS ============
export async function getAvailableBroadcasts() {
  try {
    const res = await fetch('/api/service-requests/broadcast/available', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: Array.isArray(result) ? result : [] };
    return { success: false, error: result.message || 'Failed to fetch broadcasts' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ PROVIDER — RESPOND TO BROADCAST ============
// export async function respondToBroadcast(data: {
//   requestId: string;
//   action: 'ACCEPT' | 'COUNTER_OFFER' | 'REFUSE';
//   offeredEndTime?: string;
//   offeredPrice?: number;
// }) {
//   try {
//     const res = await fetch('/api/service-requests/broadcast/respond', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to respond' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

export async function respondToBroadcast(data: {
  requestId: string;
  action: 'ACCEPT' | 'COUNTER_OFFER' | 'REFUSE';
  offeredEndTime?: string;
  offeredPrice?: number;
}) {
  try {
    const res = await fetch('/api/service-requests/broadcast/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: result };
    return { success: false, error: Array.isArray(result.message) ? result.message.join(', ') : result.message || 'Failed to respond' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}