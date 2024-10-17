import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let sqlQuery;
    let queryParams = [];

    if (query) {
      // Search functionality
      const sanitizedQuery = `%${query}%`;
      sqlQuery = `
        SELECT 
          *
        FROM 
          notifications n

        WHERE 
          (t.first_name ILIKE $1 OR t.last_name ILIKE $1 OR t.email ILIKE $1 OR t.role ILIKE $1 OR t.employee_id ILIKE $1) AND t.status='active'
        ORDER BY 
          t.first_name, t.last_name
        LIMIT 10000
      `;
      queryParams = [sanitizedQuery];
    } else {
      // Complete staff list
      sqlQuery = `
        SELECT 
          *
        FROM 
          notifications n

        WHERE n.status = 'active'
        
        ORDER BY 
         n.notification_id DESC

        LIMIT 10000;

      `;
    }

    const { rows } = await db.query(sqlQuery, queryParams);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
