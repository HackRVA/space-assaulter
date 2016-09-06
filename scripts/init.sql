CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20),
  CONSTRAINT pk_id PRIMARY KEY(id));

CREATE TABLE offers (
  id INT NOT NULL AUTO_INCREMENT,
  room_id INT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  contents VARCHAR(1000),
  CONSTRAINT pk_id PRIMARY KEY(id),
  CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE);

CREATE TABLE answers (
  id INT NOT NULL AUTO_INCREMENT,
  room_id INT NOT NULL,
  offer_id INT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  contents VARCHAR(1000),
  CONSTRAINT pk_id PRIMARY KEY(id),
  CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_offer_id FOREIGN KEY(offer_id) REFERENCES offers(id) ON DELETE CASCADE);

