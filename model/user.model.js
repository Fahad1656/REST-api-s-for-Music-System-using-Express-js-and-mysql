import pool from "../config/db.config.js";
const User = {
  tableName: "users",
  schema: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(55) NOT NULL UNIQUE,
      email VARCHAR(50) NOT NULL UNIQUE,
      number BIGINT NOT NULL UNIQUE,
      age INT NOT NULL,
      password VARCHAR(255) NOT NULL
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
User.createTable();

export default User;
