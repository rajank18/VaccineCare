import express from 'express';
import { getAllForAdmin, getAllForHospital, searchHospital, searchUser, searchWorkerInHospital } from '../controllers/deshboard.controllers.js';

const router = express.Router();

router.get('/admin' , getAllForAdmin);
router.get('/search-workers' , searchUser)
router.get('/search-hospital' , searchHospital)
router.get('/hospital/:id' , getAllForHospital)
router.get('/search-workers/:id' , searchWorkerInHospital)

export default router 
