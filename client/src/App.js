import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Summary from "./components/Summary/Summary";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='/summary' element={<Summary/>}/>
      </Routes>
    </>
  );
}

export default App;
