// ============ GET SETTINGS ============
export async function getSettings() {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/general-setting/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error('Get settings error:', res.status, res.statusText);
      return {
        success: false,
        error: `Error: ${res.status}`,
        code: res.status,
      };
    }

    const text = await res.text();

    if (!text) {
      return {
        success: true,
        data: {
          webCommission: 10,
          providerDebt: 0,
          providerCancelFee: 0,
          providerCancelCount: 0,
        },
        message: 'Using default settings',
        code: res.status,
      };
    }

    const result = JSON.parse(text);
    console.log('Settings loaded:', result);

    return {
      success: true,
      data: result,
      message: 'Settings fetched successfully',
      code: res.status,
    };
  } catch (error) {
    console.error('Settings error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ UPDATE COMMISSION ============
export async function updateCommission(commission: number) {
  try {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
        code: 401,
      };
    }

    const payload = {
      webCommission: commission,
    };

    console.log('Sending payload:', JSON.stringify(payload));

    const res = await fetch('/api/general-setting/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);

    if (res.status === 204 || res.status === 200) {
      const text = await res.text();
      console.log('Response text:', text);

      const verifyResult = await getSettings();
      console.log('Verified settings:', verifyResult.data);

      return {
        success: true,
        message: 'Commission updated successfully',
        code: res.status,
        data: verifyResult.data,
      };
    }

    const text = await res.text();
    console.error('Update failed:', text);

    return {
      success: false,
      error: `Failed to update commission: ${res.status} ${text}`,
      code: res.status,
    };
  } catch (error) {
    console.error('Commission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ UPDATE DEBT LIMIT ============
export async function updateDebtLimit(debtLimit: number) {
  try {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
        code: 401,
      };
    }

    const payload = {
      providerDebt: debtLimit,
    };

    console.log('Sending payload:', JSON.stringify(payload));

    const res = await fetch('/api/general-setting/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);

    if (res.status === 204 || res.status === 200) {
      const verifyResult = await getSettings();
      console.log('Verified settings:', verifyResult.data);

      return {
        success: true,
        message: 'Debt limit updated successfully',
        code: res.status,
        data: verifyResult.data,
      };
    }

    const text = await res.text();
    console.error('Update failed:', text);

    return {
      success: false,
      error: `Failed to update debt limit: ${res.status} ${text}`,
      code: res.status,
    };
  } catch (error) {
    console.error('Debt limit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ UPDATE PROVIDER CANCEL FEE ============
export async function updateProviderCancelFee(cancelFee: number) {
  try {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
        code: 401,
      };
    }

    const payload = {
      providerCancelFee: cancelFee,
    };

    console.log('Sending payload:', JSON.stringify(payload));

    const res = await fetch('/api/general-setting/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);

    if (res.status === 204 || res.status === 200) {
      const verifyResult = await getSettings();
      console.log('Verified settings:', verifyResult.data);

      return {
        success: true,
        message: 'Cancel fee updated successfully',
        code: res.status,
        data: verifyResult.data,
      };
    }

    const text = await res.text();
    console.error('Update failed:', text);

    return {
      success: false,
      error: `Failed to update cancel fee: ${res.status} ${text}`,
      code: res.status,
    };
  } catch (error) {
    console.error('Cancel fee error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}

// ============ UPDATE PROVIDER CANCEL COUNT ============
export async function updateProviderCancelCount(cancelCount: number) {
  try {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
        code: 401,
      };
    }

    const payload = {
      providerCancelCount: cancelCount,
    };

    console.log('Sending payload:', JSON.stringify(payload));

    const res = await fetch('/api/general-setting/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);

    if (res.status === 204 || res.status === 200) {

      const verifyResult = await getSettings();
      console.log('Verified settings:', verifyResult.data);

      return {
        success: true,
        message: 'Cancel count updated successfully',
        code: res.status,
        data: verifyResult.data,
      };
    }

    const text = await res.text();
    console.error('Update failed:', text);

    return {
      success: false,
      error: `Failed to update cancel count: ${res.status} ${text}`,
      code: res.status,
    };
  } catch (error) {
    console.error('Cancel count error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      code: 0,
    };
  }
}