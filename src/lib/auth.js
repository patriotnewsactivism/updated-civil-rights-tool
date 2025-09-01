import GoTrue from 'gotrue-js';

export const auth = new GoTrue({ 
  APIUrl: `${window.location.origin}/.netlify/identity`, 
  setCookie: true 
});

export async function identityEnabled() {
  try { 
    const res = await fetch('/.netlify/identity/settings', { cache: 'no-store' }); 
    return res.ok; 
  } catch { 
    return false; 
  }
}

export async function getCurrentUser() { 
  try { 
    const u = auth.currentUser(); 
    return u ? { email: u.email || '' } : null; 
  } catch { 
    return null; 
  } 
}