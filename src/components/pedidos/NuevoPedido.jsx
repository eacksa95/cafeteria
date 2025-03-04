
const nuevoPedidoHandle = () => { window.alert("Nuevo Pedido") }
const NuevoPedido = () => {
  return (
    <>
      <form onSubmit={nuevoPedidoHandle}>
        <h2>Nuevo Pedido</h2><hr />
        <input
          aria-label="Username"
          placeholder="Username"
          id="username"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />
        <input
          aria-label="Password"
          placeholder="Password"
          id="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default NuevoPedido