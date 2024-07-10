import pool from "../config/db.config.js";

const Singer = {
  tableName: "singer",
  schema: `
    CREATE TABLE IF NOT EXISTS singers (
      singer_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL
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
Singer.createTable();

export default Singer;
