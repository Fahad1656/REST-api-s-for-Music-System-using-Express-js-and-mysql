
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config.js";
import User from "../model/user.model.js";


export const registerController = async (req, res) => {



  let payload = req.body;
  payload.number = Number(payload.number);
  payload.age = Number(payload.age);

  try {
  
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [payload.email]);

    if (existingUsers.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Insert user data into the database
    const insertQuery = `
      INSERT INTO users (name, email, number, age, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [payload.name, payload.email, payload.number, payload.age, hashedPassword];
    const [insertResult] = await pool.query(insertQuery, insertValues);

    if (insertResult.affectedRows > 0) {
      const token = jwt.sign(
        { name: payload.name, email: payload.email, id: insertResult.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(201).json({
        success: true,
        message: "Successfully registered",
        token: token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log(users)
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { name: user.name, email: user.email, age:user.age, number:user.number, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token: token,
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
 @method GET
 @route /api/auth/profile
 @description Retrive user profile
 @access User
 */
export const profilecontroller = async (req, res) => {
  try {
    console.log("ok ...........................................");

    return res.status(200).json({
      success: true,
      message: "Profile",
      data: {
        name: req.user.name,
        email: req.user.email,
        Number: req.user.Number,
        age: req.user.age,
        Photo: req.user.uploadPhoto,
        id: req.user.id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  }
};


export const updateprofilecontroller = async (req, res) => {
  try {
    const reqBody = req.body;
    let { name, age, number } = reqBody;
    age = Number(age);
    number = Number(number);

    // Prepare payload
    let payload = {};

    if (name) payload.name = name;
    if (age) payload.age = age;
    if (number) payload.number = number;

    // Build the SQL query for updating
    const fields = Object.keys(payload)
      .map((key) => `${key} = ?`)
      .join(", ");
      console.log(fields)
    const values = Object.values(payload);
    console.log(values)

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const email_ad = req.user.email;

    const updateQuery = `UPDATE users SET ${fields} WHERE email = ?`;
    values.push(email_ad);
    console.log(values,"ok")

    const [updateResult] = await pool.query(updateQuery, values);

    if (updateResult.affectedRows > 0) {
      // Fetch the updated user
      const [updatedUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email_ad]
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found or not authorized to update",
      });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgetcontroller = async (req, res) => {
  const email_address = req.body.email;

  function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const otp_number = generateRandomNumber();

  try {
    // Check if user with the given email exists in the users table
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email_address]
    );
    console.log(existingUsers,"see")
    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ email: email_address }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Check if there's already an OTP entry for this email
    const [existingOtp] = await pool.query(
      "SELECT * FROM otp WHERE email = ?",
      [email_address]
    );
    console.log(existingOtp,"dekhh")
    if (existingOtp.length > 0) {
      // Update existing OTP entry
      const updateQuery =
        "UPDATE otp SET otp = ?, createdAt = CURRENT_TIMESTAMP, expiresAt = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 MINUTE) WHERE email = ?";
      await pool.query(updateQuery, [otp_number, email_address]);
    } else {
      // Create new OTP entry
      const insertQuery = "INSERT INTO otp (email, otp) VALUES (?, ?)";
      await pool.query(insertQuery, [email_address, otp_number]);
    }

    // Send OTP via email (simulated in this example)
    // Replace with your actual email sending logic
    console.log(`Sending OTP ${otp_number} to email ${email_address}`);

    return res.status(200).json({
      success: true,
      message: `The OTP code ${otp_number} has been sent to your email`,
      token: token,
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const resetcontroller = async (req, res) => {
  const email_address = req.body.email;
  const otp_code = req.body.otp;
  const newpassword = req.body.newpassword;

  try {
    // Check if OTP exists for the given email
    const [existingOtp] = await pool.query(
      "SELECT * FROM otp WHERE email = ? AND otp = ?",
      [email_address, otp_code]
    );
    console.log(existingOtp,"kolo")

    if (existingOtp.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update user's password
    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
    const [updateResult] = await pool.query(updateQuery, [
      hashedPassword,
      email_address,
    ]);
    console.log(updateResult)

    if (updateResult.affectedRows > 0) {
      // Delete the OTP entry after successful password reset
      const deleteQuery = "DELETE FROM otp WHERE email = ?";
      await pool.query(deleteQuery, [email_address]);

      return res.status(201).json({
        success: true,
        message: "The password has been changed",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found or OTP does not match",
      });
    }
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




