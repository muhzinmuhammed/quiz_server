import express from 'express'
import { userRegister, userLogin,usersTotalMark } from '../controller/userAuth.js'
import { protect } from '../middleware/protect.js'

const router = express.Router()

// User Registration
router.post('/register', userRegister)

// User Login
router.post('/login', userLogin)


//total mark
router.post('/mark/:id',usersTotalMark)

export default router