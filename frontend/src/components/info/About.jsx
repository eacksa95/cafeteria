import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faUsers, faStar } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  const features = [
    {
      icon: faCoffee,
      title: "Café de Calidad",
      description: "Seleccionamos los mejores granos para brindarte una experiencia única en cada taza."
    },
    {
      icon: faUsers,
      title: "Servicio Personalizado",
      description: "Nuestro equipo está comprometido a hacer de tu visita un momento especial."
    },
    {
      icon: faStar,
      title: "Experiencia Única",
      description: "Más que una cafetería, somos un espacio para crear momentos memorables."
    }
  ];

  return (
    <div className="about-container">
      <section className="about-hero">
        <h2 className="section-title">Nuestra Historia</h2>
        <p className="section-description">
          En Coffee Shop, nuestra pasión por el café nos impulsa a brindar 
          experiencias excepcionales desde 2010. Cada taza que servimos lleva 
          consigo nuestra dedicación por la excelencia y el amor por el buen café.
        </p>
      </section>

      <section className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="about-mission">
        <h2 className="section-title">Nuestra Misión</h2>
        <p className="section-description">
          Buscamos crear un espacio acogedor donde cada cliente se sienta como en casa, 
          mientras disfruta de la mejor selección de cafés y productos horneados frescos. 
          Nos esforzamos por mantener los más altos estándares de calidad y servicio.
        </p>
      </section>
    </div>
  );
};

export default About;