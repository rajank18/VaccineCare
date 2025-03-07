import express from 'express';
import { addVaccineRecord, addWorker, filterChildrenByHospitalAndDate, getAllVaccines, getAllWorkers, getChildrenByHospital, searchWorkers, uploadFile } from '../controllers/hospital.controllers.js';
import upload from '../utils/multer.js';

const router = express.Router();


router.post('/addworker/:hospital_id' , addWorker);
router.get('/getworker/:hospital_id' , getAllWorkers);
router.get('/search-workers/:hospital_id' , searchWorkers);
router.post('/add-child-vaccine' , addVaccineRecord);
router.get('/getchild/:hospital_id' , getChildrenByHospital);
router.get('/search-child/:hospital_id' , filterChildrenByHospitalAndDate);
router.post('/upload-certificate' ,upload.single("file"), uploadFile);
router.get("/all-vaccine", getAllVaccines);

export default router

