-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-05-2025 a las 23:24:17
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
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id`, `nombre`, `apellidos`, `telefono`, `correo`, `password`, `direccion`) VALUES
(17, 'juan', 'lopez', '3126598780', 'juan@gmail.com', '$2b$10$ZEVZr.ggiU23wMOJLK5nNOxd.cTURXEfIfLKs38AgTTWWlmJUrti2', 'carrera 8'),
(24, 'prueba1', 'robledo', '321654265', 'prueba@gmail.com', '$2b$10$0feFeN/zcmwgCraPISuVkO1dyhaADm9LRNomSQCaHnUPuWL7k0KTO', 'calle5'),
(26, 'Administrador', 'Principal', '3126455890', 'administrador@gmail.com', '$2b$10$immXjRsVQVBjMVFIe.btP.dVqIJ6tg2Tr5zCv5hew43nMubKEeITO', 'KR 15'),
(27, 'Manuel', 'Garcia', '3126559872', 'manuel@gmail.com', '$2b$10$sYQj5gGelGedEa49K4X/OOVOfc9AlXxMGGe9Bcfd5IQn7P.vFwFUS', 'calle 8');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alertas`
--

CREATE TABLE `alertas` (
  `id` int(11) NOT NULL,
  `tipo_alerta` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

--
-- Volcado de datos para la tabla `articulo_carrito`
--

INSERT INTO `articulo_carrito` (`Id_Articulo_Carrito`, `Id_Carrito`, `Id_Libro`, `Art_Carr_Cantidad`, `Art_Carr_Precio_Unitario`) VALUES
(11, 1, 46, 1, 0.00);

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

--
-- Volcado de datos para la tabla `carrito_compras`
--

INSERT INTO `carrito_compras` (`Id_Carrito`, `Id_Cliente`, `CartrCompr_Estado`, `CartrCompr_FechaCreacion`, `CartrCompr_FechaActualizacion`) VALUES
(1, 1, '', '2025-04-29 11:52:58', NULL),
(2, 1, '', '2025-04-29 15:30:42', NULL);

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
(1, 'libro', 'Libros de ciencia ficción y fantasía'),
(2, 'biblia', 'Libros de Misterios'),
(3, 'novena', 'adoracion');

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
-- Estructura de tabla para la tabla `esculturas`
--

CREATE TABLE `esculturas` (
  `Id_Escultura` int(11) NOT NULL,
  `Esc_Codigo` varchar(20) NOT NULL,
  `Esc_Nombre` varchar(255) NOT NULL,
  `Esc_Precio` decimal(10,2) NOT NULL,
  `Esc_Pulgadas` int(11) NOT NULL,
  `Esc_Imagen` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `publicado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `esculturas`
--

INSERT INTO `esculturas` (`Id_Escultura`, `Esc_Codigo`, `Esc_Nombre`, `Esc_Precio`, `Esc_Pulgadas`, `Esc_Imagen`, `stock`, `publicado`) VALUES
(18, '07765', 'Niño Jesús', 145000.00, 12, '/uploads/1744825054934.PNG', 2, 1),
(19, '10027', 'Divino Niño', 134000.00, 12, '/uploads/1744825309082.PNG', 5, 1),
(20, '07619', 'Divino Niño', 148000.00, 12, '/uploads/1744825790002.PNG', 25, 0),
(21, '08742', 'Divino Niño', 155000.00, 12, '/uploads/1744825908326.PNG', 3, 0),
(22, '01969', 'Divino Niño', 197000.00, 12, '/uploads/1744825919470.PNG', 10, 0),
(23, '09854', 'Niño Jesús Sentado', 120000.00, 20, '/uploads/1744827359011.PNG', 8, 0),
(24, '00740', 'Niño Jesús Sentado', 120000.00, 8, '/uploads/1744827404825.PNG', 10, 0),
(25, '00750', 'Niño Jesús Mundo', 75000.00, 15, '/uploads/1744827457801.PNG', 12, 0),
(26, '00750', 'Niño Jesús Mundo', 75000.00, 20, '/uploads/1744827498872.PNG', 8, 0);

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
  `Lib_Editorial` varchar(255) DEFAULT NULL,
  `Lib_Codigo` varchar(50) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `Lib_Publicado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`Id_Libro`, `Lib_Titulo`, `Lib_Precio`, `Lib_Categoria`, `Lib_Imagen`, `Lib_Tipo`, `Lib_Editorial`, `Lib_Codigo`, `stock`, `Lib_Publicado`) VALUES
(46, 'Biblia Infantil Ilustrada', 13000.00, 2, '/uploads/1746456110867.PNG', 'Biblia', 'Apostolado Bíblico Católico', '00017', 115, 1),
(47, 'Biblia de Jerusalén', 140000.00, 2, '/uploads/1744741022465.PNG', 'Biblia', 'Nueva Edicion Manual', '00350', 160, 1),
(48, 'Biblia Católica para Jóvenes', 70000.00, 2, '/uploads/1746456160139.PNG', 'Biblia', 'Misión Biblica Juvenil', '00363', 265, 1),
(49, 'Biblia de Jerusalen', 80000.00, 2, '/uploads/1746456232011.PNG', 'Biblia', 'Nueva Edicion Manual', '00407', 900, 1),
(50, 'Biblia  - Latinoamérica', 50000.00, 2, '/uploads/1746456261683.PNG', 'Biblia', 'Latinoamérica', '00411', 290, 1),
(51, 'Biblia Verbo Divino', 33000.00, 2, '/uploads/1744750340219.PNG', 'Biblia', 'Verbo Divino', '00426', 30, 1),
(52, 'Biblia Youcat', 40000.00, 2, '/uploads/1746450845817.PNG', 'Biblia', 'Biblia', '00671', 10, 1),
(53, 'Sagrada Biblia-Dios Habla Hoy', 18000.00, 2, '/uploads/1746456431962.PNG', 'Biblia', 'Apostolado Biblico Católico', '01513', 145, 1),
(54, 'Biblia de Nuestro Pueblo', 20000.00, 2, '/uploads/1744750481697.PNG', 'Biblia', 'Mensajero', '00357', 13, 1),
(55, 'Biblia de Nuestro Pueblo', 75000.00, 2, '/uploads/1746456005229.PNG', 'Biblia', 'Latinoamérica', '01894', 100, 1),
(56, 'San Antonio Maria Claret', 50000.00, 1, '/uploads/1744751000714.PNG', 'Libro', 'Apostolado Biblico Católico', '00007', 20, 1),
(57, 'Santa Teresa de Ávila', 89000.00, 1, '/uploads/1744751049865.PNG', 'Libro', 'Apostolado Biblico Católico', '00009', 9, 1),
(58, 'A. de Santa Teresita del Niño Jesús', 150000.00, 1, '/uploads/1745588631085.PNG', 'Libro', 'Apostolado Biblico Católico', '00010', 35, 1),
(59, 'B.del Padre Juan del Rizzo Salesiano', 75000.00, 1, '/uploads/1744751158927.PNG', 'Libro', 'Apostolado Biblico Católico', '00018', 5, 1),
(60, '100 Fórmulas para llegar al Éxito', 65000.00, 1, '/uploads/1744751223911.PNG', 'Libro', 'Apostolado Biblico Católico', '00031', 18, 1),
(61, 'Como Hacer una Buena Confesión', 55000.00, 1, '/uploads/1744751260614.PNG', 'Libro', 'Apostolado Biblico Católico', '00034', 16, 1),
(64, 'Novena Bíblica al Niño Jesús Diarias y nueve Domingos', 70000.00, 3, '/uploads/1745334983833.PNG', 'Novena', 'Recuerdo a mi visita santuario', '00164', 6, 1),
(65, 'Novena y Biografia de San Juan Bosco', 65000.00, 3, '/uploads/1745335050315.PNG', 'Novena', 'Recuerdo a mi visita santuario', '00183', 8, 1),
(66, 'Historia del Señor de Monserrate', 85000.00, 3, '/uploads/1745335097811.PNG', 'Libro', 'Santo Viacrucis', '00184', 25, 1),
(67, 'Novena Bíblica de San Miguel Arcángel', 150000.00, 3, '/uploads/1745335150122.PNG', 'Novena', 'Apostolado Biblico Católico', '00186', 15, 1),
(68, 'Novena Bíblica a Santa Marta', 65000.00, 3, '/uploads/1745335190090.PNG', 'Novena', 'Apostolado Biblico Católico', '00187', 6, 1),
(69, 'Domingo Savio un Simpático Santo', 85000.00, 1, '/uploads/1745589288542.PNG', 'Libro', 'Apostolado Biblico Católico', '00052', 8, 1),
(70, 'Dos Minutos para Dios', 55000.00, 1, '/uploads/1745589355716.PNG', 'Libro', 'Apostolado Biblico Católico', '00054', 25, 1),
(71, 'El Amor Verdadero y la Pasión', 120000.00, 1, '/uploads/1745589432588.PNG', 'Libro', 'Apostolado Biblico Católico', '00056', 63000, 1),
(72, 'El Combate Espiritual', 135000.00, 1, '/uploads/1745589519564.PNG', 'Libro', 'Apostolado Biblico Católico', '00059', 80, 1),
(73, 'El Pecado sus Peligros y Consecuencias', 86000.00, 1, '/uploads/1745589967002.PNG', 'Libro', 'Apostolado Biblico Católico', '00068', 90, 1),
(74, 'El Sermón de la Montaña', 96000.00, 1, '/uploads/1745590012153.PNG', 'Libro', 'Apostolado Biblico Católico', '00071', 100, 1),
(75, 'La Imitación de Cristo', 145000.00, 1, '/uploads/1745590060233.PNG', 'Libro', 'Apostolado Biblico Católico', '00099', 190, 1),
(76, 'Como Alejar la Depresión la Tristeza y el Mal Genio', 162000.00, 1, '/uploads/1745590128289.PNG', 'Libro', 'Apostolado Biblico Católico', '00107', 200, 1),
(77, 'El Gran Medio de Salvación la Oración', 85000.00, 1, '/uploads/1745590181617.PNG', 'Libro', 'Apostolado Biblico Católico', '00112', 250, 1),
(78, 'La virtud en Ejemplos', 110000.00, 1, '/uploads/1745590260201.PNG', 'Libro', 'Apostolado Biblico Católico', '00117', 150, 1),
(79, 'La Vocación 133 Ideas para Cultivarla', 118000.00, 1, '/uploads/1745590317255.PNG', 'Libro', 'Apostolado Biblico Católico', '00118', 198, 1),
(80, 'Una Madre Aadminrable Mamá Margarita', 194000.00, 1, '/uploads/1745590379512.PNG', 'Libro', 'Apostolado Biblico Católico', '00132', 197, 1),
(81, 'La Mamá de San Juan Bosco', 155000.00, 1, '/uploads/1745590427136.PNG', 'Libro', 'Apostolado Biblico Católico', '00133', 200, 1),
(82, 'Matrimonio en Paz y Muy Feliz', 114000.00, 1, '/uploads/1745590478071.PNG', 'Libro', 'Apostolado Biblico Católico', '00138', 140, 1),
(84, 'Sagrada Biblia-Dios Habla Hoy', 40000.00, 2, '/uploads/1746456665362.PNG', 'Biblia', 'La Biblia', '00371', 140, 1),
(85, 'Biblia de Nuestro Pueblo', 30000.00, 2, '/uploads/1746454356502.PNG', 'Biblia', 'Biblia del Peregrino America Latina', '07597', 125, 1),
(86, 'Biblia de Nuestro Pueblo', 30000.00, 2, '/uploads/1746454406326.PNG', 'Biblia', 'Sagrada Biblia', '08478', 200, 1),
(87, 'Biblia del Peregrino Nuestro Pueblo', 75000.00, 2, '/uploads/1746454477325.PNG', 'Biblia', 'Biblia del Peregrino America Latina', '06706', 300, 1),
(88, 'Biblia de Jerusalén-Letra Grande', 160000.00, 2, '/uploads/1746456307867.PNG', 'Biblia', 'Biblia de Jerusalén', '06821', 152, 1),
(89, 'Biblia Nacar Colunga', 130000.00, 2, '/uploads/1746454660453.PNG', 'Biblia', 'Sagrada Biblia', '00414', 136, 1),
(90, 'La Biblia - Latinoamérica', 40000.00, 2, '/uploads/1746454750181.PNG', 'Biblia', 'Latinoamérica', '00410', 140, 1),
(91, 'Biblia Jerusalén-Revisada y Aumentada', 160000.00, 2, '/uploads/1746454848722.PNG', 'Biblia', 'Quinta Edición', '00351', 148, 1),
(92, 'Sagrada Biblia Torres Amat', 150000.00, 2, '/uploads/1746454897913.PNG', 'Biblia', 'Edición Latinoamerica', '00423', 200, 1),
(93, 'Biblia Verbo Divino', 35000.00, 2, '/uploads/1746454951645.PNG', 'Biblia', 'Verbo Divino', '00424', 215, 1),
(94, 'Biblia de Nuestro Pueblo\"Shcokel\"', 80000.00, 2, '/uploads/1746455031368.PNG', 'Biblia', 'América Latina', '01417', 230, 1),
(95, 'Biblia de Nuestro Pueblo', 70000.00, 2, '/uploads/1746455090440.PNG', 'Biblia', 'América Latina', '06804', 300, 1),
(96, 'Novena  Biblíca a la Virgen Milagrosa Inmaculada', 85000.00, 3, '/uploads/1746460431364.PNG', 'Novena', 'Apostolado Biblico Católico', '00194', 150, 1),
(97, 'Novena Biblíca a San antonio de Padua', 110000.00, 3, '/uploads/1746460505908.PNG', 'Novena', 'Apostolado Biblico Católico', '00196', 250, 1),
(98, 'Novena Biblíca al Señor de Monserrate', 750000.00, 3, '/uploads/1746460589299.PNG', 'Novena', 'Apostolado Biblico Católico', '00198', 150, 1),
(99, 'Novena Biblíca a Santa Rita de Casia', 120000.00, 3, '/uploads/1746460639763.PNG', 'Novena', 'Apostolado Biblico Católico', '00199', 500, 1),
(100, 'Novena Biblíca a la Virgen Chiquinquirá', 175000.00, 3, '/uploads/1746460714738.PNG', 'Novena', '2° Edición', '00200', 450, 1),
(101, 'Novena Bíblica a la Virgen de Guadalupe', 160000.00, 3, '/uploads/1746460796049.PNG', 'Novena', 'Apostolado Biblico Católico', '00201', 240, 1),
(102, 'Novena Bíblica a la virgen del Carmen', 152000.00, 3, '/uploads/1746460885737.PNG', 'Novena', 'Apostolado Biblico Católico', '00202', 235, 1),
(103, 'Novena Bíblica a la Virgen de Fátima', 75000.00, 3, '/uploads/1746461001601.PNG', 'Novena', '3° Edición', '00203', 300, 1),
(104, 'Novena y Biografía del Beato Padre Luis Variara', 95000.00, 3, '/uploads/1746461075274.PNG', 'Novena', 'Apostolado Biblico Católico', '00204', 315, 1),
(105, 'Novena Bíblica a San Juan Pablo II', 145000.00, 3, '/uploads/1746461177305.PNG', 'Novena', 'Apostolado Biblico Católico', '00206', 280, 1),
(106, 'Novena y Biografia de San Martín de Porres', 68000.00, 3, '/uploads/1746461268344.PNG', 'Novena', 'Apostolado Biblico Católico', '00209', 350, 1),
(107, 'Novena Bíblica Nueve Domingos Breves al Niño Jesús', 150000.00, 3, '/uploads/1746461324799.PNG', 'Novena', 'Apostolado Biblico Católico', '00213', 150, 1),
(108, 'Novena Bíblica a la virgen de los Remedios', 85000.00, 3, '/uploads/1746461380223.PNG', 'Novena', 'Apostolado Biblico Católico', '01128', 295, 1),
(109, 'Novena Bíblica de Aguinaldo', 87000.00, 3, '/uploads/1746461431287.PNG', 'Novena', 'Apostolado Biblico Católico', '01740', 245, 1),
(110, 'Novena Bíblica a María Auxiliadora', 78000.00, 3, '/uploads/1746461490614.PNG', 'Novena', 'Apostolado Biblico Católico', '01741', 260, 1),
(111, 'Novena Bíblica al Espíritu Santo', 79000.00, 3, '/uploads/1746461614735.PNG', 'Novena', '29a Edición', '01743', 480, 1),
(112, 'Novena  Bíblica a Jesús Misericordioso', 99000.00, 3, '/uploads/1746461667566.PNG', 'Novena', 'Apostolado Biblico Católico', '01744', 470, 1);

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
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `tipo_movimiento` enum('entrada','salida') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `tipo_producto` varchar(20) NOT NULL,
  `fecha` datetime NOT NULL,
  `observacion` text DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `registrado_por` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id`, `producto_id`, `tipo_movimiento`, `cantidad`, `tipo_producto`, `fecha`, `observacion`, `id_admin`, `id_producto`, `id_usuario`, `registrado_por`) VALUES
(1, 12, 'entrada', 5, 'libro', '2025-04-07 13:10:25', 'Reposición de stock', NULL, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `Id_Pago` int(11) NOT NULL,
  `Id_Metodo_Pago` int(11) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id_Usuario` int(11) NOT NULL,
  `Usu_Nombre` varchar(100) NOT NULL,
  `Usu_Apellido` varchar(100) NOT NULL,
  `Usu_Correo` varchar(100) NOT NULL,
  `Usu_Password` varchar(255) NOT NULL,
  `Usu_Rol` enum('cliente','administrador') NOT NULL DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id_Usuario`, `Usu_Nombre`, `Usu_Apellido`, `Usu_Correo`, `Usu_Password`, `Usu_Rol`) VALUES
(1, 'Laura', 'Lopez', 'laura@gmail.com', '123', 'administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `observacion` text DEFAULT NULL,
  `tipo_producto` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`id`);

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
-- Indices de la tabla `esculturas`
--
ALTER TABLE `esculturas`
  ADD PRIMARY KEY (`Id_Escultura`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`Id_Libro`),
  ADD UNIQUE KEY `Lib_Codigo` (`Lib_Codigo`),
  ADD KEY `Lib_Categoria` (`Lib_Categoria`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`Id_Metodo_Pago`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_admin` (`id_admin`),
  ADD KEY `fk_escultura` (`id_producto`),
  ADD KEY `fk_usuario` (`id_usuario`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`Id_Pago`),
  ADD KEY `Id_Metodo_Pago` (`Id_Metodo_Pago`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD UNIQUE KEY `Usu_Correo` (`Usu_Correo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `alertas`
--
ALTER TABLE `alertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `articulo_carrito`
--
ALTER TABLE `articulo_carrito`
  MODIFY `Id_Articulo_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  MODIFY `Id_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT de la tabla `esculturas`
--
ALTER TABLE `esculturas`
  MODIFY `Id_Escultura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `Id_Libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `Id_Metodo_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `Id_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `fk_admin` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id`),
  ADD CONSTRAINT `fk_escultura` FOREIGN KEY (`id_producto`) REFERENCES `esculturas` (`Id_Escultura`),
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`Id_Usuario`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`Id_Metodo_Pago`) REFERENCES `metodo_pago` (`Id_Metodo_Pago`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`Id_Cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
