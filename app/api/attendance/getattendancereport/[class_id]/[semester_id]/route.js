import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

// /api/attendance/getattendancereport/1/1


export async function GET(req, { params }) {
  try {
    const { class_id, semester_id } = params;
    // const { searchParams } = new URL(req.url);
    // const semester_id = searchParams.get("semester_id");

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
      WHERE semester_id = $1 AND status = 'active'
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
        s.student_id AS id,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late
      FROM 
        students s
      LEFT JOIN attendance a ON a.student_id = s.student_id 
        AND a.attendance_date BETWEEN $2 AND $3
        AND a.semester_id = $4
      WHERE 
        s.class_id = $1 AND s.status = 'active'
      GROUP BY 
        s.student_id, s.first_name, s.last_name, s.student_id
      ORDER BY 
        s.student_id
    `;

    const attendanceResult = await db.query(attendanceQuery, [
      class_id,
      start_date,
      end_date,
      semester_id,
    ]);

    // Process attendance data
    const students = attendanceResult.rows.map((row) => {
      const totalDays =
        parseInt(row.present) + parseInt(row.absent) + parseInt(row.late);
      const attendanceRate =
        totalDays > 0
          ? Math.round(
              ((parseInt(row.present) + parseInt(row.late)) / totalDays) * 100
            )
          : 0;

      return {
        id: row.student_id,
        name: row.name,
        studentId: row.studentid,
        present: parseInt(row.present),
        absent: parseInt(row.absent),
        late: parseInt(row.late),
        attendanceRate: attendanceRate,
      };
    });

    // Calculate class-wide statistics
    const totalStudents = students.length;
    const totalDays = students.reduce(
      (sum, student) => sum + student.present + student.absent + student.late,
      0
    );
    const totalPresent = students.reduce(
      (sum, student) => sum + student.present,
      0
    );
    const totalAbsent = students.reduce(
      (sum, student) => sum + student.absent,
      0
    );
    const totalLate = students.reduce((sum, student) => sum + student.late, 0);
    const averageAttendanceRate =
      totalStudents > 0
        ? Math.round(
            students.reduce((sum, student) => sum + student.attendanceRate, 0) /
              totalStudents
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
        students,
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
