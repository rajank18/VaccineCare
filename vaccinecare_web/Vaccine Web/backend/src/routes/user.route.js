import express from 'express';
import { addHospital, createAdminUser ,getHospitals,login, logout, searchHospitals } from '../controllers/user.controllers.js'; // Ensure the correct path

const router = express.Router();

router.post('/admin', createAdminUser);
router.post('/login', login);
router.get('/hospitals', getHospitals);
router.post('/addhospital', addHospital);
router.get('/search-hospital', searchHospitals);
router.post('/logout', logout);

export default router;
