DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS receipts;

CREATE TABLE users(
          id INTEGER PRIMARY KEY,
          username TEXT,
          password TEXT,
          friend_list TEXT,
          first_name TEXT,
          last_name TEXT,
          email TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE receipts(
          id INTEGER PRIMARY KEY,
          user_id TEXT,
          restaurant_name TEXT,
          items_purchased TEXT,
          friend_ids TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER database BEFORE UPDATE ON users BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

CREATE TRIGGER database BEFORE UPDATE ON receipts BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;