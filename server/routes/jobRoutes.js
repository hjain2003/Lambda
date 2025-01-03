import express from 'express';
import { getJobList, getJobStatus } from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get('/jobs', getJobList);
jobRouter.get('/job/:jobId', getJobStatus);

export default jobRouter;

