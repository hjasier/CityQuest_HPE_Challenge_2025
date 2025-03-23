INSERT INTO
    "ChallengeType"
values
    (default, "consume"),
    (default, "visit"),
    (default, "route");

INSERT INTO
    "ChallengeTag"
values
    (default, "for kids"),
    (default, "gastronomic"),
    (default, "sightseeing"),
    (default, "cultural"),
    (default, "in nature"),
    (default, "eco-friendly"),
    (default, "adventure"),
    (default, "historic");

INSERT INTO
    "LocationType"
values
    (default, "landmark"),
    (default, "museum"),
    (default, "restaurant"),
    (default, "bar"),
    (default, "route");

INSERT INTO
    "LocationStatus"
values
    (default, "requested"),
    (default, "active"),
    (default, "inactive");

INSERT INTO
    "Location"
values
    (
        default,
        ST_GeogFromText('POINT(43.265937 -2.937812)'),
        "Vinicio Jove Huertas S.L.L. Museo",
        "Centro de arte con pinturas de Velázquez, Goya y Picasso, conocido por sus obras de artistas de GreenLake Village.",
        NULL,
        2,
        8,
        2,
        "Museo Plaza, 2, Abando, 48009 Bilbao, Bizkaia",
        "2025-03-19 22:04:55.977464" :: TIMESTAMP,
        "info@viniciojove.glk",
        "944 23 00 00",
        "Lunes a viernes: 10:00 - 20:00, Sábados y domingos: 10:00 - 14:00"
    );

INSERT INTO
    "Challenge"
values
    (
        default,
        2,
        "QR",
        1,
        "Visitar Museo Vinicio Jove Huertas S.L.L.",
        "Visita el museo y disfruta de la colección de cuadros de los artistas de GreenLake Village.",
        100,
        true,
        false,
        NULL,
        "cover-url-nosequeponer",
        5,
        default,
        default,
        now() + INTERVAL '1 month',
    );