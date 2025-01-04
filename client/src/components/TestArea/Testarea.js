import React, { useEffect, useState } from "react";
import "./Testarea.css";

const Testarea = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedButton, setSelectedButton] = useState("pre");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:5000/lambda/job/${jobId}`);
        const result = await response.json();
        const tasksData = result?.data?.tasks || [];
        setJob(result?.data);
        setTasks(tasksData);

        // Default selection: First task and Pre Steps
        if (tasksData.length > 0) {
          const firstTaskId = tasksData[0].id;
          setSelectedTaskId(firstTaskId);
          fetchStages(firstTaskId);
        }
        filterStages("pre");
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchJobData();
  }, [jobId]);

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

  const fetchStages = async (taskId) => {
    setLoading(true); 
    try {
      setSelectedTaskId(taskId); 
      const response = await fetch(`http://localhost:5000/lambda/stage/${taskId}`);
      const result = await response.json();
      setStages(result?.data || []);
      setFilteredStages(result?.data || []); 
    } catch (error) {
      console.error("Error fetching task stages:", error);
    } finally {
      setLoading(false); 
    }
  };

  const filterStages = (type) => {
    setSelectedButton(type); 
    let filtered;
    switch (type) {
      case "pre":
        filtered = stages.filter((stage) =>
          ["cache-download", "setup-runtime", "prerun", "test_discovery"].includes(stage.type)
        );
        break;
      case "scenario":
        filtered = stages.filter((stage) => stage.type === "scenario");
        break;
      case "post":
        filtered = stages.filter((stage) =>
          ["artefact", "cache-upload"].includes(stage.type)
        );
        break;
      default:
        filtered = stages;
    }
    setFilteredStages(filtered);
  };

  return (
    <>
      <div className="left_pane">
        <div className="left_pane_heading">
          <b>ENV</b>
        </div>
        <div className="tasks">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task_card ${selectedTaskId === task.id ? "selected_task" : ""}`}
              onClick={() => fetchStages(task.id)}
            >
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
            <button
              className={`steps ${selectedButton === "pre" ? "selected_button" : ""}`}
              onClick={() => filterStages("pre")}
            >
              Pre Steps
            </button>
            <button
              className={`steps ${selectedButton === "scenario" ? "selected_button" : ""}`}
              onClick={() => filterStages("scenario")}
            >
              Scenarios
            </button>
            <button
              className={`steps ${selectedButton === "post" ? "selected_button" : ""}`}
              onClick={() => filterStages("post")}
            >
              Post Steps
            </button>
          </div>

          <div className="stage_list">
            {loading ? (
              <div>Loading...</div> 
            ) : (
              filteredStages.map((stage) => (
                <div key={stage.id} className="stage_card">
                  <p>
                    <b>{stage.name}</b>
                  </p>
                  &nbsp;&nbsp;
                  <p className="stage_tick_cross">
          <span className={`status-icon ${stage.status === "completed" ? "green" : "red"}`}>
            {stage.status === "completed" ? "✓" : "✕"}
          </span>
        </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Testarea;
