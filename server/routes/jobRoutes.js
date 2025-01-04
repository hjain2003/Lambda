import express from 'express';
import { getJobList, getJobStatus, getTaskStages} from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get('/jobs', getJobList);
jobRouter.get('/job/:jobId', getJobStatus);
jobRouter.get('/stage/:taskId', getTaskStages);

export default jobRouter;

