// ============ GET ALL ADMINS ============
export async function getAllAdmins() {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/admin', {
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
        data: result.data || result.admins || result,
        message: result.message || 'Admins fetched successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch admins',
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

// ============ CREATE ADMIN ============
export async function createAdmin(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/admin/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Admin created successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to create admin',
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

// ============ DELETE ADMIN ============
export async function deleteAdmin(adminId: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/delete/${adminId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'Admin deleted successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to delete admin',
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

// ============ UPDATE ADMIN ============
export async function updateAdmin(
  adminId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }
) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/update/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Admin updated successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to update admin',
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

// ============ GET ADMIN BY ID ============
export async function getAdminById(adminId: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/admin/${adminId}`, {
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
        message: result.message || 'Admin fetched successfully',
        code: res.status,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch admin',
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