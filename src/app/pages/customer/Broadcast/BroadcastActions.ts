// const getToken = () => localStorage.getItem('access_token');

// // ============ CUSTOMER — CREATE BROADCAST ============
// export async function createBroadcastRequest(data: {
//   serviceId: string;
//   governorate: string;
//   city: string;
//   street: string;
//   exactLocation: string;
//   serviceNeeded: string;
//   dateNeeded: string;
//   startTime: string;
//   locationScope: 'GOVERNORATE' | 'DISTRICT';
//   matchByTopRated: boolean;
//   paymentMode: 'FIXED' | 'HOURLY';
//   preferredPrice?: number;
// }) {
//   try {
//     const res = await fetch('/api/service-requests/broadcast', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to create broadcast' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// // ============ CUSTOMER — GET OFFERS FOR BROADCAST ============
// export async function getBroadcastOffers(requestId: string) {
//   try {
//     const res = await fetch(`/api/service-requests/broadcast/${requestId}/offers`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to fetch offers' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// // ============ CUSTOMER — SELECT OFFER ============
// export async function selectBroadcastOffer(requestId: string, offerId: string) {
//   try {
//     const res = await fetch('/api/service-requests/broadcast/select-offer', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify({ requestId, offerId }),
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to select offer' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// // ============ CUSTOMER — CANCEL BROADCAST ============
// export async function cancelBroadcastRequest(requestId: string) {
//   try {
//     const res = await fetch('/api/service-requests/broadcast/cancel', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify({ requestId }),
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to cancel broadcast' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// // ============ CUSTOMER — COMPLETE HOURLY ============
// export async function completeHourlyBroadcast(data: {
//   requestId: string;
//   completionCode: string;
//   hoursWorked: number;
// }) {
//   try {
//     const res = await fetch('/api/service-requests/broadcast/complete-hourly', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await res.json();
//     if (res.ok) return { success: true, data: result };
//     return { success: false, error: result.message || 'Failed to complete service' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

const getToken = () => localStorage.getItem('access_token');

// ============ CUSTOMER — CREATE BROADCAST ============
export async function createBroadcastRequest(data: {
  serviceId: string;
  governorate: string;
  city: string;
  street: string;
  exactLocation: string;
  serviceNeeded: string;
  dateNeeded: string;
  startTime: string;
  locationScope: 'GOVERNORATE' | 'DISTRICT';
  matchByTopRated: boolean;
  paymentMode: 'FIXED' | 'HOURLY';
  preferredPrice?: number;
}) {
  try {
    const res = await fetch('/api/service-requests/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: result };
    return { success: false, error: result.message || 'Failed to create broadcast' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ CUSTOMER — GET OFFERS FOR BROADCAST ============
export async function getBroadcastOffers(requestId: string) {
  try {
    const res = await fetch(`/api/service-requests/broadcast/${requestId}/offers`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const result = await res.json();
    if (res.ok) {
      const normalized = {
        requestStatus: result.requestStatus || result.status || '',
        offers: Array.isArray(result) ? result : (result.offers || []),
      };
      return { success: true, data: normalized };
    }
    return { success: false, error: result.message || 'Failed to fetch offers' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ CUSTOMER — SELECT OFFER ============
export async function selectBroadcastOffer(requestId: string, offerId: string) {
  try {
    const res = await fetch('/api/service-requests/broadcast/select-offer', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ requestId, offerId }),
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: result };
    return { success: false, error: result.message || 'Failed to select offer' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ CUSTOMER — CANCEL BROADCAST ============
export async function cancelBroadcastRequest(requestId: string) {
  try {
    const res = await fetch('/api/service-requests/broadcast/cancel', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ requestId }),
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: result };
    return { success: false, error: result.message || 'Failed to cancel broadcast' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ CUSTOMER — COMPLETE HOURLY ============
export async function completeHourlyBroadcast(data: {
  requestId: string;
  completionCode: string;
  hoursWorked: number;
}) {
  try {
    const res = await fetch('/api/service-requests/broadcast/complete-hourly', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) return { success: true, data: result };
    return { success: false, error: result.message || 'Failed to complete service' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}
