// auth.js
export const supabase = createClient(
    'https://qopdjgfciakmvhlriixt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGRqZ2ZjaWFrbXZobHJpaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDA2NDAsImV4cCI6MjA1NTAxNjY0MH0.5UAelwww7WpDUExqhc5dH2JhUWlGNgUNjh8fzxPNZvs'
  );
  
  export async function verifySession() {
    const sessionData = localStorage.getItem('supabase_session');
    if (!sessionData) return false;
  
    try {
      const { session, expires_at } = JSON.parse(sessionData);
      const now = Math.floor(Date.now() / 1000);
  
      // Check if session is expired
      if (expires_at < now) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: session.refresh_token
        });
        if (error) throw error;
        
        localStorage.setItem('supabase_session', JSON.stringify({
          user: data.user,
          session: data.session,
          expires_at: data.session.expires_at,
          last_verified: Date.now()
        }));
      }
  
      return true;
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('supabase_session');
      return false;
    }
  }