"use client";
import React, { useState, useEffect } from "react";
import AttendanceForm from "../../../components/attendancecomponent/attendanceform";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/modal/confirmModal";
import InfoModal from "../../../components/modal/infoModal";
import { useSession } from "next-auth/react";
import Loadingpage from "../../../components/Loadingpage";


const TakeAttendance = ({ id, attendanceData, class_id }) => {
  const { data: session, status } = useSession();

 
  const isWeekend = () => {
    const now = new Date();
    return now.getDay() === 0 || now.getDay() === 6; // 0 is Sunday, 6 is Saturday
  };

  const isBeforeNoon = () => {
    const now = new Date();
    return now.getHours() < 14 && now.getHours() >= 7;
  };

  const isAttendanceAllowedState = () => {
    return !isWeekend() && isBeforeNoon();
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState("");
  const [activeSemester, setActiveSemester] = useState();
  const [userId, setUserId] = useState();
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [isAttendanceAllowed, setIsAttendanceAllowed] = useState(
    isAttendanceAllowedState
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isAuthorised, setIsAuthorised] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authorizedRoles = ["admin", "head teacher"];
    const authorizedPermissions = ["take attendance", "update attendance"];

    if (
      session?.user?.permissions?.some((permission) =>
        authorizedPermissions.includes(permission)
      )
    ) {
      setIsAuthorised(true);
    } else {
      setIsAuthorised(false);
    }

     if (
      status === "authenticated" &&
      session?.user?.activeSemester?.semester_id
    ) {
      setActiveSemester(session?.user?.activeSemester?.semester_id);
      setUserId(session?.user?.id)
    }
  }, [session, status]);

  useEffect(() => {
    if(class_id){
      setSelectedClass(class_id)
    }
    fetchClass();
    fetchStudents();
  }, []);

  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAttendanceAllowed(isAttendanceAllowedState);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (id && attendanceData) {
      setSelectedClass(attendanceData.class_id);
      setDate(attendanceData.attendance_date);
      const initialAttendance = {};
      attendanceData.attendance.forEach((record) => {
        initialAttendance[record.student_id] = record.status;
      });
      setAttendance(initialAttendance);
      setOriginalData(initialAttendance);
    }
  }, [id, attendanceData]);

  const fetchClass = async (searchQuery1 = "") => {
    // const toastId = toast.loading("Fetching fees...");
    // setIsLoading(true)
    try {
      setIsLoading(true);

      let url = "/api/classes/all";
      if (searchQuery1.trim() !== "") {
        url += `?query=${encodeURIComponent(searchQuery1)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        console.log("Failed to fetch fees");
      }

      const data = await response.json();
      setClasses(data?.classes);

      if (searchQuery1.trim() !== "" && data.length === 0) {
        console.log("No fees found matching your search.");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (searchQuery1 = "") => {
    // const toastId = toast.loading("Fetching fees...");
    // setIsLoading(true)
    try {
      setIsLoading(true);

      let url = "/api/students/getstudents";
      if (searchQuery1.trim() !== "") {
        url += `?query=${encodeURIComponent(searchQuery1)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        console.log("Failed to fetch fees");
      }

      const data = await response.json();
      console.log("students", data);
      setStudents(data);

      if (searchQuery1.trim() !== "" && data.length === 0) {
        console.log("No fees found matching your search.");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAttendanceAllowed && !id) {
      toast.error("Attendance can only be taken on weekdays before 12:00 PM.");
      return;
    }
    console.log("attendance", attendance);
    setIsModalOpen(true);
  };

  const hasChanges = () => {
    return Object.keys(attendance).some(
      (studentId) => attendance[studentId] !== originalData[studentId]
    );
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    if (id && !hasChanges()) {
      setIsInfoModalOpen(true);
      return;
    }

    const toastId = toast.loading(
      id ? "Updating attendance..." : "Submitting attendance..."
    );
    setLoading(true);

    try {
      console.log("still in try catch 11");

      const url = id
        ? `/api/update-attendance/${id}`
        : "/api/attendance/takeattendance";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_id: selectedClass,
          attendance_date: date,
          attendance: Object.entries(attendance).map(([studentId, status]) => ({
            student_id: studentId,
            status,
          })),
          semester_id: activeSemester, // You'll need to provide the correct semester_id
          user_id: userId
        }),
      });

      console.log("still in try catch 22");

      if (!response.ok) {
        throw new Error("Failed to submit attendance");
      }
      console.log("still in try catch");

      const result = await response.json();
      toast.update(toastId, {
        render: result.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (!id) {
        setAttendance({});
        setSelectedClass("");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.update(toastId, {
        render: "Failed to submit attendance. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status,
    });
    console.log("attendance", attendance);
  };

  const handleReset = () => {
    setAttendance(id ? originalData : {});
    if (!id) {
      setSelectedClass("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  };

  if (!isAuthorised) {
    return (
      <div className="flex items-center text-cyan-700">
        You are not authorised to be on this page...!
      </div>
    );
  }

  if (isLoading) {
    return <Loadingpage />;
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={id ? "Update Attendance?" : "Submit Attendance?"}
        message={
          id
            ? "Are you sure you want to update the attendance?"
            : "If attendance has been taken for the day already, it would be updated. Are you sure you want to submit this attendance?"
        }
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Information"
        message="No changes detected. Please make changes before updating."
      />

      {students && classes ? (
        <AttendanceForm
          students={students} // Replace with actual students data
          classes={classes} // Replace with actual classes data
          onSubmit={handleSubmit}
          mode={id ? "edit" : "take"}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedDate={date}
          setSelectedDate={setDate}
          attendance={attendance}
          handleAttendanceChange={handleAttendanceChange}
          handleReset={handleReset}
          isAttendanceAllowed={isAttendanceAllowed}
          loading={loading}
        />
      ) : (
        <Loadingpage />
      )}
    </>
  );
};

export default TakeAttendance;
