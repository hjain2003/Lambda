import React, { useState, useEffect } from 'react';
import './Summary.css';
import Navbar from '../Navbar/Navbar';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Testarea from '../TestArea/Testarea';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = () => {
  const [jobData, setJobData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To store selected job for Testarea
  const [jobStatusBox, setJobStatusBox] = useState(false); // To toggle Testarea visibility

  useEffect(() => {
    // Fetch job data from the API
    fetch('http://localhost:5000/lambda/jobs')
      .then((response) => response.json())
      .then((data) => {
        setJobData(data.data);
      })
      .catch((error) => console.error('Error fetching job data:', error));
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setJobStatusBox(true); // Show Testarea when job is clicked
  };

  const handleCloseJobBox = () => {
    setJobStatusBox(false); // Close Testarea when button is clicked
    setSelectedJob(null);
  };

  // Function to calculate the chart data
  const calculatePieChartData = (taskCount) => {
    const labels = [];
    const data = [];
    for (const os in taskCount) {
      if (taskCount[os] > 0) {
        labels.push(os);
        data.push(taskCount[os]);
      }
    }
    return { labels, data };
  };

  // Function to calculate progress bar style based on completed vs failed
  const getProgressBarStyle = (completed, failed) => {
    const total = completed + failed;
    const completionPercentage = (completed / total) * 100;
    return {
      width: `${completionPercentage}%`,
      backgroundColor: 'green', // Completed (Green)
    };
  };

  // Function to calculate failed progress bar style
  const getFailedProgressBarStyle = (completed, failed) => {
    const total = completed + failed;
    const failurePercentage = (failed / total) * 0;
    return {
      width: `${failurePercentage}%`,
      backgroundColor: 'red', // Failed (Red)
    };
  };

  // Function to calculate percentage for display
  const getPercentage = (completed, failed) => {
    const total = completed + failed;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className='summary_big_div'>
      <Navbar />
      <div className='summary_container'>
        {jobStatusBox && selectedJob && (
          <div className="job_status_box">
            <Testarea jobId={selectedJob.id} job={selectedJob} onClose={handleCloseJobBox} />
          </div>
        )}
        <div className='summary_grid'>
          {jobData.map((job) => {
            // Extract task counts for the pie chart
            const pieChartData = calculatePieChartData(job.taskCount);

            // Extract status counts for progress bars
            const preStatus = job.job_summary.pre_status_count.completed;
            const preFailed = job.job_summary.pre_status_count.failed;
            const postStatus = job.job_summary.post_status_count.completed;
            const postFailed = job.job_summary.post_status_count.failed;
            const scenarioStatus = job.job_summary.scenario_stage_summary.status_counts_excluding_retries.completed;
            const scenarioFailed = job.job_summary.scenario_stage_summary.status_counts_excluding_retries.failed;

            // Calculate percentage for each progress bar
            const prePercentage = getPercentage(preStatus, preFailed);
            const scenarioPercentage = getPercentage(scenarioStatus, scenarioFailed);
            const postPercentage = getPercentage(postStatus, postFailed);

            return (
              <div key={job.id} className='summary_card'>
                <div className='job_number'>
                  # {job.job_number}
                </div>

                {/* FaExternalLinkAlt icon to open Testarea */}
                <div 
                  className="open-testarea-icon" 
                  onClick={() => handleJobClick(job)}
                  style={{
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    cursor: 'pointer'
                  }}
                >
                  <FaExternalLinkAlt />
                </div>

                {/* Pie Chart */}
                <div className='pie_chart_container'>
                  <Pie
                    data={{
                      labels: pieChartData.labels,
                      datasets: [
                        {
                          data: pieChartData.data,
                          backgroundColor: ['#46c4f6', '#FFA500', '#000000'],
                        },
                      ],
                    }}
                  />
                </div>

                {/* Status Progress Bars */}
                <div className='progress_bar'>
                  <div className='progress_label'>
                    Pre Status [{prePercentage}% Pass]
                  </div>
                  <div className='progress_bar_container'>
                    <div
                      className='progress_bar_filled'
                      style={getProgressBarStyle(preStatus, preFailed)}
                    >
                      <span className='progress_bar_text'>
                        {preStatus} / {preStatus + preFailed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='progress_bar'>
                  <div className='progress_label'>
                    Scenario Status [{scenarioPercentage}% Pass]
                  </div>
                  <div className='progress_bar_container'>
                    <div
                      className='progress_bar_filled'
                      style={getProgressBarStyle(scenarioStatus, scenarioFailed)}
                    >
                      <span className='progress_bar_text'>
                        {scenarioStatus} / {scenarioStatus + scenarioFailed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='progress_bar'>
                  <div className='progress_label'>
                    Post Status [{postPercentage}% Pass]
                  </div>
                  <div className='progress_bar_container'>
                    <div
                      className='progress_bar_filled'
                      style={getProgressBarStyle(postStatus, postFailed)}
                    >
                      <span className='progress_bar_text'>
                        {postStatus} / {postStatus + postFailed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Summary;
