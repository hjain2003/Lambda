import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Start loading spinner
      try {
        const response = await fetch("http://localhost:5000/lambda/jobs");
        const result = await response.json();
        setJobs(result.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchJobs();
  }, []);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter((job) =>
    job.job_number.toString().includes(searchQuery.trim())
  );

  return (
    <>
      <div className="main_div">
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
              onChange={(e) => setSearchQuery(e.target.value)} // Update search input
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
            <div className="loading-spinner"></div> // Display spinner when loading
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
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
