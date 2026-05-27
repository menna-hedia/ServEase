// logout 
export function logoutAction() {
  localStorage.removeItem('access_token');

  return {
    success: true,
    message: 'Logged out successfully',
  };
}