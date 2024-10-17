import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../lib/db";

// GET /api/students/[id]
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Fetch student data
    const studentQuery = `
      SELECT 
      s.*, 
      TO_CHAR(s.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      TO_CHAR(s.enrollment_date, 'YYYY-MM-DD') AS enrollment_date,
      u.user_name, 
      u.user_email
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = $1
    `;
    const studentResult = await db.query(studentQuery, [id]);

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentResult.rows[0];

    // Fetch health record
    const healthQuery = `
      SELECT * FROM user_health_record
      WHERE user_id = $1
    `;
    const healthResult = await db.query(healthQuery, [student.user_id]);
    const healthRecord = healthResult.rows[0] || {};

    // Fetch parents
    const parentsQuery = `
      SELECT p.*, sp.relationship
      FROM parents p
      JOIN student_parent sp ON p.parent_id = sp.parent_id
      WHERE sp.student_id = $1
    `;
    const parentsResult = await db.query(parentsQuery, [id]);
    const parents = parentsResult.rows;

    // Combine all data
    const studentData = {
      ...student,
      ...healthRecord,
      parent1: parents[0] || {},
      parent2: parents[1] || {},
    };

    return NextResponse.json(studentData, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id]
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    await db.query("BEGIN");

    // Update students table
    const updateStudentQuery = `
      UPDATE students
      SET
        first_name = $1, last_name = $2, other_names = $3, date_of_birth = $4,
        gender = $5, class_id = $6, class_promoted_to = $6, amountowed = $7, residential_address = $8,
        phone = $9, email = $10, enrollment_date = $11, national_id = $12,
        birth_cert_id = $13, photo = $14
      WHERE student_id = $15
      RETURNING *;
    `;
    const studentResult = await db.query(updateStudentQuery, [
      body.first_name,
      body.last_name,
      body.other_names,
      body.date_of_birth,
      body.gender,
      body.class_id,
      body.amountowed,
      body.residential_address,
      body.phone,
      body.email,
      body.enrollment_date,
      body.national_id,
      body.birth_cert_id,
      body.photo,
      id,
    ]);

    if (studentResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentResult.rows[0];

    // Update user_health_record table
    const updateHealthQuery = `
      UPDATE user_health_record
      SET
        medical_conditions = $1, allergies = $2, blood_group = $3,
        vaccination_status = $4, health_insurance_id = $5
      WHERE user_id = $6;
    `;
    await db.query(updateHealthQuery, [
      body.medical_conditions,
      body.allergies,
      body.blood_group,
      body.vaccination_status,
      body.health_insurance_id,
      student.user_id,
    ]);

    // Update parents
    for (let i = 1; i <= 2; i++) {
      const parentPrefix = `parent${i}`;
      const parentId = body[`${parentPrefix}_selection`];

      if (parentId) {
        // Update existing parent
        const updateParentQuery = `
          UPDATE parents
          SET
            other_names = $1, last_name = $2, phone = $3, email = $4, address = $5
          WHERE parent_id = $6;
        `;
        await db.query(updateParentQuery, [
          body[`${parentPrefix}_other_names`],
          body[`${parentPrefix}_last_name`],
          body[`${parentPrefix}_phone`],
          body[`${parentPrefix}_email`],
          body[`${parentPrefix}_address`],
          parentId,
        ]);

        // Update relationship
        const updateRelationshipQuery = `
          UPDATE student_parent
          SET relationship = $1
          WHERE student_id = $2 AND parent_id = $3;
        `;
        await db.query(updateRelationshipQuery, [
          body[`${parentPrefix}_relationship`],
          id,
          parentId,
        ]);
      } else {
        // Insert new parent
        const insertParentQuery = `
          INSERT INTO parents (other_names, last_name, phone, email, address)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING parent_id;
        `;
        const parentResult = await db.query(insertParentQuery, [
          body[`${parentPrefix}_other_names`],
          body[`${parentPrefix}_last_name`],
          body[`${parentPrefix}_phone`],
          body[`${parentPrefix}_email`],
          body[`${parentPrefix}_address`],
        ]);
        const newParentId = parentResult.rows[0].parent_id;

        // Link new parent to student
        const insertRelationshipQuery = `
          INSERT INTO student_parent (student_id, parent_id, relationship)
          VALUES ($1, $2, $3);
        `;
        await db.query(insertRelationshipQuery, [
          id,
          newParentId,
          body[`${parentPrefix}_relationship`],
        ]);
      }
    }

    await db.query("COMMIT");

    return NextResponse.json(
      { message: "Student updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// POST /api/students/addstudent
export async function POST(req) {
  // ... (Keep the existing POST function as it is)
}
