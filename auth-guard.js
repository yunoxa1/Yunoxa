// auth-guard.js
export async function protectPage() {
    // Immediate visibility control
    document.body.style.display = 'none';
    
    // Check for successful login redirect
    if (sessionStorage.getItem('login_redirect') === 'in_progress') {
      sessionStorage.removeItem('login_redirect');
      return true;
    }
  
    // Verify existing session
    const sessionData = localStorage.getItem('supabase_session');
    if (!sessionData) return false;
  
    try {
      const { session, expires_at } = JSON.parse(sessionData);
      const now = Math.floor(Date.now() / 1000);
      
      // Check session expiration
      if (expires_at < now) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: session.refresh_token
        });
        if (error) throw error;
        
        localStorage.setItem('supabase_session', JSON.stringify({
          user: data.user,
          session: data.session,
          expires_at: data.session.expires_at,
          refreshed_at: now
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('supabase_session');
      return false;
    }
  }