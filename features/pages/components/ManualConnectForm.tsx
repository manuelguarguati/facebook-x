'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { connectManualPageAction } from '../actions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ManualConnectForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageId, setPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await connectManualPageAction(pageId, accessToken);
      if (result.success) {
        setSuccess(`¡Página "${result.name}" conectada exitosamente!`);
        setPageId('');
        setAccessToken('');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar la página manualmente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-2">
        <Label htmlFor="pageId">ID de la Página de Facebook</Label>
        <Input
          id="pageId"
          placeholder="Ej: 1029384756"
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          required
          disabled={loading}
          className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        />
        <p className="text-[10px] text-neutral-500">
          El ID numérico único de tu página de Facebook.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessToken">Token de Acceso de la Página</Label>
        <Input
          id="accessToken"
          type="password"
          placeholder="EAA..."
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
          disabled={loading}
          className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        />
        <p className="text-[10px] text-neutral-500">
          Token de acceso de larga duración generado desde el panel de desarrolladores.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2 text-green-600 dark:text-green-400 text-xs">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900"
      >
        {loading ? t('pages.button_loading') : 'Guardar Conexión Manual'}
      </Button>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <h4 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2">
          Guía de Conexión Manual
        </h4>
        <ul className="space-y-2 text-[11px] text-neutral-500 text-left leading-relaxed">
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <span>Obtén tu <strong>ID de Página</strong> en la sección "Información" de tu página de Facebook.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <span>Genera un <strong>Token de Acceso de Página</strong> (de larga duración) desde el <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="text-blue-600 hover:underline">Graph API Explorer</a>.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <span>Asegúrate de que el token tenga permisos: <code>pages_show_list</code>, <code>pages_read_engagement</code> y <code>pages_manage_posts</code>.</span>
          </li>
        </ul>
      </div>
    </form>
  );
}
