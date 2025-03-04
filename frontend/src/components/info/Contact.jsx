import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faInstagram, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const socialMedia = [
    {
      icon: faFacebookF,
      name: "Facebook",
      url: "https://facebook.com/coffeeshop",
      username: "@coffeeshop"
    },
    {
      icon: faInstagram,
      name: "Instagram",
      url: "https://instagram.com/coffeeshop",
      username: "@coffeeshop"
    },
    {
      icon: faTwitter,
      name: "Twitter",
      url: "https://twitter.com/coffeeshop",
      username: "@coffeeshop"
    }
  ];

  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: "Dirección",
      info: "Av. del Café 123, Ciudad"
    },
    {
      icon: faPhone,
      title: "Teléfono",
      info: "+1 234 567 890"
    },
    {
      icon: faEnvelope,
      title: "Email",
      info: "info@coffeeshop.com"
    }
  ];

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-description">
          Estamos aquí para atenderte. No dudes en contactarnos por cualquiera 
          de nuestros canales de comunicación.
        </p>
      </section>

      <section className="contact-info">
        <div className="info-grid">
          {contactInfo.map((item, index) => (
            <div key={index} className="info-card">
              <FontAwesomeIcon icon={item.icon} className="info-icon" />
              <h3 className="info-title">{item.title}</h3>
              <p className="info-text">{item.info}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="social-media">
        <h3 className="section-subtitle">Síguenos en redes sociales</h3>
        <div className="social-grid">
          {socialMedia.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-card"
            >
              <FontAwesomeIcon icon={social.icon} className="social-icon" />
              <span className="social-name">{social.name}</span>
              <span className="social-username">{social.username}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;