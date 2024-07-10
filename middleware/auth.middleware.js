/* eslint-disable no-undef */
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

//import {secret} from "../controller/auth.controller.js";

export const verifyAuthUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Failed to authenticate token",
      });
    } else {
      req.user = decoded;
      console.log("do");
      next();
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Failed to authenticate token",
      });
    } else {
      if (decoded.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "You are not permitted to access this route!",
        });
      };

      req.user = decoded;
      console.log("do");
      next();
    }
  });
};
