-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-03-2025 a las 14:16:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `libreria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo_carrito`
--

CREATE TABLE `articulo_carrito` (
  `Id_Articulo_Carrito` int(11) NOT NULL,
  `Id_Carrito` int(11) DEFAULT NULL,
  `Id_Libro` int(11) DEFAULT NULL,
  `Art_Carr_Cantidad` int(11) NOT NULL,
  `Art_Carr_Precio_Unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_compras`
--

CREATE TABLE `carrito_compras` (
  `Id_Carrito` int(11) NOT NULL,
  `Id_Cliente` int(11) DEFAULT NULL,
  `CartrCompr_Estado` varchar(50) NOT NULL,
  `CartrCompr_FechaCreacion` datetime DEFAULT current_timestamp(),
  `CartrCompr_FechaActualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `Id_Categoria` int(11) NOT NULL,
  `Cat_Nombre` varchar(100) NOT NULL,
  `Cat_Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`Id_Categoria`, `Cat_Nombre`, `Cat_Descripcion`) VALUES
(1, 'ficcion', 'Libros de ciencia ficción y fantasía'),
(5, 'Misterios', 'Libros de Misterios'),
(8, 'Misterio', 'Misterios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `Id_Cliente` int(11) NOT NULL,
  `Cli_Nombre` varchar(100) NOT NULL,
  `Cli_Apellido` varchar(100) NOT NULL,
  `Cli_Telefono` varchar(15) DEFAULT NULL,
  `Cli_CorreoElect` varchar(100) NOT NULL,
  `Cli_Direccion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`Id_Cliente`, `Cli_Nombre`, `Cli_Apellido`, `Cli_Telefono`, `Cli_CorreoElect`, `Cli_Direccion`) VALUES
(1, 'Miguel', 'Lopez', '3126598785', 'miguel@gmail.com', 'carrera 10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_compra`
--

CREATE TABLE `detalles_compra` (
  `Id_Detalles_Compra` int(11) NOT NULL,
  `Id_Compra` int(11) DEFAULT NULL,
  `Id_Libro` int(11) DEFAULT NULL,
  `Det_Comp_Cantidad` int(11) NOT NULL,
  `Det_Comp_Precio_Unitario` decimal(10,2) NOT NULL,
  `Det_Comp_Subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `Id_Libro` int(11) NOT NULL,
  `Lib_Titulo` varchar(255) NOT NULL,
  `Lib_Precio` decimal(10,2) NOT NULL,
  `Lib_Categoria` int(11) NOT NULL,
  `Lib_Imagen` varchar(255) DEFAULT NULL,
  `Lib_Tipo` enum('Libro','Biblia','Novena') NOT NULL,
  `Lib_Editorial` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`Id_Libro`, `Lib_Titulo`, `Lib_Precio`, `Lib_Categoria`, `Lib_Imagen`, `Lib_Tipo`, `Lib_Editorial`) VALUES
(1, 'El Señor de los Anillos', 25.99, 1, 'imagen.jpg', 'Libro', NULL),
(5, 'La sombra del viento', 14.05, 1, 'imagen.jpg', 'Libro', NULL),
(8, 'La trama Oscura', 70000.00, 8, 'img.jpg', 'Libro', 'Misterio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `Id_Metodo_Pago` int(11) NOT NULL,
  `Met_Pag_Nombre` varchar(100) NOT NULL,
  `Met_Pag_Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `Id_Pago` int(11) NOT NULL,
  `Id_Metodo_Pago` int(11) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo_carrito`
--
ALTER TABLE `articulo_carrito`
  ADD PRIMARY KEY (`Id_Articulo_Carrito`),
  ADD KEY `Id_Carrito` (`Id_Carrito`),
  ADD KEY `Id_Libro` (`Id_Libro`);

--
-- Indices de la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  ADD PRIMARY KEY (`Id_Carrito`),
  ADD KEY `Id_Cliente` (`Id_Cliente`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`Id_Categoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`Id_Cliente`);

--
-- Indices de la tabla `detalles_compra`
--
ALTER TABLE `detalles_compra`
  ADD PRIMARY KEY (`Id_Detalles_Compra`),
  ADD KEY `Id_Libro` (`Id_Libro`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`Id_Libro`),
  ADD KEY `Lib_Categoria` (`Lib_Categoria`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`Id_Metodo_Pago`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`Id_Pago`),
  ADD KEY `Id_Metodo_Pago` (`Id_Metodo_Pago`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo_carrito`
--
ALTER TABLE `articulo_carrito`
  MODIFY `Id_Articulo_Carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  MODIFY `Id_Carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `Id_Categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `Id_Cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalles_compra`
--
ALTER TABLE `detalles_compra`
  MODIFY `Id_Detalles_Compra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `Id_Libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `Id_Metodo_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `Id_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulo_carrito`
--
ALTER TABLE `articulo_carrito`
  ADD CONSTRAINT `articulo_carrito_ibfk_1` FOREIGN KEY (`Id_Carrito`) REFERENCES `carrito_compras` (`Id_Carrito`),
  ADD CONSTRAINT `articulo_carrito_ibfk_2` FOREIGN KEY (`Id_Libro`) REFERENCES `libros` (`Id_Libro`);

--
-- Filtros para la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  ADD CONSTRAINT `carrito_compras_ibfk_1` FOREIGN KEY (`Id_Cliente`) REFERENCES `clientes` (`Id_Cliente`);

--
-- Filtros para la tabla `detalles_compra`
--
ALTER TABLE `detalles_compra`
  ADD CONSTRAINT `detalles_compra_ibfk_1` FOREIGN KEY (`Id_Libro`) REFERENCES `libros` (`Id_Libro`);

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`Lib_Categoria`) REFERENCES `categorias` (`Id_Categoria`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`Id_Metodo_Pago`) REFERENCES `metodo_pago` (`Id_Metodo_Pago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
