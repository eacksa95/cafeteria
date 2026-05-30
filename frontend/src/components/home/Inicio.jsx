import coffeeIcon from '../../assets/coffee.svg';

export const Inicio = ({ children }) => {
  return (
    <div className="page">
      {children ? (
        <div>{children}</div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <img src={coffeeIcon} alt="Coffee" className="w-16 h-16 mb-6 opacity-60" />
          <h1 className="text-3xl font-bold text-stone-100 mb-2">Coffee Shop</h1>
          <p className="text-stone-400 text-sm mb-8">Sistema de gestión de pedidos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
            {['Pedidos', 'Productos', 'Carrito', 'Cocina'].map(item => (
              <div key={item} className="bg-stone-900 rounded-xl border border-stone-800 p-4 text-stone-400 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
