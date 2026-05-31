/**
 * CloudinaryUpload — Widget de subida de imágenes a Cloudinary.
 *
 * Setup:
 * 1. Crear cuenta en cloudinary.com (gratuita: 25GB storage / 25GB/mes)
 * 2. Dashboard → Settings → Upload → Add upload preset → Signing mode: Unsigned → Save
 * 3. Agregar en .env del frontend:
 *    VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
 *
 * El cloud name está visible en el Dashboard de Cloudinary (arriba a la derecha).
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CloudinaryUpload = ({ onUpload, currentUrl }) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return (
      <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        ⚠️ Configurá VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env para activar la subida de imágenes.
      </div>
    );
  }

  const openWidget = () => {
    if (!window.cloudinary) {
      alert('El widget de Cloudinary no está disponible. Verificá la conexión a internet.');
      return;
    }
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: false,
        resourceType: 'image',
        maxFileSize: 3000000, // 3MB
        language: 'es',
        text: { es: { or: 'o', back: 'Volver', close: 'Cerrar', upload_from_web: 'Desde URL', drop_title: 'Arrastrá tu imagen acá' } },
      },
      (error, result) => {
        if (error) { console.error('Cloudinary error:', error); return; }
        if (result?.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );
  };

  return (
    <div className="space-y-2">
      <button type="button" onClick={openWidget}
        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
        <FontAwesomeIcon icon={faCloudArrowUp} />
        Subir imagen a Cloudinary
      </button>
      {currentUrl && (
        <div className="flex items-center gap-2 text-xs text-emerald-600">
          <FontAwesomeIcon icon={faCheckCircle} size="xs" />
          Imagen cargada
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
