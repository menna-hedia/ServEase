// logout 
export function logoutAction() {
  localStorage.removeItem('access_token');
localStorage.removeItem('role');
  return {
    success: true,
    message: 'Logged out successfully',
  };
}