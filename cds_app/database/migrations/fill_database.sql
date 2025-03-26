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
        'Museo de Bellas Artes de Bilbao',
        'Museo de titanio y cristal luminoso, diseñado por Frank Gehry, que alberga obras de arte del s. XX.',
        NULL,
        2,
        7,
        '2',
        'Abandoibarra Etorb., 2, Abando, 48009 Bilbao, Bizkaia',
        '2025-03-19 22:04:55.977464' :: TIMESTAMP,
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
        gis.ST_GeogFromText('POINT(43.26572324429727, -2.9405460472896454)'),
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
        'cover-url-nosequeponer',
        5,
        default,
        default,
        now() + INTERVAL '1 month'
    );