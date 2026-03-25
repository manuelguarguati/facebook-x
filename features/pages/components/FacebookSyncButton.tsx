import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { signInWithFacebookAction } from '@/features/auth/actions';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';

export function FacebookSyncButton() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      await signInWithFacebookAction();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={loading}
      className="bg-[#1877F2] hover:bg-[#166fe5] text-white border-none shadow-md flex items-center gap-2"
    >
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      {loading ? t('pages.sync_button_loading') : t('pages.sync_button_idle')}
    </Button>
  );
}
