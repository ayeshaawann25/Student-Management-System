import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook, FaGraduationCap, FaMoneyBill, FaCalendarCheck } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🎓 SMS
        </Link>
        <ul className="nav-links">
          <li><Link to="/"><FaGraduationCap /> Dashboard</Link></li>
          <li><Link to="/students"><FaUsers /> Students</Link></li>
          <li><Link to="/courses"><FaBook /> Courses</Link></li>
          <li><Link to="/enrollments"><FaGraduationCap /> Enrollments</Link></li>
          <li><Link to="/grades"><FaBook /> Grades</Link></li>
          <li><Link to="/fees"><FaMoneyBill /> Fees</Link></li>
          <li><Link to="/attendance"><FaCalendarCheck /> Attendance</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
