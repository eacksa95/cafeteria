import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import About from '../info/About';
import Contact from '../info/Contact';
import '../../estilos/info.css';

export const Foo = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer className="footer-container">
        <div className="footer-content">
          <button onClick={() => setShowAbout(true)} className="footer-link">
            <FontAwesomeIcon icon={faInfoCircle} className="footer-icon" />
            <span>Nosotros</span>
          </button>
          <button onClick={() => setShowContact(true)} className="footer-link">
            <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
            <span>Contacto</span>
          </button>
        </div>
      </footer>

      {/* About Modal */}
      <div className={`modal-overlay ${showAbout ? 'show' : ''}`} onClick={() => setShowAbout(false)}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowAbout(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="modal-content">
            <About />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <div className={`modal-overlay ${showContact ? 'show' : ''}`} onClick={() => setShowContact(false)}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowContact(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="modal-content">
            <Contact />
          </div>
        </div>
      </div>
    </>
  );
};