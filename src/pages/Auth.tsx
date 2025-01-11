import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth';

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case 'user_already_exists':
        return 'Bu email artıq qeydiyyatdan keçib. Zəhmət olmasa daxil olun və ya başqa email istifadə edin.';
      case 'email_address_invalid':
        return 'Düzgün email ünvanı daxil edin.';
      case 'invalid_credentials':
        return 'Yanlış email və ya şifrə. Məlumatlarınızı yoxlayın və yenidən cəhd edin.';
      case 'email_not_confirmed':
        return 'Zəhmət olmasa giriş etməzdən əvvəl email ünvanınızı təsdiqləyin.';
      case 'user_not_found':
        return 'Bu məlumatlarla istifadəçi tapılmadı.';
      case 'invalid_grant':
        return 'Yanlış giriş məlumatları.';
      default:
        return error.message;
    }
  }
  return error.message;
};

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Create profile with first and last name after sign up
          if (event === 'SIGNED_UP') {
            const { error } = await supabase.from('profiles').upsert({
              id: session.user.id,
              first_name: (session.user.user_metadata.first_name as string) || '',
              last_name: (session.user.user_metadata.last_name as string) || '',
              created_at: new Date().toISOString(),
            });
            
            if (error) {
              console.error('Error creating profile:', error);
            }
          }
          navigate('/');
        }
        if (event === 'USER_UPDATED') {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        }
        if (event === 'SIGNED_OUT') {
          setErrorMessage("");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg p-8 w-full max-w-4xl shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4 bg-emerald-50 p-8 rounded-lg">
          <img 
            src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" 
            alt="Logo" 
            className="w-32 h-32 object-contain"
          />
          <p className="text-xl text-emerald-800 font-medium text-center">
            Sizi aramızda görməyə sevinirik
          </p>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Giriş / Qeydiyyat
          </h1>

          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#059669',
                    brandAccent: '#047857',
                  }
                }
              }
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Şifrə',
                  button_label: 'Giriş',
                  loading_button_label: 'Giriş edilir...',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Şifrə',
                  button_label: 'Qeydiyyat',
                  loading_button_label: 'Qeydiyyat edilir...',
                  link_text: 'Hesabınız yoxdur? Qeydiyyatdan keçin',
                },
              }
            }}
            view="sign_up"
            additionalData={{
              first_name: '',
              last_name: '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
