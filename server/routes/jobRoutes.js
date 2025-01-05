import express from 'express';
import { downloadArtifact, getJobList, getJobStatus, getTaskStages} from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get('/jobs', getJobList);
jobRouter.get('/job/:jobId', getJobStatus);
jobRouter.get('/stage/:taskId', getTaskStages);
jobRouter.get('/download/:jobId', downloadArtifact);

export default jobRouter;

