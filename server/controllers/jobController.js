import axios from 'axios';

const username='ankur.kumar';
const password='XYy66JV7mVWDJSavg6UibWRR3H2O3YdqyHwZ61dD7w4O5flVLM'

const auth = Buffer.from(`${username}:${password}`).toString('base64');


export const getJobList = async (req, res) => {
  try {
    const response = await axios.get('https://controller.hyperexecute.cloud/v1.0/jobs?&limit=100&is_cursor_base_pagination=true', {
      headers: {
        'Authorization': `Basic ${auth}`, 
      },
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching job list:', error);
    res.status(500).json({ error: 'Failed to fetch job list' });
  }
};

export const getJobStatus = async (req, res) => {
    const { jobId } = req.params; // Extract jobId from the route parameter
    try {
      const response = await axios.get(`https://api.hyperexecute.cloud/v2.0/job/${jobId}`, {
        headers: {
          'Authorization': `Basic ${auth}`, 
        },
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error(`Error fetching status for jobId ${jobId}:`, error);
      res.status(500).json({ error: `Failed to fetch status for jobId ${jobId}` });
    }
  };
