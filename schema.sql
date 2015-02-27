-- sqlite3 database.db < schema.sql
-- node seed.js

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS friends;

CREATE TABLE users (
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


CREATE TABLE receipts (
          id INTEGER PRIMARY KEY,
          user_id TEXT,
          restaurant_object TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
          id INTEGER PRIMARY KEY,
          friend_one INTEGER,
          friend_two INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)