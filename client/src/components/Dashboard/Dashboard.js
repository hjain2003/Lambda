import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaSearch } from "react-icons/fa";
import Testarea from "../TestArea/Testarea";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [jobStatusBox, setJobStatusBox] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); 

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/lambda/jobs");
        const result = await response.json();
        setJobs(result.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleJobClick = (job) => {
    setSelectedJob(job); 
    setJobStatusBox(true); 
  };

  const handleCloseJobBox = () => {
    setJobStatusBox(false); 
    setSelectedJob(null); 
  };

  const filteredJobs = jobs.filter((job) =>
    job.job_number.toString().includes(searchQuery.trim())
  );

  return (
    <>
      <div className="main_div">
        {jobStatusBox && (
          <div className="job_status_box">
            <Testarea jobId={selectedJob?.id} job={selectedJob} onClose={handleCloseJobBox} />
          </div>
        )}
        <Navbar />
        <br />
        <div className="search-filter-container">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Job ID"
              className="searchjob"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="date-filter">
            <label>
              From:
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
                className="date-input"
              />
            </label>
            <label>
              To:
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
                className="date-input"
              />
            </label>
          </div>
        </div>

        <div className="jobs-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => handleJobClick(job)}
              >
                <div className="first_row">
                  {job.status === "completed" ? (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </span>
                    </div>
                  ) : job.status === "failed" ? (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "red",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  ) : null}
                  &nbsp;
                  <h3>Job #{job.job_number}</h3>
                  <p>
                    &nbsp;&nbsp;
                    <strong>[{new Date(job.created_at).toLocaleString()}]</strong>
                  </p>
                </div>
                <div className="second_row">
                  <p>
                    <strong>User:</strong> {job.user} |
                  </p>
                  &nbsp;&nbsp;
                  <p>
                    <strong>Tasks:</strong> {job.Tasks}
                  </p>
                  &nbsp;&nbsp;
                  <p>
                    <strong>Total Tests:</strong> {job.total_tests}
                  </p>
                  &nbsp;&nbsp;
                  <p>
                    <strong>Execution Time:</strong> {job.executionTime}
                  </p>
                  &nbsp;&nbsp;
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found for the given criteria.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
