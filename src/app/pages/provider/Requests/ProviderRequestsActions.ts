// export async function getProviderRequests() {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/service-requests', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log('Provider requests response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: Array.isArray(result) ? result : result.requests || [],
//       };
//     }

//     return { success: false, error: result.message || 'Failed to fetch requests' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }
// // ============ GET REQUEST DETAILS ============
// export async function getRequestDetails(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch(`/api/service-requests/${requestId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log('Request details response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Request details fetched successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to fetch request details',
//     };
//   } catch (error) {
//     console.error('Get request details error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// // ============ ACCEPT REQUEST ============
// export async function acceptRequest(
//   requestId: string,
//   price: number,
//   endTime: string
// ) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const payload = {
//       id: requestId,
//       price,
//       endTime,
//     };

//     console.log('Accept request payload:', payload);

//     const res = await fetch('/api/service-requests/provider-accept', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     console.log('Accept request response:', result);

//     if (result.message && result.message.includes('banned')) {
//       return {
//         success: false,
//         error: result.message,
//         isBanned: true,
//         statusCode: res.status,
//       };
//     }

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Request accepted successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to accept request',
//       statusCode: res.status,
//     };
//   } catch (error) {
//     console.error('Accept request error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// // ============ REJECT REQUEST ============
// export async function rejectRequest(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const payload = {
//       id: requestId,
//     };

//     console.log('Reject request payload:', payload);

//     const res = await fetch('/api/service-requests/provider-reject', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     console.log('Reject request response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Request rejected successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to reject request',
//       statusCode: res.status,
//     };
//   } catch (error) {
//     console.error('Reject request error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// // ============ CANCEL REQUEST ============
// export async function cancelRequest(requestId: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const payload = {
//       id: requestId,
//     };

//     console.log('Cancel request payload:', payload);

//     // ✅ PATCH /api/service-requests/provider-cancel
//     const res = await fetch('/api/service-requests/provider-cancel', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     console.log('Cancel request response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Request cancelled successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to cancel request',
//       statusCode: res.status,
//     };
//   } catch (error) {
//     console.error('Cancel request error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

// // ============ COMPLETE REQUEST ============
// export async function completeRequest(requestId: string, completionCode?: string) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const payload: any = {
//       id: requestId,
//     };

//     if (completionCode) {
//       payload.completionCode = completionCode;
//     }

//     console.log('Complete request payload:', payload);

//     const res = await fetch('/api/service-requests/provider-complete', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     console.log('Complete request response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Request completed successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to complete request',
//       statusCode: res.status,
//     };
//   } catch (error) {
//     console.error('Complete request error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }
// // ============ FILTER REQUESTS ============
// export async function filterRequests(filters: {
//   status?: string;
//   dateFrom?: string;
//   dateTo?: string;
//   serviceNeeded?: string;
//   city?: string;
// }) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const queryParams = new URLSearchParams();
//     if (filters.status) queryParams.append('status', filters.status);
//     if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
//     if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
//     if (filters.serviceNeeded) queryParams.append('serviceNeeded', filters.serviceNeeded);
//     if (filters.city) queryParams.append('city', filters.city);

//     const res = await fetch(`/api/provider/requests?${queryParams.toString()}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log('Filtered requests response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: result.data || result,
//         message: result.message || 'Requests fetched successfully',
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to fetch requests',
//     };
//   } catch (error) {
//     console.error('Filter requests error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }

export async function getProviderRequests() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/service-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Provider requests response:', result);

    if (res.ok) {
      return {
        success: true,
        data: Array.isArray(result) ? result : result.requests || [],
      };
    }

    return { success: false, error: result.message || 'Failed to fetch requests' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}
// ============ GET REQUEST DETAILS ============
export async function getRequestDetails(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch(`/api/service-requests/${requestId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Request details response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request details fetched successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch request details',
    };
  } catch (error) {
    console.error('Get request details error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ ACCEPT REQUEST ============
export async function acceptRequest(
  requestId: string,
  endTime: string,
  price?: number
) {
  try {
    const token = localStorage.getItem('access_token');

    // price is only sent for FIXED requests; HOURLY requests accept with endTime only
    const payload: { id: string; endTime: string; price?: number } = {
      id: requestId,
      endTime,
    };

    if (price !== undefined) {
      payload.price = price;
    }

    console.log('Accept request payload:', payload);

    const res = await fetch('/api/service-requests/provider-accept', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Accept request response:', result);

    if (result.message && result.message.includes('banned')) {
      return {
        success: false,
        error: result.message,
        isBanned: true,
        statusCode: res.status,
      };
    }

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request accepted successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to accept request',
      statusCode: res.status,
    };
  } catch (error) {
    console.error('Accept request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ REJECT REQUEST ============
export async function rejectRequest(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const payload = {
      id: requestId,
    };

    console.log('Reject request payload:', payload);

    const res = await fetch('/api/service-requests/provider-reject', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Reject request response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request rejected successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to reject request',
      statusCode: res.status,
    };
  } catch (error) {
    console.error('Reject request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ CANCEL REQUEST ============
export async function cancelRequest(requestId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const payload = {
      id: requestId,
    };

    console.log('Cancel request payload:', payload);

    // ✅ PATCH /api/service-requests/provider-cancel
    const res = await fetch('/api/service-requests/provider-cancel', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Cancel request response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request cancelled successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to cancel request',
      statusCode: res.status,
    };
  } catch (error) {
    console.error('Cancel request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ COMPLETE REQUEST ============
export async function completeRequest(requestId: string, completionCode?: string) {
  try {
    const token = localStorage.getItem('access_token');

    const payload: any = {
      id: requestId,
    };

    if (completionCode) {
      payload.completionCode = completionCode;
    }

    console.log('Complete request payload:', payload);

    const res = await fetch('/api/service-requests/provider-complete', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Complete request response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request completed successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to complete request',
      statusCode: res.status,
    };
  } catch (error) {
    console.error('Complete request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
// ============ COMPLETE HOURLY REQUEST ============
// Note: body uses `requestId`, not `id` — different from completeRequest above.
export async function completeRequestHourly(
  requestId: string,
  completionCode: string,
  hoursWorked: number
) {
  try {
    const token = localStorage.getItem('access_token');

    const payload = {
      requestId,
      completionCode,
      hoursWorked,
    };

    console.log('Complete hourly request payload:', payload);

    const res = await fetch('/api/service-requests/complete-hourly', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Complete hourly request response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Request completed successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to complete request',
      statusCode: res.status,
    };
  } catch (error) {
    console.error('Complete hourly request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ FILTER REQUESTS ============
export async function filterRequests(filters: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  serviceNeeded?: string;
  city?: string;
}) {
  try {
    const token = localStorage.getItem('access_token');

    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters.serviceNeeded) queryParams.append('serviceNeeded', filters.serviceNeeded);
    if (filters.city) queryParams.append('city', filters.city);

    const res = await fetch(`/api/provider/requests?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Filtered requests response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Requests fetched successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch requests',
    };
  } catch (error) {
    console.error('Filter requests error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}