import pool from "../config/db.config.js";

const Otp = {
  tableName: "otp",
  schema: `
    CREATE TABLE IF NOT EXISTS otp (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(50) NOT NULL,
      otp INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expiresAt TIMESTAMP DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 MINUTE),
      UNIQUE KEY unique_email (email),
      INDEX idx_expiresAt (expiresAt)
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

// Create the OTP table when the module is loaded
Otp.createTable();

export default Otp;
