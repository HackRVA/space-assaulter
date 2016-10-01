CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  CONSTRAINT pk_id PRIMARY KEY(id));

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  message TEXT,
  sender INT NOT NULL,
  recipient INT NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY(id),
  CONSTRAINT fk_sender FOREIGN KEY(sender) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_recipient FOREIGN KEY(recipient) REFERENCES users(id) ON DELETE CASCADE);

# Create the broadcast user
INSERT INTO users () VALUES ();

