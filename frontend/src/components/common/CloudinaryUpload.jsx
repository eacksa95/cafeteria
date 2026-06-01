/**
 * CloudinaryUpload — Subida de imágenes sin exposición de URLs.
 *
 * Setup en Cloudinary:
 * 1. Crear cuenta gratuita en cloudinary.com (25GB storage, 25GB/mes)
 * 2. En el Dashboard verás tu Cloud Name arriba a la derecha (ej: "dxyz123abc")
 * 3. Ir a Settings → Upload → "Add upload preset"
 *    - Signing mode: Unsigned    ← IMPORTANTE
 *    - Guardar → copiar el NOMBRE del preset (ej: "coffeeshop_productos")
 *
 * Variables de entorno (.env y Netlify):
 *   VITE_CLOUDINARY_CLOUD_NAME=dxyz123abc          ← tu cloud name real
 *   VITE_CLOUDINARY_UPLOAD_PRESET=coffeeshop_productos  ← nombre del preset
 *
 * NOTA: API Key y API Secret son para backend firmado — NO van aquí.
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CloudinaryUpload = ({ currentUrl, onUpload, onRemove }) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'tu-cloud-name') {
    return (
      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 space-y-1">
        <p className="font-semibold">⚙️ Cloudinary no configurado</p>
        <p>Agregá en Netlify (o .env):</p>
        <code className="block bg-amber-100 rounded px-2 py-1 text-[11px] leading-relaxed">
          VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name<br/>
          VITE_CLOUDINARY_UPLOAD_PRESET=nombre-preset
        </code>
        <p className="text-amber-600">El Cloud Name está en la esquina superior derecha del Dashboard. El preset se crea en Settings → Upload → Add upload preset (Unsigned).</p>
      </div>
    );
  }

  const openWidget = () => {
    if (!window.cloudinary) {
      alert('Widget de Cloudinary no disponible. Verificá la conexión a internet.');
      return;
    }
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'camera'],
        multiple: false,
        cropping: false,
        resourceType: 'image',
        maxFileSize: 3000000,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      },
      (error, result) => {
        if (error) return;
        if (result?.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );
  };

  if (currentUrl) {
    return (
      <div className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
        <img
          src={currentUrl}
          alt="Vista previa"
          className="w-14 h-14 object-cover rounded-lg border border-stone-200 flex-shrink-0"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="flex flex-col gap-2">
          <button type="button" onClick={openWidget}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
            <FontAwesomeIcon icon={faArrowsRotate} size="xs" />
            Cambiar imagen
          </button>
          <button type="button" onClick={onRemove}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs transition-colors">
            <FontAwesomeIcon icon={faTimes} size="xs" />
            Quitar imagen
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-colors"
    >
      <FontAwesomeIcon icon={faCamera} className="text-amber-500 text-xl" />
      <span className="text-amber-700 text-sm font-medium">Subir imagen</span>
      <span className="text-stone-400 text-xs">PNG, JPG, GIF, WebP · Máx 3MB</span>
    </button>
  );
};

export default CloudinaryUpload;
