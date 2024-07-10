import express from "express";
import { albumDeleteController, albumGetController, albumGetControllerBysingerID, albumPostController, albumUpdateController, singerDeleteController, singerGetController, singerPostController, singerUpdateController, songDeleteController, songGetController, songGetControllerByalbumID, songGetControllerBysingerID, songPostController, songUpdateController } from "../controller/music.controller.js";
import { verifyAuthUser } from "../middleware/auth.middleware.js";




const musicRoute = express.Router();

musicRoute.post("/singer", verifyAuthUser,singerPostController);
musicRoute.get(`/singer/:id?`,verifyAuthUser, singerGetController);
musicRoute.delete(`/singer/:id?`,verifyAuthUser, singerDeleteController)
musicRoute.patch(`/singer/:id?`,verifyAuthUser, singerUpdateController);



musicRoute.post("/album",verifyAuthUser, albumPostController);
musicRoute.get(`/album/singer/:id?`,verifyAuthUser, albumGetControllerBysingerID);
musicRoute.get(`/album/:id?`,verifyAuthUser, albumGetController);
musicRoute.delete(`/album/:id?`,verifyAuthUser, albumDeleteController);
musicRoute.patch(`/album/:id?`,verifyAuthUser, albumUpdateController);


musicRoute.post("/song",verifyAuthUser, songPostController);
musicRoute.get(`/song/album/:id?`,verifyAuthUser, songGetControllerByalbumID);
musicRoute.get(`/song/singer/:id?`, songGetControllerBysingerID);
musicRoute.get(`/song/:id?`,verifyAuthUser, songGetController);
musicRoute.delete(`/song/:id?`,verifyAuthUser, songDeleteController);
musicRoute.patch(`/song/:id?`,verifyAuthUser, songUpdateController);

export default musicRoute