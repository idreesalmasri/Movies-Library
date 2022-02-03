DROP TABLE IF EXISTS myFavorite;



CREATE TABLE IF NOT EXISTS myFavorite(
id SERIAL PRIMARY KEY ,
title VARCHAR(255),
release_date INTEGER,
poster_path VARCHAR(1000),
overview VARCHAR(10000),
comment VARCHAR(1000)

)