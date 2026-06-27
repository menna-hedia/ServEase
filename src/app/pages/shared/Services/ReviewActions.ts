export async function getGlobalReviews() {
  try {
    const res = await fetch('/api/review/global-reviews');
    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: Array.isArray(result) ? result : [],
      };
    }

    return { success: false, error: result.message || 'Failed to fetch reviews' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function submitGlobalReview(rate: number, content: string) {
  try {
    const token = localStorage.getItem('access_token');
    console.log('Token:', token ? 'found' : 'NOT FOUND');
    console.log('Payload:', { rate, content });

    const res = await fetch('/api/review/global-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rate, content }),
    });

    const result = await res.json();
    console.log('Review response:', result);

    if (res.ok || res.status === 201) {
      return { success: true, data: result, message: 'Review submitted successfully' };
    }

    return { success: false, error: result.message || 'Failed to submit review' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function deleteGlobalReview(reviewId: string) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch(`/api/review/delete-review/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: result.message || 'Review deleted successfully' };
    }

    return { success: false, error: result.message || 'Failed to delete review' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}