import User from "../model/user.model.js";
export const validateStudent = (data) => {
  const newUser = new User(data);
  const error = newUser.validateSync();
  if (error) {
    const messages = Object.values(error.errors).map((err) => err.message);
    console.log(messages);
    return messages;
  }
  return null;
};
