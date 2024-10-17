import db from "../../../lib/db";
import { NextResponse } from "next/server";

// /api/inventory/addiclasssemesteritems

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body", body);
    const { class_id, semester_id, user_id, inventory_items } = body;

    if (
      !class_id ||
      !semester_id ||
      !inventory_items ||
      inventory_items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or no inventory items" },
        { status: 400 }
      );
    }

    try {
      await db.query("BEGIN");

      for (const inventory of inventory_items) {
        const { item_id, quantity_per_student, unit_price, total_price } =
          inventory;

        if (!item_id || !quantity_per_student || !unit_price) {
          await db.query("ROLLBACK");
          return NextResponse.json(
            { error: "Missing required fields in Class item" },
            { status: 401 }
          );
        }

        const upsertQuery = `
          INSERT INTO class_items (class_id, item_id, semester_id, quantity_per_student, supplied_by)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (class_id, item_id, semester_id)
          DO UPDATE SET
            quantity_per_student = EXCLUDED.quantity_per_student,
            supplied_by = EXCLUDED.supplied_by
          RETURNING class_item_id;
        `;

        const upsertResult = await db.query(upsertQuery, [
          class_id,
          item_id,
          semester_id,
          quantity_per_student,
          user_id,
        ]);
        const class_item_id = upsertResult.rows[0].class_item_id;

        console.log(`Upserted class_item_id: ${class_item_id}`);
      }

      await db.query("COMMIT");

      return NextResponse.json(
        { message: "Class items added or updated successfully" },
        { status: 201 }
      );
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error in Class item addition/update:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
