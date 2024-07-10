/* eslint-disable no-undef */
// import mongoose from "mongoose";

// // Connect to MongoDB

// const connectDatabase = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/Api_testing", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Database is connected...");
//   // eslint-disable-next-line no-unused-vars
//   } catch (error) {
//     console.log("Database connection failed!");
//   };
// };

// export default connectDatabase;

import mysql from "mysql2/promise";
// import "dotenv/config";

const pool = mysql.createPool({
  // eslint-disable-next-line no-undef
  host:process.env.HOSTNAME,
  user:process.env.USER_NAME,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to check database connection
async function checkDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connected!");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  } finally {
    if (connection) {
      connection.release(); // Release the connection
    }
  }
}

// Call checkDatabaseConnection to check the connection when this module is loaded
checkDatabaseConnection();

export default pool;
