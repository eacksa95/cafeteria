import { useState } from 'react';
import coffeeIcon from '../../assets/coffee.svg';

export const Inicio = ({ aboutContent, children }) => {
  const [activePromo, setActivePromo] = useState(0);
  
  const promos = [
    {
      title: "Café del día",
      description: "Prueba nuestro blend especial de granos seleccionados",
      price: "$2.50"
    },
    {
      title: "Combo Desayuno",
      description: "Café + 2 medialunas + jugo de naranja",
      price: "$5.99"
    },
    {
      title: "Merienda Completa",
      description: "Café + 3 medialunas + cheesecake",
      price: "$7.99"
    }
  ];

  return (
    <div className="inicio-container">
      <div className="inicio-hero">
        <div className="hero-content">
        <img 
            src={coffeeIcon} 
            alt="Coffee Icon" 
            style={{ width: '48px', height: '48px' }} 
            className="coffee-icon"
          />
          <h1 className="hero-title">Coffee Shop</h1>
          <p className="hero-subtitle">Donde cada sorbo cuenta una historia</p>
        </div>
      </div>

      <div className="inicio-content">
        <div className="inicio-left">
          <section className="welcome-section">
            <h2>Bienvenido a Coffee Shop</h2>
            <p>
              Disfruta de la mejor selección de cafés artesanales y deliciosas medialunas
              recién horneadas. Un espacio pensado para tus momentos especiales.
            </p>
          </section>

          <section className="featured-section">
            <h3>Promociones del día</h3>
            <div className="promo-cards">
              {promos.map((promo, index) => (
                <div 
                  key={index} 
                  className={`promo-card ${activePromo === index ? 'active' : ''}`}
                  onClick={() => setActivePromo(index)}
                >
                  <h4>{promo.title}</h4>
                  <p>{promo.description}</p>
                  <span className="price">{promo.price}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="specialties-section">
            <h3>Nuestras Especialidades</h3>
            <div className="specialties-grid">
              <div className="specialty-item">
                <h4>Café Espresso</h4>
                <p>Intenso y aromático</p>
              </div>
              <div className="specialty-item">
                <h4>Medialunas</h4>
                <p>Recién horneadas</p>
              </div>
              <div className="specialty-item">
                <h4>Cappuccino</h4>
                <p>Cremoso y perfecto</p>
              </div>
              <div className="specialty-item">
                <h4>Café Helado</h4>
                <p>Refrescante</p>
              </div>
            </div>
          </section>
        </div>

        <div className="inicio-right">
          {children}
          {aboutContent && (
            <div className="about-content">
              {aboutContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};