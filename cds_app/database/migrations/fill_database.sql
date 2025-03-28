INSERT INTO
    "ChallengeType"
values
    (default, 'consume'),
    (default, 'visit'),
    (default, 'route');

INSERT INTO
    "ChallengeTag"
values
    (default, 'for kids'),
    (default, 'gastronomic'),
    (default, 'sightseeing'),
    (default, 'cultural'),
    (default, 'in nature'),
    (default, 'eco-friendly'),
    (default, 'adventure'),
    (default, 'historic');

INSERT INTO
    "LocationType"
values
    (default, 'landmark'),
    (default, 'museum'),
    (default, 'restaurant'),
    (default, 'bar'),
    (default, 'route');

INSERT INTO
    "LocationStatus"
values
    (default, 'requested'),
    (default, 'active'),
    (default, 'inactive');

INSERT INTO
    "Location"
values
    -- Museos
    (
        default,
        gis.ST_GeogFromText('POINT(-2.937858 43.265990)'),
        'Vinicio Jove Huertas S.L.L. Museo',
        'Centro de arte con pinturas de Velázquez, Goya y Picasso, conocido por sus obras de artistas de GreenLake Village.',
        NULL,
        2,
        8,
        '2',
        'Museo Plaza, 2, Abando, 48009 Bilbao, Bizkaia',
        '2025-03-19 22:04:55.977464' :: TIMESTAMP,
        'info@viniciojove.glk',
        '944 23 00 00',
        'Lunes a viernes: 10:00 - 20:00, Sábados y domingos: 10:00 - 14:00'
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.934015 43.268687)'),
        'Museo Guggenheim',
        'Museo de titanio y cristal luminoso, diseñado por Frank Gehry, que alberga obras de arte del s. XX.',
        NULL,
        2,
        7,
        '2',
        'Abandoibarra Etorb., 2, Abando, 48009 Bilbao, Bizkaia',
        '2025-03-19 22:04:55.977464' :: TIMESTAMP,
        'informacion@guggenheim-bilbao.eus',
        '944 35 90 80',
        'Martes a domingo: 10:00 - 19:00, Lunes: Cerrado'
    ),
    -- Bares
    (
        default,
        gis.ST_GeogFromText('POINT(-2.943733 43.262614)'),
        'Bar El Huevo Berria',
        'Decoración del Athletic Club y barra de pintxos en una cafetería moderna con ensaladas y taburetes altos.',
        NULL,
        4,
        7,
        '2',
        'Poza Lizentziatuaren Kalea, 65, Abando, 48013 Bilbao, Bizkaia',
        '2025-03-19 22:04:55.977464' :: TIMESTAMP,
        NULL,
        '944 27 13 48',
        'Lunes a jueves: 8:00 - 23:00, Viernes y sábado: 10:30 - 1:00, Domingo: Cerrado'
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.941354 43.270012)'),
        'Cafetería Zubialde',
        'Cafetería especializada en tortillas de patata al lado de la Universidad de Deusto.',
        NULL,
        4,
        8,
        '2',
        'Deustuko Zubia, 3, 48014 Bilbao, Bizkaia',
        '2025-03-19 22:04:55.977464' :: TIMESTAMP,
        NULL,
        '606 91 77 16',
        'Lunes a viernes: 7:30 - 22:00, Sábado: 9:30 - 22:00, Domingo: Cerrado'
    ),
    -- Landmarks
    (
        default,
        gis.ST_GeogFromText('POINT(-2.927751 43.266346)'),
        'Puente Zubizuri',
        'Puente peatonal de diseño futurista sobre el río Nervión con pasarela curvada y arco atirantado.',
        NULL,
        1,
        NULL,
        '2',
        'Zubizuri, Abando, 48001 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.937410 43.270310)'),
        'Universidad de Deusto',
        'Universidad privada fundada en 1886 por la Compañía de Jesús, con campus en Bilbao y San Sebastián.',
        NULL,
        1,
        NULL,
        '2',
        'Avenida de las Universidades, 24, 48007 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.934982 43.263009)'),
        'Plaza Federico Moyúa',
        'Plaza elíptica de 1876 en el centro de Bilbao con una fuente circular, senderos pavimentados y parterres de flores.',
        NULL,
        1,
        NULL,
        '2',
        'Federico Moyúa Plaza, 5, Abando, 48009 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.940546 43.265723)'),
        'Parque de Doña Casilda Iturrizar',
        'Parque urbano de 1907 con estanques, jardines, una pérgola y un parque infantil.',
        NULL,
        1,
        NULL,
        '2',
        'Abando, 48009 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    -- Rutas
    (
        default,
        gis.ST_GeogFromText('POINT(-2.943952 43.265817)'),
        'Paseo por la ría',
        'Paseo por la ría, desde el parque de Doña Casilda hasta Elorrieta',
        NULL,
        5,
        NULL,
        '2',
        'Abando, 48009 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        default,
        gis.ST_GeogFromText('POINT(-2.936675 43.270848)'),
        'Paseo desde la Universidad de Deusto hasta el CRAI',
        'Paseo desde la Universidad de Deusto hasta el CRAI pasando por la Pasarela Pedro Arrupe ',
        NULL,
        5,
        NULL,
        '2',
        'Av. de las Universidades, 16, Deusto, 48007 Bilbao, Bizkaia',
        NULL,
        NULL,
        NULL,
        NULL
    );

INSERT INTO
    "LocationCapability"
values
    (default, 'spanish omelette'),
    (default, 'pintxos'),
    (default, 'wheelchair accessible'),
    (default, 'pet friendly');

INSERT INTO
    "LocationCapabilities"
values
    -- Bar El huevo Berria, tortilla y pintxos
    (3, 1),
    (3, 2),
    -- Cafetería Zubialde, tortilla 
    (4, 1),
    -- Puente Zubizuri, accesible en silla de ruedas
    (5, 3),
    -- Universidad de Deusto, accesible en silla de ruedas
    (6, 3),
    -- Plaza Federico Moyúa, accesible en silla de ruedas
    (7, 3),
    -- Parque de Doña Casilda Iturrizar, accesible en silla de ruedas y pet friendly
    (8, 3),
    (8, 4);

INSERT INTO
    "TransportMedium"
values
    (default, "Foot", 10),
    (default, "Bike", 10),
    (default, "Car", 2),
    (default, "Public transport", 7),
    (default, "Boat", 4);

INSERT INTO
    "Route"
values
    (
        default,
        9,
        gis.ST_GeogFromText(
            'LINESTRING(-2.943952 43.265817, -2.944196 43.265896, -2.944147 43.266087, -2.944248 43.266350, -2.944827 43.266226, -2.945477 43.266492, -2.945778 43.266533, -2.946423 43.267486, -2.947039 43.267838, -2.947665 43.267930, -2.949428 43.267594, -2.949657 43.267053, -2.950046 43.266904, -2.951721 43.267226, -2.952550 43.267376, -2.953315 43.267580, -2.954115 43.267870, -2.955554 43.268371, -2.955933 43.268561, -2.956177 43.268642, -2.956300 43.268743, -2.956905 43.268938, -2.958382 43.269735, -2.959727 43.270731, -2.960776 43.271767, -2.961361 43.272537, -2.961787 43.273255, -2.962835 43.275214, -2.963873 43.277093, -2.964884 43.279037, -2.964403 43.279194, -2.966700 43.283479, -2.966922 43.283572)'
        ),
        3100
    ),
    (
        default,
        10,
        gis.ST_GeogFromText(
            'LINESTRING(-2.936675 43.270848, -2.936685 43.270435, -2.936859 43.269794,  -2.937055 43.269104, -2.936984 43.268972, -2.936890 43.268914, -2.936870 43.268836, -2.937005 43.268619, -2.937098 43.268587, -2.937155 43.268485)'
        ),
        350
    );

INSERT INTO
    "RouteTransportMedium"
VALUES
    -- Ruta 1, a pie, en bici
    (1, 1),
    (1, 2);

INSERT INTO
    "CompletionType"
values
    (default, 'QR'),
    (default, 'GPS'),
    (default, 'GPS-ROUTE'),
    (default, 'PHOTO');

INSERT INTO
    "Challenge"
values
    (
        default,
        2,
        'QR',
        1,
        'Visitar Museo Vinicio Jove Huertas S.L.L.',
        'Visita el museo y disfruta de la colección de cuadros de los artistas de GreenLake Village.',
        100,
        true,
        false,
        NULL,
        NULL,
        4,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        1,
        'QR',
        3,
        'Desafío de Pintxos',
        'Prueba los famosos pintxos de GreenLake Village.',
        100,
        true,
        true,
        86400,
        'https://example.com/pintxos.jpg',
        5,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        1,
        'QR',
        3,
        'Desafío de Tortilla de Patata',
        'Prueba la tortilla de patata en un local de GreenLake Village.',
        100,
        true,
        true,
        43200,
        'https://example.com/tortilla.jpg',
        5,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        3,
        'GPS-ROUTE',
        9,
        'Paseo por la ría',
        'Disfruta de un paseo por la ría de GreenLake Village, desde el parque de Doña Casilda hasta Elorrieta.',
        150,
        true,
        false,
        NULL,
        'https://example.com/riverwalk.jpg',
        3,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        3,
        'GPS-ROUTE',
        10,
        'Paseo desde la Universidad de Deusto hasta el CRAI',
        'Disfruta de un paseo desde la Universidad de Deusto hasta el CRAI pasando por la Pasarela Pedro Arrupe.',
        200,
        true,
        false,
        NULL,
        NULL,
        5,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        2,
        'GPS',
        8,
        'Visita el Parque de Doña Casilda Iturrizar',
        'Disfruta de un paseo por el Parque de Doña Casilda Iturrizar, un hermoso parque urbano con estanques y jardines.',
        50,
        true,
        false,
        NULL,
        NULL,
        4,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        2,
        'QR',
        2,
        'Explorador de Arte',
        'Visita el icónico Museo Guggenheim y descubre su colección de arte moderno.',
        100,
        true,
        false,
        NULL,
        'https://yvouepcwwstjvdcgvmon.supabase.co/storage/v1/object/public/locations/location-images/vista-desde-la-ria.jpg',
        5,
        default,
        default,
        now() + INTERVAL '1 year'
    ),
    (
        default,
        2,
        'GPS',
        2,
        'El Barco de Titanio',
        'Contempla el icónico Museo Guggenheim y sus alrededores.',
        50,
        true,
        false,
        NULL,
        'https://yvouepcwwstjvdcgvmon.supabase.co/storage/v1/object/public/locations/location-images/vista-desde-la-ria.jpg',
        4,
        default,
        default,
        now() + INTERVAL '1 year'
    );

INSERT INTO
    "RequiredCapability"
VALUES
    -- Desafío de Pintxos
    (2, 2),
    -- Desafío de Tortilla de Patata
    (3, 1);