/**
 * CloudinaryUpload — Subida de imágenes a Cloudinary + opción de pegar URL.
 *
 * Setup del widget (upload preset):
 * 1. cloudinary.com → Settings → Upload → Add upload preset
 *    - Signing mode: Unsigned   ← IMPORTANTE
 *    - Folder: cafeteria/productos
 *    - Guardar → copiar el nombre del preset
 *
 * Variables de entorno (.env local y Netlify):
 *   VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name   ← arriba a la derecha del Dashboard
 *   VITE_CLOUDINARY_UPLOAD_PRESET=nombre-preset
 *
 * NOTA: La opción "Pegar URL" funciona siempre, incluso sin configurar Cloudinary.
 */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faArrowsRotate, faTimes, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const widgetOk      = CLOUD_NAME && UPLOAD_PRESET && CLOUD_NAME !== 'tu-cloud-name';

const CloudinaryUpload = ({ currentUrl, onUpload, onRemove }) => {
  const [mode, setMode]       = useState('idle');   // 'idle' | 'url'
  const [urlInput, setUrlInput] = useState('');

  const openWidget = () => {
    if (!window.cloudinary) { alert('Widget no disponible. Usá "Pegar URL" como alternativa.'); return; }
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'camera'],
        multiple: false,
        cropping: false,
        resourceType: 'image',
        maxFileSize: 5000000,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        folder: 'cafeteria/productos',
      },
      (error, result) => {
        if (error) { console.error('Cloudinary:', error); return; }
        if (result?.event === 'success') onUpload(result.info.secure_url);
      }
    );
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) return;
    onUpload(url);
    setUrlInput('');
    setMode('idle');
  };

  // ── Con imagen cargada ────────────────────────────────────────────────────
  if (currentUrl) {
    return (
      <div className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
        <img src={currentUrl} alt="preview"
          className="w-14 h-14 object-cover rounded-lg border border-stone-200 flex-shrink-0"
          onError={e => { e.target.style.display = 'none'; }} />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className="text-[10px] text-stone-400 truncate">{currentUrl.replace(/^https?:\/\//, '')}</p>
          <div className="flex gap-2">
            {widgetOk && (
              <button type="button" onClick={openWidget}
                className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors">
                <FontAwesomeIcon icon={faArrowsRotate} size="xs" /> Cambiar
              </button>
            )}
            <button type="button" onClick={() => setMode('url')}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors">
              <FontAwesomeIcon icon={faLink} size="xs" /> URL
            </button>
            <button type="button" onClick={onRemove}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs transition-colors">
              <FontAwesomeIcon icon={faTimes} size="xs" /> Quitar
            </button>
          </div>
          {mode === 'url' && (
            <div className="flex gap-1 mt-1">
              <input
                className="input-base py-1 text-xs flex-1"
                placeholder="https://res.cloudinary.com/..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <button type="button" onClick={handleUrlSubmit}
                className="bg-amber-600 hover:bg-amber-500 text-white px-2 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faCheck} size="xs" />
              </button>
              <button type="button" onClick={() => setMode('idle')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-500 px-2 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Sin imagen ────────────────────────────────────────────────────────────
  if (mode === 'url') {
    return (
      <div className="flex gap-1">
        <input
          className="input-base py-2 text-sm flex-1"
          placeholder="Pegá la URL de la imagen (ej: https://res.cloudinary.com/...)"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
          autoFocus
        />
        <button type="button" onClick={handleUrlSubmit}
          className="bg-amber-600 hover:bg-amber-500 text-white px-3 rounded-lg transition-colors font-medium text-sm">
          OK
        </button>
        <button type="button" onClick={() => setMode('idle')}
          className="bg-stone-100 hover:bg-stone-200 text-stone-500 px-2.5 rounded-lg transition-colors">
          <FontAwesomeIcon icon={faTimes} size="xs" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {widgetOk ? (
        <button type="button" onClick={openWidget}
          className="flex-1 flex flex-col items-center gap-1.5 py-4 border-2 border-dashed border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-colors">
          <FontAwesomeIcon icon={faCamera} className="text-amber-500 text-lg" />
          <span className="text-amber-700 text-sm font-medium">Subir imagen</span>
          <span className="text-stone-400 text-xs">PNG, JPG, WebP · Máx 5MB</span>
        </button>
      ) : (
        <div className="flex-1 border-2 border-dashed border-stone-200 rounded-lg p-3 text-center">
          <p className="text-xs text-stone-400 mb-1">Widget no configurado</p>
          <p className="text-[10px] text-stone-300">Usá "Pegar URL" o configurá las variables de Cloudinary</p>
        </div>
      )}
      <button type="button" onClick={() => setMode('url')}
        className="flex flex-col items-center gap-1.5 py-4 px-4 border-2 border-dashed border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 hover:border-stone-300 transition-colors">
        <FontAwesomeIcon icon={faLink} className="text-stone-400 text-lg" />
        <span className="text-stone-500 text-xs font-medium">Pegar URL</span>
      </button>
    </div>
  );
};

export default CloudinaryUpload;
