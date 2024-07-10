import pool from "../config/db.config.js";

const Song = {
  tableName: "songs",
  schema: `
    CREATE TABLE IF NOT EXISTS songs (
      song_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      duration INT,
      album_id INT,
      singer_id INT,
      FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE,
      FOREIGN KEY (singer_id) REFERENCES singers(singer_id) ON DELETE CASCADE
    )
  `,

  async createTable() {
    try {
      const connection = await pool.getConnection();
      await connection.query(this.schema);
      console.log(`Table "${this.tableName}" created successfully`);
      connection.release();
    } catch (error) {
      console.error(`Error creating table "${this.tableName}":`, error);
    }
  },
};

// Create the table when the module is loaded
Song.createTable();

export default Song;
