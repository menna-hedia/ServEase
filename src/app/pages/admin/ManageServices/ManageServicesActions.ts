export async function createService(name: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch('/api/service/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const result = await res.json();
    console.log('Create service response:', result);

    if (res.ok || res.status === 201) {
      return { success: true, message: result.message || 'Service created successfully' };
    }

    return { success: false, error: result.message || 'Failed to create service' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function deleteService(id: string) {
  try {
    const token = localStorage.getItem('admin_token');

    const res = await fetch(`/api/service/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Service deleted successfully' };
    }

    return { success: false, error: result.message || 'Failed to delete service' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}