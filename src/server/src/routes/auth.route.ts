import { Router } from "express"
import { authController } from "../controllers/auth.controller"
import { verifyToken } from "../middlewares/auth.middleware"
import { Request, Response, NextFunction } from "express"
const router = Router();

router.post("/register", (req: Request, res: Response) => {
    authController.register(req, res)
})
router.post("/login", (req: Request, res: Response) => {
    authController.login(req, res)
})

router.post("/verify-email", (req:Request,res: Response) => {
    authController.verifyEmail(req, res)
})

router.post("/logout", (req:Request,res: Response) => {
    authController.logout(req, res)
})

router.post("/refresh-token", (req:Request,res: Response) => {
    authController.refreshToken(req, res)
})

// router.post("/auth/verify-email", (req: Request, res: Response, next: NextFunction) => {
//     verifyToken(req, res, next)
// }, (req: Request, res: Response) => {
//     authController.verifyEmail(req, res)
// })
export default router;
