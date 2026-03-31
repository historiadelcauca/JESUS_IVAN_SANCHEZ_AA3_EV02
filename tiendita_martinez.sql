-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 24-02-2026 a las 06:45:26
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendita_martinez`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(2, 'Aseo'),
(1, 'Bebidas'),
(4, 'Granos'),
(3, 'Snacks');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `idCliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `puntosAcumulados` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`idCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`idCliente`, `nombre`, `telefono`, `puntosAcumulados`) VALUES
(1, 'Cliente General', '0000000000', 0),
(2, 'María Fernanda López', '3104567890', 120),
(3, 'Carlos Andrés Martínez', '3115678901', 85),
(4, 'Laura Sofía Gómez', '3126789012', 200),
(5, 'Jorge Eduardo Ramírez', '3137890123', 45),
(6, 'Ana Milena Torres', '3148901234', 300),
(7, 'Luis Alberto Hernández', '3159012345', 60),
(8, 'Paola Andrea Vargas', '3160123456', 150),
(9, 'Diego Alejandro Castillo', '3171234567', 95),
(10, 'Natalia Fernanda Rojas', '3182345678', 250),
(11, 'Santiago David Morales', '3193456789', 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

DROP TABLE IF EXISTS `detalle_ventas`;
CREATE TABLE IF NOT EXISTS `detalle_ventas` (
  `idDetalle` int NOT NULL AUTO_INCREMENT,
  `idVenta` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idDetalle`),
  KEY `fk_detalle_venta` (`idVenta`),
  KEY `fk_detalle_producto` (`idProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`idDetalle`, `idVenta`, `idProducto`, `cantidad`, `precioUnitario`, `subtotal`) VALUES
(1, 2, 1, 2, 4500.00, 0.00),
(2, 2, 2, 1, 2200.00, 0.00),
(3, 3, 1, 2, 4500.00, 9000.00),
(4, 3, 2, 1, 2200.00, 2200.00),
(5, 4, 4, 3, 4200.00, 12600.00),
(6, 4, 3, 5, 1500.00, 7500.00),
(7, 4, 5, 1, 2500.00, 2500.00),
(8, 5, 1, 1, 4500.00, 4500.00),
(9, 6, 1, 3, 4500.00, 13500.00),
(10, 7, 1, 3, 4500.00, 13500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE IF NOT EXISTS `empleados` (
  `idEmpleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idEmpleado`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`idEmpleado`, `nombre`, `rol`, `usuario`, `password`) VALUES
(2, 'Ana María Rodríguez López', 'Cajero Principal', 'arodriguez', 'AnaR0d#2026!'),
(3, 'Carlos Andrés Martínez Gómez', 'Cajero', 'cmartinez', 'CarL0s@789X'),
(4, 'Laura Fernanda Torres Díaz', 'Administrador', 'ltorres', 'LauT0rr3s*91'),
(5, 'Mateo Sebastián Herrera Ruiz', 'Supervisor', 'mherrera', 'Mat3oH#45$'),
(6, 'Clara Martínez', 'Gerente', 'cmartinezg', 'Cl4r4M@rt!2026'),
(9, 'Empleado Test Backend', 'Administrador', 'backend_test_01', '123456'),
(10, 'Luis Fernando Bodega', 'Encargado de Bodega', 'lbodega', 'bodega123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

DROP TABLE IF EXISTS `inventario`;
CREATE TABLE IF NOT EXISTS `inventario` (
  `idInventario` int NOT NULL AUTO_INCREMENT,
  `idProducto` int NOT NULL,
  `ubicacion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stockActual` int NOT NULL DEFAULT '0',
  `stockMinimo` int NOT NULL DEFAULT '0',
  `fechaUltimaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idInventario`),
  UNIQUE KEY `uq_inventario_idProducto` (`idProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`idInventario`, `idProducto`, `ubicacion`, `stockActual`, `stockMinimo`, `fechaUltimaActualizacion`) VALUES
(1, 1, 'Bodega A', 39, 10, '2026-02-24 01:40:57'),
(2, 2, 'Bodega A', 98, 15, '2026-02-24 00:16:03'),
(3, 3, 'Bodega B', 75, 20, '2026-02-24 00:17:24'),
(4, 4, 'Bodega A', 57, 12, '2026-02-24 00:17:24'),
(5, 5, 'Bodega A', 39, 10, '2026-02-24 00:17:24'),
(6, 6, 'Bodega A', 55, 12, '2026-02-23 22:29:31'),
(7, 7, 'Bodega A', 45, 10, '2026-02-23 22:29:31'),
(8, 8, 'Bodega B', 35, 8, '2026-02-23 22:29:31'),
(9, 9, 'Bodega B', 25, 6, '2026-02-23 22:29:31'),
(10, 10, 'Bodega B', 20, 5, '2026-02-23 22:29:31'),
(11, 13, 'Bodega A', 15, 3, '2026-02-23 22:29:31'),
(12, 15, 'Bodega A', 15, 3, '2026-02-23 22:29:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

DROP TABLE IF EXISTS `movimientos_inventario`;
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `idMovimiento` int NOT NULL AUTO_INCREMENT,
  `idProducto` int NOT NULL,
  `tipo` enum('ENTRADA','SALIDA','AJUSTE') NOT NULL,
  `cantidad` int NOT NULL,
  `stockAntes` int NOT NULL,
  `stockDespues` int NOT NULL,
  `motivo` varchar(120) NOT NULL,
  `referenciaTabla` varchar(30) DEFAULT NULL,
  `referenciaId` int DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idMovimiento`),
  KEY `idx_mov_inv_producto_fecha` (`idProducto`,`fecha`),
  KEY `idx_mov_inv_referencia` (`referenciaTabla`,`referenciaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `nombre` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigoBarra` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precioVenta` decimal(10,2) NOT NULL,
  `precioCompra` decimal(10,2) NOT NULL,
  `categoria` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unidadMedida` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  PRIMARY KEY (`idProducto`),
  UNIQUE KEY `codigoBarra` (`codigoBarra`),
  KEY `fk_productos_categorias` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProducto`, `categoria_id`, `nombre`, `codigoBarra`, `precioVenta`, `precioCompra`, `categoria`, `unidadMedida`, `fechaVencimiento`) VALUES
(1, 1, 'Gaseosa 1.5L', 'BEB001', 4500.00, 3500.00, 'Bebidas', 'Unidad', '2026-09-30'),
(2, 2, 'Jabón de baño', 'ASE001', 2200.00, 1500.00, 'Aseo', 'Unidad', NULL),
(3, 3, 'Papas fritas', 'SNK001', 1500.00, 1000.00, 'Snacks', 'Unidad', '2026-07-15'),
(4, 1, 'Leche Alpina 1L', 'LEC001', 4200.00, 3500.00, 'Bebidas', 'Unidad', '2026-04-10'),
(5, 3, 'Chocoramo', 'CHO001', 2500.00, 1800.00, 'Snacks', 'Unidad', '2026-05-20'),
(6, 1, 'Yogurt Alpina Fresa 200ml', 'YOG001', 3000.00, 2200.00, 'Bebidas', 'Unidad', '2026-03-26'),
(7, 1, 'Leche Entera 1L', 'LEC002', 4200.00, 3500.00, 'Bebidas', 'Unidad', '2026-03-10'),
(8, 3, 'Pan tajado', 'PAN001', 5500.00, 4200.00, 'Snacks', 'Unidad', '2026-02-28'),
(9, 3, 'Queso campesino 250g', 'QUE001', 8000.00, 6500.00, 'Snacks', 'Unidad', '2026-03-05'),
(10, 3, 'Jamón 250g', 'JAM001', 9000.00, 7200.00, 'Snacks', 'Unidad', '2026-03-08'),
(13, 1, 'Producto prueba', 'TEST123', 5000.00, 3000.00, 'Bebidas', 'Unidad', '2026-12-31'),
(15, 1, 'Producto prueba', 'TEST124', 5000.00, 3000.00, 'Bebidas', 'Unidad', '2026-12-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'Administrador'),
(3, 'Bodeguero'),
(2, 'Cajero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `fk_usuarios_roles` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `rol_id`, `nombre`, `email`, `usuario`, `password_hash`, `activo`, `created_at`) VALUES
(1, 1, 'Administrador General', 'admin@tiendita.local', 'admin', 'CAMBIAR_POR_HASH_BCRYPT', 1, '2026-02-17 21:12:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `idVenta` int NOT NULL AUTO_INCREMENT,
  `fechaHora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `totalPagar` decimal(10,2) NOT NULL DEFAULT '0.00',
  `metodoPago` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMPLETADA',
  `idEmpleado` int NOT NULL,
  `idCliente` int DEFAULT NULL,
  PRIMARY KEY (`idVenta`),
  KEY `fk_ventas_empleado` (`idEmpleado`),
  KEY `fk_ventas_cliente` (`idCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `fechaHora`, `totalPagar`, `metodoPago`, `estado`, `idEmpleado`, `idCliente`) VALUES
(2, '2026-02-24 00:06:24', 11200.00, 'efectivo', 'FINALIZADA', 2, 2),
(3, '2026-02-24 00:16:03', 11200.00, 'efectivo', 'FINALIZADA', 2, 2),
(4, '2026-02-24 00:17:24', 22600.00, 'EFECTIVO', 'FINALIZADA', 2, 2),
(5, '2026-02-24 01:36:36', 4500.00, 'Efectivo', 'FINALIZADA', 2, NULL),
(6, '2026-02-24 01:39:01', 13500.00, 'Tarjeta', 'FINALIZADA', 2, NULL),
(7, '2026-02-24 01:40:57', 13500.00, 'Tarjeta', 'FINALIZADA', 2, NULL);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_venta` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`idVenta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `fk_inventario_producto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inventario_productos` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `fk_movimientos_productos` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `fk_ventas_cliente` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`idCliente`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ventas_empleado` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
