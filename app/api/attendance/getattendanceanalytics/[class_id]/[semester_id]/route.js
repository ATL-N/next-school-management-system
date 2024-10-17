import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const { class_id, semester_id } = params;

    if (!class_id || !semester_id) {
      return NextResponse.json(
        { error: "Class ID and Semester ID are required" },
        { status: 400 }
      );
    }

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

    const attendanceQuery = `
      WITH date_range AS (
        SELECT generate_series($2::date, $3::date, '1 day'::interval) AS attendance_date
      )
      SELECT 
        dr.attendance_date,
        COUNT(DISTINCT s.student_id) AS total_students,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_count
      FROM 
        date_range dr
      CROSS JOIN students s
      LEFT JOIN attendance a ON a.student_id = s.student_id 
        AND a.attendance_date = dr.attendance_date
        AND a.semester_id = $4
      WHERE 
        s.class_id = $1 AND s.status = 'active'
      GROUP BY 
        dr.attendance_date
      ORDER BY 
        dr.attendance_date
    `;

    const attendanceResult = await db.query(attendanceQuery, [
      class_id,
      start_date,
      end_date,
      semester_id,
    ]);

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalStudents = 0;

    const dailyAttendance = attendanceResult.rows
      .map((row) => {
        const presentCount = parseInt(row.present_count) || 0;
        const absentCount = parseInt(row.absent_count) || 0;
        const lateCount = parseInt(row.late_count) || 0;
        const totalCount = presentCount + absentCount + lateCount;

        totalPresent += presentCount;
        totalAbsent += absentCount;
        totalLate += lateCount;
        totalStudents = Math.max(
          totalStudents,
          parseInt(row.total_students) || 0
        );

        const attendanceRate =
          totalCount > 0
            ? Math.round(((presentCount + lateCount) / totalCount) * 100)
            : null;

        return {
          date: row.attendance_date.toISOString().split("T")[0],
          attendanceRate: attendanceRate,
        };
      })
      .filter((day) => day.attendanceRate !== null);

    const totalClasses = dailyAttendance.length;
    const averageAttendanceRate =
      totalClasses > 0
        ? Math.round(
            ((totalPresent + totalLate) /
              (totalPresent + totalAbsent + totalLate)) *
              100
          )
        : 0;

    return NextResponse.json(
      {
        averageAttendanceRate,
        totalClasses,
        totalStudents,
        presentCount: totalPresent,
        absentCount: totalAbsent,
        lateCount: totalLate,
        dailyAttendance,
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
