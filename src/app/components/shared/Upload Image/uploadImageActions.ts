export async function uploadImage(file: File) {
  try {
    const token = localStorage.getItem('access_token');
    console.log('1. Token:', token ? 'found' : 'NOT FOUND'); 

    if (!token) {
      return { success: false, error: 'Authentication required. Please log in.' };
    }

    const formData = new FormData();
    formData.append('photo', file);
    console.log('2. Sending file:', file.name, file.size); // ← ودا

    const res = await fetch(`/api/common/upload-photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('3. Response status:', res.status); // ← ودا
    const result = await res.json();
    console.log('4. Full response:', result); // ← ودا

    if (res.ok) {
      console.log('5. profileURL value:', result.profileURL); // ← ودا
      return {
        success: true,
        data: { imageUrl: result.profileURL },
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Upload failed.',
    };
  } catch (error) {
    console.log('ERROR:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImagePreview(previewUrl: string): void {
  URL.revokeObjectURL(previewUrl);
}