<<<<<<< HEAD
const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ==================== PRODUCTOS ====================

// Traer todos los productos
app.get('/api/productos', (req, res) => {
  const { categoria } = req.query;
  let productos;
  if (categoria) {
    productos = db.prepare('SELECT * FROM productos WHERE categoria = ?').all(categoria);
  } else {
    productos = db.prepare('SELECT * FROM productos').all();
  }
  res.json(productos);
});

// Traer un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// Agregar producto (admin)
app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  db.prepare('INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)')
    .run(nombre, descripcion, precio, stock, categoria, imagen);
  res.json({ mensaje: 'Producto agregado' });
});

// Editar producto (admin)
app.put('/api/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  db.prepare('UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?')
    .run(nombre, descripcion, precio, stock, categoria, imagen, req.params.id);
  res.json({ mensaje: 'Producto actualizado' });
});

// Borrar producto (admin)
app.delete('/api/productos/:id', (req, res) => {
  db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
  res.json({ mensaje: 'Producto borrado' });
});

// ==================== USUARIOS ====================

// Registro
app.post('/api/registro', (req, res) => {
  const { nombre, email, password } = req.body;
  const existe = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (existe) return res.status(400).json({ error: 'El email ya está registrado' });
  db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)')
    .run(nombre, email, password);
  res.json({ mensaje: 'Usuario registrado' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND password = ?').get(email, password);
  if (!usuario) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  res.json({ mensaje: 'Login exitoso', usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
});

// ==================== CARRITO ====================

// Traer carrito de un usuario
app.get('/api/carrito/:usuario_id', (req, res) => {
  const items = db.prepare(`
    SELECT carrito.id, carrito.cantidad, productos.nombre, productos.precio, productos.imagen
    FROM carrito
    JOIN productos ON carrito.producto_id = productos.id
    WHERE carrito.usuario_id = ?
  `).all(req.params.usuario_id);
  res.json(items);
});

// Agregar al carrito
app.post('/api/carrito', (req, res) => {
  const { usuario_id, producto_id } = req.body;
  const existe = db.prepare('SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?').get(usuario_id, producto_id);
  if (existe) {
    db.prepare('UPDATE carrito SET cantidad = cantidad + 1 WHERE id = ?').run(existe.id);
  } else {
    db.prepare('INSERT INTO carrito (usuario_id, producto_id) VALUES (?, ?)').run(usuario_id, producto_id);
  }
  res.json({ mensaje: 'Agregado al carrito' });
});

// Quitar del carrito
app.delete('/api/carrito/:id', (req, res) => {
  db.prepare('DELETE FROM carrito WHERE id = ?').run(req.params.id);
  res.json({ mensaje: 'Eliminado del carrito' });
});

// ==================== PEDIDOS ====================

// Crear pedido
app.post('/api/pedidos', (req, res) => {
  const { usuario_id, items, total } = req.body;
  const fecha = new Date().toLocaleDateString('es-UY');
  const pedido = db.prepare('INSERT INTO pedidos (usuario_id, fecha, total) VALUES (?, ?, ?)')
    .run(usuario_id, fecha, total);
  for (const item of items) {
    db.prepare('INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)')
      .run(pedido.lastInsertRowid, item.producto_id, item.cantidad, item.precio);
    db.prepare('UPDATE productos SET stock = stock - ? WHERE id = ?').run(item.cantidad, item.producto_id);
  }
  db.prepare('DELETE FROM carrito WHERE usuario_id = ?').run(usuario_id);
  res.json({ mensaje: 'Pedido realizado' });
});

// Traer pedidos de un usuario
app.get('/api/pedidos/:usuario_id', (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC').all(req.params.usuario_id);
  res.json(pedidos);
});

// Traer todos los pedidos (admin)
app.get('/api/admin/pedidos', (req, res) => {
  const pedidos = db.prepare(`
    SELECT pedidos.*, usuarios.nombre as cliente
    FROM pedidos
    JOIN usuarios ON pedidos.usuario_id = usuarios.id
    ORDER BY pedidos.id DESC
  `).all();
  res.json(pedidos);
});

// Actualizar estado del pedido (admin)
app.put('/api/pedidos/:id/estado', (req, res) => {
  const { estado } = req.body;
  db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, req.params.id);
  res.json({ mensaje: 'Estado actualizado' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
=======
const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ==================== PRODUCTOS ====================

// Traer todos los productos
app.get('/api/productos', (req, res) => {
  const { categoria } = req.query;
  let productos;
  if (categoria) {
    productos = db.prepare('SELECT * FROM productos WHERE categoria = ?').all(categoria);
  } else {
    productos = db.prepare('SELECT * FROM productos').all();
  }
  res.json(productos);
});

// Traer un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// Agregar producto (admin)
app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  db.prepare('INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)')
    .run(nombre, descripcion, precio, stock, categoria, imagen);
  res.json({ mensaje: 'Producto agregado' });
});

// Editar producto (admin)
app.put('/api/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  db.prepare('UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?')
    .run(nombre, descripcion, precio, stock, categoria, imagen, req.params.id);
  res.json({ mensaje: 'Producto actualizado' });
});

// Borrar producto (admin)
app.delete('/api/productos/:id', (req, res) => {
  db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
  res.json({ mensaje: 'Producto borrado' });
});

// ==================== USUARIOS ====================

// Registro
app.post('/api/registro', (req, res) => {
  const { nombre, email, password } = req.body;
  const existe = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (existe) return res.status(400).json({ error: 'El email ya está registrado' });
  db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)')
    .run(nombre, email, password);
  res.json({ mensaje: 'Usuario registrado' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND password = ?').get(email, password);
  if (!usuario) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  res.json({ mensaje: 'Login exitoso', usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
});

// ==================== CARRITO ====================

// Traer carrito de un usuario
app.get('/api/carrito/:usuario_id', (req, res) => {
  const items = db.prepare(`
    SELECT carrito.id, carrito.cantidad, productos.nombre, productos.precio, productos.imagen
    FROM carrito
    JOIN productos ON carrito.producto_id = productos.id
    WHERE carrito.usuario_id = ?
  `).all(req.params.usuario_id);
  res.json(items);
});

// Agregar al carrito
app.post('/api/carrito', (req, res) => {
  const { usuario_id, producto_id } = req.body;
  const existe = db.prepare('SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?').get(usuario_id, producto_id);
  if (existe) {
    db.prepare('UPDATE carrito SET cantidad = cantidad + 1 WHERE id = ?').run(existe.id);
  } else {
    db.prepare('INSERT INTO carrito (usuario_id, producto_id) VALUES (?, ?)').run(usuario_id, producto_id);
  }
  res.json({ mensaje: 'Agregado al carrito' });
});

// Quitar del carrito
app.delete('/api/carrito/:id', (req, res) => {
  db.prepare('DELETE FROM carrito WHERE id = ?').run(req.params.id);
  res.json({ mensaje: 'Eliminado del carrito' });
});

// ==================== PEDIDOS ====================

// Crear pedido
app.post('/api/pedidos', (req, res) => {
  const { usuario_id, items, total } = req.body;
  const fecha = new Date().toLocaleDateString('es-UY');
  const pedido = db.prepare('INSERT INTO pedidos (usuario_id, fecha, total) VALUES (?, ?, ?)')
    .run(usuario_id, fecha, total);
  for (const item of items) {
    db.prepare('INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)')
      .run(pedido.lastInsertRowid, item.producto_id, item.cantidad, item.precio);
    db.prepare('UPDATE productos SET stock = stock - ? WHERE id = ?').run(item.cantidad, item.producto_id);
  }
  db.prepare('DELETE FROM carrito WHERE usuario_id = ?').run(usuario_id);
  res.json({ mensaje: 'Pedido realizado' });
});

// Traer pedidos de un usuario
app.get('/api/pedidos/:usuario_id', (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC').all(req.params.usuario_id);
  res.json(pedidos);
});

// Traer todos los pedidos (admin)
app.get('/api/admin/pedidos', (req, res) => {
  const pedidos = db.prepare(`
    SELECT pedidos.*, usuarios.nombre as cliente
    FROM pedidos
    JOIN usuarios ON pedidos.usuario_id = usuarios.id
    ORDER BY pedidos.id DESC
  `).all();
  res.json(pedidos);
});

// Actualizar estado del pedido (admin)
app.put('/api/pedidos/:id/estado', (req, res) => {
  const { estado } = req.body;
  db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, req.params.id);
  res.json({ mensaje: 'Estado actualizado' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
>>>>>>> c28250540591c373abc6cac62f31db3e9df923b9
});