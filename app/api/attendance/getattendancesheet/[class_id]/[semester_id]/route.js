import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

// /api/attendance/getattendancesheet/[class_id]/[semester_id]

export async function GET(req, { params }) {
  try {
    const { class_id, semester_id } = params;
// console.log('attendancesheet', class_id, semester_id)

    if (!class_id || !semester_id) {
      return NextResponse.json(
        { error: "Class ID and Semester ID are required" },
        { status: 400 }
      );
    }

    // Query to fetch semester dates
    const semesterQuery = `
      SELECT start_date, end_date
      FROM semesters
      WHERE semester_id = $1 AND status != 'deleted'
    `;

    const semesterResult = await db.query(semesterQuery, [semester_id]);

    if (semesterResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Semester not found or not active" },
        { status: 404 }
      );
    }

    const { start_date, end_date } = semesterResult.rows[0];

    // Query to fetch attendance data for the class within the semester date range
    const attendanceQuery = `
      SELECT 
        s.student_id,
        s.first_name || ' ' || s.last_name AS name,
        a.attendance_date,
        a.status
      FROM 
        students s
      LEFT JOIN attendance a ON a.student_id = s.student_id 
        AND a.attendance_date BETWEEN $2 AND $3
        AND a.semester_id = $4
      WHERE 
        s.class_id = $1 AND s.status = 'active'
      ORDER BY 
        s.student_id, a.attendance_date
    `;

    const attendanceResult = await db.query(attendanceQuery, [
      class_id,
      start_date,
      end_date,
      semester_id,
    ]);

    // Process attendance data
    const studentMap = new Map();

    attendanceResult.rows.forEach((row) => {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, {
          student_id: row.student_id,
          name: row.name,
          attendance: [],
        });
      }

      if (row.attendance_date && row.status) {
        studentMap.get(row.student_id).attendance.push({
          date: row.attendance_date.toISOString().split("T")[0],
          status: row.status.charAt(0).toUpperCase() + row.status.slice(1),
        });
      }
    });

    const attendanceData = Array.from(studentMap.values());

    // Calculate class-wide statistics
    const totalStudents = attendanceData.length;
    const totalDays = attendanceData[0]?.attendance.length || 0;
    const totalPresent = attendanceData.reduce(
      (sum, student) =>
        sum + student.attendance.filter((a) => a.status === "Present").length,
      0
    );
    const totalAbsent = attendanceData.reduce(
      (sum, student) =>
        sum + student.attendance.filter((a) => a.status === "Absent").length,
      0
    );
    const totalLate = attendanceData.reduce(
      (sum, student) =>
        sum + student.attendance.filter((a) => a.status === "Late").length,
      0
    );
    const averageAttendanceRate =
      totalDays > 0
        ? Math.round(
            ((totalPresent + totalLate) / (totalStudents * totalDays)) * 100
          )
        : 0;

    return NextResponse.json(
      {
        classStatistics: {
          totalStudents,
          totalDays,
          totalPresent,
          totalAbsent,
          totalLate,
          averageAttendanceRate,
        },
        attendanceData,
        semesterDates: {
          start_date,
          end_date,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
