"use client";
import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaHeartbeat,
  FaCalendarCheck,
  FaBookOpen,
  FaBook,
} from "react-icons/fa";
import HealthRecordPage from "../../../components/healthcomponent/healthrecordpage";
import DisciplineRecordPage from "../../../components/disciplinecomponent/disciplineRecordPage";
import StudentReportCardPage from "../../../components/academicscomponent/StudentReportCardPage";
import StudentTranscriptPage from "../../../components/academicscomponent/StudentTranscriptPage";
import StudentAttendanceReport from "../studentattendancereport/studentattendancereport";
import { useSession } from "next-auth/react";
import Loadingpage from "../../../components/Loadingpage";

const dummyStudentData = {
  id: "12345",
  name: "John Doe",
  profilePicture: "/path/to/picture.jpg",
  grade: "10th",
  dateOfBirth: "2006-05-15",
  gender: "Male",
  address: "123 School St, City, State 12345",
  phone: "(123) 456-7890",
  email: "john.doe@school.edu",
  attendance: "95%",
  // disciplineRecords: [
  //   {
  //     date: "2023-05-15",
  //     incident: "Disruptive behavior in class",
  //     severity: "Minor",
  //     actionTaken: "Verbal warning",
  //   },
  //   {
  //     date: "2023-06-02",
  //     incident: "Skipping class",
  //     severity: "Moderate",
  //     actionTaken: "Detention",
  //   },
  // ],
  healthRecord: {
    bloodType: "A+",
    allergies: ["Peanuts", "Penicillin"],
    medicalConditions: ["Asthma"],
  },
  attendanceReport: {
    daysPresent: 170,
    daysAbsent: 8,
    daysLate: 2,
  },
};

const dummyTranscriptData = {
  gpa: 3.78,
  courses: [
    {
      year: "2023",
      name: "Physics",
      grade: "B+",
      credits: 4,
    },
    {
      year: "2023",
      name: "World History",
      grade: "A",
      credits: 3,
    },
    {
      year: "2022",
      name: "Chemistry",
      grade: "A-",
      credits: 4,
    },
  ],
};

const dummyReportCardData = {
  semester: "Fall 2023",
  courses: [
    {
      name: "Mathematics",
      grade: "A",
      teacher: "Mr. Johnson",
      comments:
        "Excellent performance in advanced topics. Keep up the good work!",
    },
    {
      name: "English LiterattranscriptDataure",
      grade: "B+",
      teacher: "Ms. Thompson",
      comments: "Strong analytical skills. Could improve on essay structure.",
    },
  ],
  semesterGPA: 3.85,
  teacherNote:
    "Jane has shown remarkable progress this semester. Her dedication to her studies is commendable, and she consistently contributes positively to class discussions. While her performance is strong across all subjects, I encourage her to challenge herself further in areas where she excels. Keep up the fantastic work, Jane!",
};
const dummyHealthData = {
  medicalConditions: ["Asthma"],
  allergies: ["Peanuts", "Dust"],
  medications: ["Albuterol inhaler"],
  incidents: [
    {
      date: "2023-04-10",
      description: "Asthma attack",
      actionTaken: "Used inhaler, parents notified",
    },
    {
      date: "2023-05-22",
      description: "Scraped knee during recess",
      actionTaken: "Cleaned and bandaged",
    },
    // ... more health incidents
  ],
};

const dummyAttendanceData = {
  overallAttendance: 92,
  totalDays: 100,
  presentCount: 92,
  absentCount: 5,
  lateCount: 3,
  semester: "Fall 2024",
  attendanceRecords: [
    { date: "2024-08-01", status: "Present" },
    { date: "2024-08-02", status: "Present" },
    { date: "2024-08-03", status: "Absent" },
    { date: "2024-08-04", status: "Late" },
    { date: "2024-08-05", status: "Present" },
    { date: "2024-08-06", status: "Present" },
    { date: "2024-08-07", status: "Present" },
    { date: "2024-08-08", status: "Absent" },
    { date: "2024-08-09", status: "Present" },
    { date: "2024-08-10", status: "Present" },
  ],
};

const dummyDisciplineData = [
  {
    date: "2023-05-15",
    incident: "Disruptive behavior in class",
    severity: "Minor",
    actionTaken: "Verbal warning",
  },
  {
    date: "2023-06-02",
    incident: "Skipping class",
    severity: "Moderate",
    actionTaken: "Detention",
  },
  // ... more discipline records
];

const CollapsibleSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {icon}
          <span className="ml-2 font-semibold">{title}</span>
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div className="p-2 border-l border-r border-b rounded-b">
          {children}
        </div>
      )}
    </div>
  );
};

const StudentProfile = ({
  studentData,
  onCancel,
  pageTitle = "Student Profile",
  // healthData = dummyHealthData,
  handlePrint,
  displayBtns = true,
}) => {
  const { data: session, status } = useSession();

  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authorizedRoles = ["admin", "head teacher", "student", "Student"];
    const authorizedPermissions = ["view student profile"];

    if (
      session?.user?.permissions?.some((permission) =>
        authorizedPermissions.includes(permission)
      ) ||
      authorizedRoles.includes(session?.user?.role)
    ) {
      console.log("student profile authorization");
      setIsAuthorised(true);
    } else {
      console.log("student profile authorization222");

      setIsAuthorised(false);
    }
  }, [session, status]);

  if (!isAuthorised) {
    return (
      <div className="flex items-center">
        You are not authorised to be on this page
      </div>
    );
  }

  if (isLoading) {
    return <Loadingpage />;
  }
  // console.log("transcriptData", studentData);
  return (
    <div className="p-6 max-w-3xl mx-auto overflow-auto text-cyan-600 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">{pageTitle}</h2>
      <div className="flex mb-6 bg-white">
        <img
          src={studentData?.student?.photo || "/default-profile-picture.jpg"}
          alt={`${studentData?.student?.name}'s profile`}
          className="w-32 h-32 rounded-full object-cover mr-6"
        />
        <div>
          <h3 className="text-xl font-semibold">{`${studentData?.student?.first_name} ${studentData?.student?.last_name} ${studentData?.student?.other_names}`}</h3>
          <p className="text-gray-600">
            Student ID: {studentData?.student?.id}
          </p>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-2">Basic Information</h4>
      <table className="w-full mb-6 ">
        <tbody className="grid">
          <tr>
            <td className="font-semibold pr-4 py-2">Grade:</td>
            <td>{studentData?.student?.class_name}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 py-2">Date of Birth:</td>
            <td>{studentData?.student?.date_of_birth}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 py-2">Gender:</td>
            <td>{studentData?.student?.gender}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 py-2">Address:</td>
            <td>{studentData?.student?.residential_address}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 py-2">Phone:</td>
            <td>{studentData?.student?.phone}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 py-2">Email:</td>
            <td>{studentData?.student?.email}</td>
          </tr>
        </tbody>
      </table>

      <CollapsibleSection
        title="Health Record"
        icon={<FaHeartbeat className="text-red-500" />}
      >
        <HealthRecordPage healthData={studentData?.healthRecord} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Attendance Report"
        icon={<FaCalendarCheck className="text-green-500" />}
      >
        <StudentAttendanceReport
          attendanceData={studentData?.attendanceData}
          showdetails={true}
          student={studentData?.student}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Academics Report card"
        icon={<FaBookOpen className="text-purple-500" />}
      >
        <StudentReportCardPage
          student={studentData?.student}
          reportCardData={studentData?.academicReport}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Academics Transcript"
        icon={<FaBook className="text-purple-500" />}
      >
        <StudentTranscriptPage
          student={studentData?.student}
          transcriptData={studentData?.transcript}
        />
      </CollapsibleSection>
      {displayBtns && (
        <div className="mt-6 text-right">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded mr-6 hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
