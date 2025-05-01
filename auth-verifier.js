// auth-verifier.js
export async function verifyAuth() {
    // 1. Immediate checks
    if (new URLSearchParams(window.location.search).has('from_login')) {
      return true;
    }
    
    if (sessionStorage.getItem('login_redirect') === 'true') {
      sessionStorage.removeItem('login_redirect');
      return true;
    }
  
    // 2. Check cookie as fallback
    if (document.cookie.includes('auth_redirect=verified')) {
      document.cookie = 'auth_redirect=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      return true;
    }
  
    // 3. Verify Supabase session
    const sessionData = localStorage.getItem('supabase_session');
    if (!sessionData) return false;
  
    try {
      const { session, expires_at, origin } = JSON.parse(sessionData);
      
      // Security check - same origin
      if (origin !== window.location.origin) {
        throw new Error('Cross-origin session detected');
      }
  
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (expires_at < now) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: session.refresh_token
        });
        if (error) throw error;
        
        localStorage.setItem('supabase_session', JSON.stringify({
          user: data.user,
          session: data.session,
          expires_at: data.session.expires_at,
          refreshed_at: now,
          origin: window.location.origin
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('supabase_session');
      return false;
    }
  }