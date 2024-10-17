import React from "react";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
  Progress,
} from "../../../components/attendancecard";

const dummyStudent = {
  id: 1,
  name: "John Doe",
  grade: "10th",
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

const AttendanceStatusIcon = ({ status }) => {
  switch (status) {
    case "Present":
      return <FaCheckCircle className="text-green-500" />;
    case "Absent":
      return <FaTimesCircle className="text-red-500" />;
    case "Late":
      return <FaClock className="text-yellow-500" />;
    default:
      return null;
  }
};

const AttendanceTableRow = ({ record, index }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "text-green-600";
      case "absent":
        return "text-red-600";
      case "late":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <FaCalendarAlt className="inline mr-2 text-cyan-500" />
        {record.attendance_date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className="flex items-center">
          <AttendanceStatusIcon status={record.status} />
          <span className={`ml-2 ${getStatusColor(record.status)}`}>
            {record.status}
          </span>
        </span>
      </td>
    </tr>
  );
};


const StudentAttendanceReport = ({
  student = dummyStudent,
  attendanceData = dummyAttendanceData,
  showdetails = false,
}) => {
  console.log(attendanceData?.records[0]?.semester_name)
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-xl font-semibold text-cyan-600 flex items-center">
            <FaUserGraduate className="mr-2" />
            {student?.first_name}'s Attendance Report
          </h3>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Grade</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student?.class_name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Semester</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {attendanceData?.records[0]?.semester_name}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Overall Attendance
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Progress
                  value={attendanceData?.summary?.overallAttendance}
                  className="w-full"
                />
                <span className="text-lg font-semibold">
                  {attendanceData?.summary?.overallAttendance}%
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <h4 className="text-lg font-semibold text-cyan-600">
            Attendance Summary
          </h4>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-700">
                {attendanceData?.summary?.totalDays}
              </p>
              <p className="text-sm text-gray-500">Total Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {attendanceData?.summary?.presentCount}
              </p>
              <p className="text-sm text-gray-500">Present</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {attendanceData?.summary?.absentCount}
              </p>
              <p className="text-sm text-gray-500">Absent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {attendanceData?.summary?.lateCount}
              </p>
              <p className="text-sm text-gray-500">Late</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showdetails && (
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold text-cyan-600">
              Daily Attendance Records
            </h4>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              {attendanceData?.records?.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.records.map((record, index) => (
                      <AttendanceTableRow
                        key={index}
                        record={record}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-6 py-4 text-sm text-gray-500">
                  No attendance record taken for the student yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentAttendanceReport;
