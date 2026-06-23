// logout 
export function logoutAction() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('role');
  localStorage.removeItem('provider_approved');
  return {
    success: true,
    message: 'Logged out successfully',
  };
}