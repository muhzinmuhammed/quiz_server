import express from 'express'
import {  adminLogin,adminDashBoard} from '../controller/adminAuth.js'


const router = express.Router()
// Admin Login
router.post('/login', adminLogin)

//dasboard

router.get('/dashboard',adminDashBoard)

export default router