import pool from "../config/db.config.js";

const Album = {
  tableName: "albums",
  schema: `
    CREATE TABLE IF NOT EXISTS albums (
      album_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      release_year VARCHAR(100) NOT NULL,
      singer_id INT,
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
Album.createTable();

export default Album;
