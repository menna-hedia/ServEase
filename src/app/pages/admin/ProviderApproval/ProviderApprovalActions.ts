// ============ GET PENDING PROVIDERS ============
export async function getPendingProviders() {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/admin/pending-providers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
console.log(result)
    if (res.ok) {
      return {
        success: true,
        data: result.data || result.providers || result,
        message: result.message || 'Pending providers fetched successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch pending providers',
      code: res.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ APPROVE PROVIDER ============
export async function approveProvider(providerId: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/active-provider/${providerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Provider approved successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to approve provider',
      code: res.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ REJECT PROVIDER ============
export async function rejectProvider(
  providerId: string,
  cause: string
) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/admin/reject-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        providerId,
        cause,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'Provider rejected successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to reject provider',
      code: res.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ GET PROVIDER BY ID ============
export async function getProviderById(providerId: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/provider/${providerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Provider fetched successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch provider',
      code: res.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}