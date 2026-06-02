import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryOk  = CLOUD_NAME && UPLOAD_PRESET && CLOUD_NAME !== 'tu-cloud-name';

const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', 'cafeteria/perfiles');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
};

/**
 * Avatar circular con drag & drop para subir fotos de perfil a Cloudinary.
 * Props:
 *   currentUrl  – URL actual de la foto (string | '')
 *   onUpload    – callback(newUrl: string)
 *   onRemove    – callback()
 *   size        – 'sm' | 'md' | 'lg'  (default: 'lg')
 */
const ProfilePhotoUpload = ({ currentUrl, onUpload, onRemove, size = 'lg' }) => {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlMode,   setUrlMode]   = useState(false);
  const [urlInput,  setUrlInput]  = useState('');
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  const sizeMap = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base',
  };
  const iconMap = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) { setError('Solo imágenes'); return; }
    setError('');
    if (!cloudinaryOk) { setUrlMode(true); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUpload(url);
    } catch { setError('Error al subir'); }
    finally { setUploading(false); }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const submitUrl = () => {
    const url = urlInput.trim();
    if (url) { onUpload(url); setUrlInput(''); setUrlMode(false); }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar circular */}
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative ${sizeMap[size]} rounded-full cursor-pointer overflow-hidden flex-shrink-0
          border-2 transition-all select-none
          ${dragging ? 'border-amber-400 scale-105' : 'border-stone-600 hover:border-amber-500'}
        `}
        title="Clic o arrastrá una imagen"
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        {currentUrl ? (
          <>
            <img src={currentUrl} alt="foto" className="w-full h-full object-cover" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <FontAwesomeIcon icon={faCamera} className="text-white text-lg" />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-stone-800 flex flex-col items-center justify-center gap-0.5">
            <FontAwesomeIcon icon={faCamera} className={`text-stone-500 ${iconMap[size]}`} />
          </div>
        )}

        {/* Uploading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Drag highlight ring */}
        {dragging && (
          <div className="absolute inset-0 rounded-full border-4 border-amber-400 pointer-events-none" />
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-[10px]">{error}</p>}

      {/* Acciones pequeñas bajo el avatar */}
      {!urlMode ? (
        <div className="flex items-center gap-2 text-[10px] text-stone-500">
          {!cloudinaryOk && (
            <button type="button" onClick={() => setUrlMode(true)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <FontAwesomeIcon icon={faLink} size="xs" /> URL
            </button>
          )}
          {currentUrl && (
            <button type="button" onClick={onRemove}
              className="flex items-center gap-1 hover:text-red-400 transition-colors">
              <FontAwesomeIcon icon={faTimes} size="xs" /> Quitar
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-1 w-full max-w-[200px]">
          <input
            className="input-base py-1 text-xs flex-1 text-xs"
            placeholder="https://..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitUrl()}
            autoFocus
          />
          <button type="button" onClick={submitUrl}
            className="bg-amber-600 hover:bg-amber-500 text-white px-2 rounded-lg text-xs">
            <FontAwesomeIcon icon={faCheck} size="xs" />
          </button>
          <button type="button" onClick={() => setUrlMode(false)}
            className="bg-stone-700 hover:bg-stone-600 text-stone-300 px-2 rounded-lg text-xs">
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
