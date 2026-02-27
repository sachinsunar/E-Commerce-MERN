import express from "express";
import {
  LoginUser,
  registerUser,
  adminLogin,
  subscribedUser,
  listSubscriber,
  listUser,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.put("/update/:id", updateUserProfile);
userRouter.delete("/delete/:id", deleteUser);
userRouter.post("/login", LoginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/subscriber", subscribedUser);
userRouter.get("/subscriber-list", listSubscriber);
userRouter.get("/all", listUser);

export default userRouter;
