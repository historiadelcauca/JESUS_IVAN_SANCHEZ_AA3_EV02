// ============================================================
// Pruebas unitarias - Módulo de Clientes
// Proyecto: La Tiendita Martínez
// Herramientas: Jest + node-mocks-http
// ============================================================

const httpMocks = require("node-mocks-http");

// ── Simulamos la conexión a la base de datos ──
const conexionMock = {
  query: jest.fn()
};

// ── Extraemos directamente las funciones del router ──
const express = require("express");
const clienteRoutes = require("../routes/clienteRoutes");

// ============================================================
// GRUPO 1: Validaciones POST - Crear cliente
// ============================================================
describe("POST /app/clientes - Validaciones", () => {

  let postHandler;

  beforeAll(() => {
    const ruta = clienteRoutes(conexionMock);
    // Obtenemos el handler del POST "/"
    postHandler = ruta.stack
      .filter(layer => layer.route && layer.route.path === "/" && layer.route.methods.post)
      .map(layer => layer.route.stack[0].handle)[0];
  });

  beforeEach(() => {
    conexionMock.query.mockReset();
  });

  test("Debe fallar si el nombre está vacío", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { nombre: "", telefono: "3001234567", puntosAcumulados: 0 }
    });
    const res = httpMocks.createResponse();

    postHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(datos.ok).toBe(false);
    expect(datos.mensaje).toBe("Nombre y teléfono son obligatorios");
  });

  test("Debe fallar si el teléfono está vacío", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { nombre: "Juan Pérez", telefono: "", puntosAcumulados: 0 }
    });
    const res = httpMocks.createResponse();

    postHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(datos.ok).toBe(false);
    expect(datos.mensaje).toBe("Nombre y teléfono son obligatorios");
  });

  test("Debe crear cliente correctamente con datos válidos", () => {
    conexionMock.query.mockImplementation((sql, params, callback) => {
      callback(null, { insertId: 5 });
    });

    const req = httpMocks.createRequest({
      method: "POST",
      body: { nombre: "Juan Pérez", telefono: "3001234567", puntosAcumulados: 0 }
    });
    const res = httpMocks.createResponse();

    postHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(datos.ok).toBe(true);
    expect(datos.mensaje).toBe("Cliente creado correctamente");
    expect(datos.idCliente).toBe(5);
  });

});

// ============================================================
// GRUPO 2: Validaciones PUT - Actualizar cliente
// ============================================================
describe("PUT /app/clientes/:id - Validaciones", () => {

  let putHandler;

  beforeAll(() => {
    const ruta = clienteRoutes(conexionMock);
    putHandler = ruta.stack
      .filter(layer => layer.route && layer.route.path === "/:idCliente" && layer.route.methods.put)
      .map(layer => layer.route.stack[0].handle)[0];
  });

  beforeEach(() => {
    conexionMock.query.mockReset();
  });

  test("Debe fallar si el nombre está vacío al actualizar", () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      params: { idCliente: "1" },
      body: { nombre: "", telefono: "3001234567", puntosAcumulados: 10 }
    });
    const res = httpMocks.createResponse();

    putHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(datos.ok).toBe(false);
    expect(datos.mensaje).toBe("Nombre y teléfono son obligatorios");
  });

  test("Debe retornar 404 si el cliente no existe al actualizar", () => {
    conexionMock.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 0 });
    });

    const req = httpMocks.createRequest({
      method: "PUT",
      params: { idCliente: "999" },
      body: { nombre: "Pedro López", telefono: "3109876543", puntosAcumulados: 0 }
    });
    const res = httpMocks.createResponse();

    putHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(datos.ok).toBe(false);
    expect(datos.mensaje).toBe("Cliente no encontrado para actualizar");
  });

});

// ============================================================
// GRUPO 3: Validaciones DELETE - Eliminar cliente
// ============================================================
describe("DELETE /app/clientes/:id - Validaciones", () => {

  let deleteHandler;

  beforeAll(() => {
    const ruta = clienteRoutes(conexionMock);
    deleteHandler = ruta.stack
      .filter(layer => layer.route && layer.route.path === "/:idCliente" && layer.route.methods.delete)
      .map(layer => layer.route.stack[0].handle)[0];
  });

  beforeEach(() => {
    conexionMock.query.mockReset();
  });

  test("Debe retornar 404 si el cliente no existe al eliminar", () => {
    conexionMock.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 0 });
    });

    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { idCliente: "999" }
    });
    const res = httpMocks.createResponse();

    deleteHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(datos.ok).toBe(false);
    expect(datos.mensaje).toBe("Cliente no encontrado para eliminar");
  });

  test("Debe eliminar cliente correctamente", () => {
    conexionMock.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { idCliente: "1" }
    });
    const res = httpMocks.createResponse();

    deleteHandler(req, res);

    const datos = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(datos.ok).toBe(true);
    expect(datos.mensaje).toBe("Cliente eliminado correctamente");
  });

});