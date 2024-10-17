// pages/dashboard/parent.js
"use client";

import React from "react";
import {
  FaChild,
  FaGraduationCap,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBell,
  FaBook,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
// import StatCard from "@/app/components/statcard";
import StatCard from "../../../components/statcard";
// import StatCard from "./";

const ParentDashboard = () => {
  // Dummy data - replace with actual data from your API
  const childrenPerformance = [
    { name: "John", Math: 85, Science: 92, English: 78, History: 88 },
    { name: "Emma", Math: 92, Science: 88, English: 95, History: 82 },
  ];

  const attendanceData = [
    { month: "Jan", John: 95, Emma: 98 },
    { month: "Feb", John: 98, Emma: 96 },
    { month: "Mar", John: 92, Emma: 99 },
    { month: "Apr", John: 96, Emma: 97 },
    { month: "May", John: 94, Emma: 95 },
  ];

  const upcomingEvents = [
    { date: "2024-07-20", event: "Parent-Teacher Conference" },
    { date: "2024-07-25", event: "School Sports Day" },
    { date: "2024-08-01", event: "Annual Science Fair" },
  ];

  const recentAnnouncements = [
    {
      date: "2024-07-15",
      title: "New School Portal",
      content: "We're launching a new online portal for parents next month.",
    },
    {
      date: "2024-07-10",
      title: "Summer Camp Registration",
      content: "Registration for the annual summer camp is now open.",
    },
  ];

  return (
    <>
      
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Parent Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<FaChild />} title="Children" value="2" />
          <StatCard icon={<FaGraduationCap />} title="Avg. GPA" value="3.7" />
          <StatCard icon={<FaCalendarAlt />} title="Attendance" value="96%" />
          <StatCard icon={<FaMoneyBillWave />} title="Fees Due" value="$250" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700">
              Children's Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={childrenPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Math" fill="#8884d8" />
                <Bar dataKey="Science" fill="#82ca9d" />
                <Bar dataKey="English" fill="#ffc658" />
                <Bar dataKey="History" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700">
              Attendance Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="John" stroke="#8884d8" />
                <Line type="monotone" dataKey="Emma" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700">
              Upcoming Events
            </h2>
            <ul>
              {upcomingEvents.map((event, index) => (
                <li key={index} className="mb-2 pb-2 border-b last:border-b-0">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-cyan-500 mr-2" />
                    <span className="font-semibold">{event.date}</span>
                  </div>
                  <p className="ml-6 text-cyan-700">{event.event}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700">
              Recent Announcements
            </h2>
            <ul>
              {recentAnnouncements.map((announcement, index) => (
                <li key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex items-center mb-2">
                    <FaBell className="text-cyan-500 mr-2" />
                    <span className="font-semibold">{announcement.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {announcement.date}
                  </p>
                  <p>{announcement.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
</> );
};

export default ParentDashboard;
