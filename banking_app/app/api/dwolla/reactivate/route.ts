// app/api/dwolla/reactivate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { reactivateCustomer } from "@/lib/actions/dwolla.action";

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();
    if (!customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    const result = await reactivateCustomer(customerId);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Error reactivating customer:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
