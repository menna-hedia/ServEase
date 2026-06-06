// export async function getMyRequests() {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/service-requests', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log('My requests response:', result);

//     if (res.ok) {
//       return { success: true, data: Array.isArray(result) ? result : result.requests || [] };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to fetch requests',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// export async function getRequestDetails(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch(`/api/service-requests/${requestId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log('Request details response:', result);

//     if (res.ok) {
//       return { success: true, data: result.data || result };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to fetch request details',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// export async function cancelRequest(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/service-requests/customer-reject', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ id: requestId }),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       return { success: true, message: result.message || 'Request cancelled' };
//     }

//     return { success: false, error: result.message || 'Failed to cancel request' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// export async function acceptOffer(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/service-requests/customer-accept', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ id: requestId }),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       return { success: true, message: result.message || 'Offer accepted' };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to accept offer',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// export async function rejectOffer(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/service-requests/customer-reject', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ id: requestId }),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       return { success: true, message: result.message || 'Offer rejected' };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to reject offer',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

export async function getMyRequests() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log('My requests response:', result);

    if (res.ok) {
      return { success: true, data: Array.isArray(result) ? result : result.requests || [] };
    }

    return { success: false, error: result.message || 'Failed to fetch requests' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function getRequestDetails(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch(`/api/service-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    console.log('Request details response:', result);

    if (res.ok) {
      return { success: true, data: result.data || result };
    }

    return { success: false, error: result.message || 'Failed to fetch request details' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function cancelRequest(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests/customer-cancel', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: requestId }),
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

export async function acceptOffer(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests/customer-accept', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: requestId }),
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Offer accepted' };
    }

    return { success: false, error: result.message || 'Failed to accept offer' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function rejectOffer(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests/customer-reject', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: requestId }),
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Offer rejected' };
    }

    return { success: false, error: result.message || 'Failed to reject offer' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function completeService(requestId: string, completionCode: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests/complete', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: requestId, completionCode }),
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, data: result, message: result.message || 'Service completed' };
    }

    return { success: false, error: result.message || 'Failed to complete service' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}