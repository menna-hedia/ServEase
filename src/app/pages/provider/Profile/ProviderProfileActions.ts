// ============ GET PROVIDER PROFILE ============
export async function getProviderProfile() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/provider/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Provider Profile API response:', result);

    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch profile',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ UPDATE PROVIDER PROFILE ============
export async function updateProviderProfile(data: {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  dob?: string;
  city: string;
  state: string;
  service?: string | { _id: string; name: string };
  specialization?: string;
  writtenCv?: string;
  nationalNumber?: string;
  gender: string;
   hourPrice?: number; 
}) {
  try {
    const token = localStorage.getItem('access_token');

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      dob: data.dob,
      city: data.city,
      state: data.state,
      service: typeof data.service === 'object'
        ? data.service?._id
        : data.service,
      specialization: data.specialization,
      writtenCv: data.writtenCv,
      nationalNumber: data.nationalNumber,
      gender: data.gender,
      ...(data.hourPrice !== undefined && { hourPrice: data.hourPrice }),
    };

    console.log('Sending update payload:', payload);

    const res = await fetch('/api/provider/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Update profile response:', result);

    if (res.ok) {
      return {
        success: true,
        data: result,
        message: result.message || 'Profile updated successfully',
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to update profile',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ UPDATE PROVIDER PASSWORD ============
export async function updateProviderPassword(
  oldPassword: string,
  newPassword: string
) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/provider/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await res.json();
    console.log('Update password response:', result);

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'Password updated successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Failed to update password',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ DELETE PROVIDER ACCOUNT ============
export async function deleteProviderAccountAction() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/provider/soft-delete', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Delete account response:', result);

    if (res.ok) {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('provider');

      return {
        success: true,
        message: result.message || 'Account deleted successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Failed to delete account',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ UPLOAD PROVIDER IMAGE ============
// export async function uploadProviderImage(file: File) {
//   try {
//     const token = localStorage.getItem('access_token');

//     const formData = new FormData();
//     formData.append('image', file);

//     const res = await fetch('/api/provider/upload-image', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const result = await res.json();
//     console.log('Upload image response:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: {
//           imageUrl: result.imageUrl || result.data?.imageUrl || result.profileURL,
//           message: result.message || 'Image uploaded successfully',
//         },
//       };
//     }

//     return {
//       success: false,
//       error: result.message || 'Failed to upload image',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Network error',
//     };
//   }
// }