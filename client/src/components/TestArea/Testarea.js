import React, { useEffect, useState } from "react";
import "./Testarea.css";

const Testarea = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/lambda/job/${jobId}`);
        const result = await response.json();
        setJob(result?.data);
        setTasks(result?.data?.tasks || []);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobData();
  }, [jobId]);

  // Map OS to icons
  const getOSLogo = (os) => {
    switch (os) {
      case "win":
        return "🖥️";
      case "mac":
        return "🍎"; 
      case "ios":
        return "📱";
      case "linux":
        return "🐧"; 
      case "android":
        return "🤖"; 
      default:
        return "❓";
    }
  };

  return (
    <>
      <div className="left_pane">
        <div className="left_pane_heading">
          <b>ENV</b>
        </div>
        <div className="tasks">
          {tasks.map((task) => (
            <div key={task.id} className="task_card">
              <div className="task_header">
                <span className="group_number">#{task.groupNumber}</span>
                <span className="os_logo">{getOSLogo(task.os)}</span>
              </div>
              <div className="task_status">
                {task.status === "completed" ? (
                  <span className="status-icon green">✓</span>
                ) : (
                  <span className="status-icon red">✕</span>
                )}
              </div>
              {/* <div className="task_remark">{task.remark}</div> */}
              {/* {task.endTime-task.startTime} */}
            </div>
          ))}
        </div>
      </div>

      <div className="topandmain">
        <div className="top_pane">
          <span>
            <b>
              Job #{job?.jobNumber}{" "}
              {job?.status === "completed" ? (
                <span className="status-icon green">✓</span>
              ) : job?.status === "failed" ? (
                <span className="status-icon red">✕</span>
              ) : null}
            </b>
          </span>

          <button id="close_job_box" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="main_body">
          <div className="button_container">
            <button className="steps">Pre Steps</button>
            <button className="steps">Scenarios</button>
            <button className="steps">Post Steps</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testarea;
