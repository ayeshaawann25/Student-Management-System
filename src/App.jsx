import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import EnrollmentList from './components/EnrollmentList';
import GradeList from './components/GradeList';
import FeeList from './components/FeeList';
import AttendanceList from './components/AttendanceList';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/add" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/add" element={<CourseForm />} />
            <Route path="/courses/edit/:id" element={<CourseForm />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/grades" element={<GradeList />} />
            <Route path="/fees" element={<FeeList />} />
            <Route path="/attendance" element={<AttendanceList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
