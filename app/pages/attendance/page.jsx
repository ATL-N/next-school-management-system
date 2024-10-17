// pages/dashboard/attendance/index.js
"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserCheck,
  FaChartBar,
  FaFileAlt,
  FaPlus,
  FaFile,
  FaInfoCircle,
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
} from "recharts";
import StatCard from "../../components/statcard";
import Modal from "../../components/modal/modal";
import CustomTable from "../../components/listtableForm";
import TakeAttendance from "./takeattendance/takeattendace";
import AttendanceReport from "./attendancereport/attendancereport";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/generalLoadingpage";
import { fetchData } from "../../config/configFile";
import AttendanceAnalytics from "./analytics/analysis";

const StudentAttendance = () => {
  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionIsAllowed, setActionIsAllowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalActiveStudents, setTotalActiveStudents] = useState(0);
  const [totalPresentToday, setTotalPresentToday] = useState(0);
  const [totalAbsentToday, setTotalAbsentToday] = useState(0);
  const [averageAttendanceForSemester, setAverageAttendanceForSemester] =
    useState(0);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.activeSemester?.semester_id
    ) {
      fetchAttendanceData();
      // fetchTimetableData(classId);
    }
  }, [status, session]);

  useEffect(() => {
    const authorizedRoles = ["admin", "head teacher"];
    const authorizedPermissions = ["edit attendance"];

    if (
      session?.user?.permissions?.some((permission) =>
        authorizedPermissions.includes(permission)
      )
    ) {
      setActionIsAllowed(true);
    } else {
      setActionIsAllowed(false);
    }
  }, [session]);

  const fetchAttendanceData = async (searchQuery1 = "") => {
    // Implement the fetch logic here
    // This is a placeholder for demonstration

    const activeSemester = session.user.activeSemester.semester_id;

    try {
      const [attendanceResponse] = await Promise.all([
        fetchData(
          `/api/attendance/getsemattendance/${activeSemester}`,
          "",
          false
        ),
      ]);
      // console.log("attendanceResponse", attendanceResponse);
      setAttendanceData(attendanceResponse?.attendanceData);
      setTotalActiveStudents(attendanceResponse?.totalActiveStudents);
      setTotalPresentToday(attendanceResponse?.totalPresentToday);
      setTotalAbsentToday(attendanceResponse?.totalAbsentToday);
      setAverageAttendanceForSemester(
        attendanceResponse?.averageAttendanceForSemester.toFixed(2)
      );
    } catch (error) {
      console.error("Error fetching class data:", error);
      // Handle error (e.g., show error message to user)
    }

    setIsLoading(false);
  };

  const handleTakeAttendance = () => {
    setModalContent(
      <TakeAttendance
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          setShowModal(false);
          fetchAttendanceData();
        }}
      />
    );
    setShowModal(true);
  };

  const viewClassAttendance = (attendanceId) => {
    setModalContent(<AttendanceAnalytics />);
    setShowModal(true);
  };

  const handleAttendanceReport = async () => {
    try {
      // const [semesterdata, classdata] = await Promise.all([
      //   fetchData(`/api/semester/all`, "", false),
      //   fetchData(`/api/classes/all`, "", true),
      // ]);

      setModalContent(
        <AttendanceReport
          // classes={classdata?.classes}
          // semestersData={semesterdata}
          onClose={() => setShowModal(false)}
        />
      );
      setShowModal(true);
    } catch {}
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="text-cyan-700">
        <LoadingPage />
      </div>
    );
  }

  const headerNames = [
    "ID",
    "Class",
    "Total students",
    "Present",
    "Absent",
    "Terms Attendance Rate(%)",
  ];

  return (
    <>
      <div className="pb-16 text-cyan-600">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Student Attendance
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FaUserCheck />}
            title="Total Students"
            value={totalActiveStudents}
          />
          <StatCard
            icon={<FaUserCheck />}
            title="Present Today"
            value={totalPresentToday}
          />
          <StatCard
            icon={<FaUserCheck />}
            title="Absent Today"
            value={totalAbsentToday}
          />
          <StatCard
            icon={<FaChartBar />}
            title="Attendance Rate"
            value={`${averageAttendanceForSemester}%`}
          />
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-700">
              Attendance Management
            </h2>
            <div className="flex">
              <button
                onClick={handleTakeAttendance}
                className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center mr-2"
              >
                <FaPlus className="mr-2" /> Take Attendance
              </button>
              <button
                onClick={handleAttendanceReport}
                className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center"
              >
                <FaFileAlt className="mr-2" /> Attendance Report
              </button>
            </div>
          </div>
          <div className="overflow-x-auto tableWrap">
            <CustomTable
              data={attendanceData}
              headerNames={headerNames}
              maxTableHeight="40vh"
              height="20vh"
              editIcon={<FaInfoCircle />}
              editTitle="Details of id "
              searchTerm={searchQuery}
              searchPlaceholder="Search by date or class"
              displaySearchBar={false}
              displayActions={actionIsAllowed}
              displayDetailsBtn={false}
              displayDelBtn={false}
              handleEdit={viewClassAttendance}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6 text-cyan-500">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700">
              Attendance Analytics
            </h2>
            <button
              onClick={viewClassAttendance}
              className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center mr-2"
            >
              <FaFile className="mr-2" /> View Analytics
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendanceRate" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default StudentAttendance;
