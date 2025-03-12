"use client";

import React from "react";
import PurchaseOrderPDF from "../components/PurchaseOrderPDF";
import POForm from "../components/POForm";

export default function PurchaseOrder() {
  const purchaseOrderData = {
    poNumber: "PO-2025-001",
    email: "augusttechnology1@gmail.com",
    date: "29/01/2025",
    attn: "Procurement Dept",
    company: "August Technologies",
    quotationText:
      "This quotation refers to the purchase of Network Switch for 3rd Floor (Marketing).",
    items: [
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      {
        description:
          "Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time Lead RT 3KVA online UPS with standard backup time  ",
        quantity: 1,
        unitPrice: "2,000.00",
        totalPrice: "2,000.00",
      },
      // Add more items as needed
    ],
    subTotal: "2,000.00",
    total: "2,000.00",
    discount: "200.00",
    VAT: "100.00",
    // TAX: "100.00",
    terms: ["Payment: Cash On Delivery", "Warranty Period: 2 Years"],
    signatureName: "A A A Nafih",
    signatureTitle: "General Manager",
    logo: "/logo.png", // Add logo path
  };

  return (
    <div className="">
      <POForm />
      {/* <h1 className="text-2xl font-bold mb-4">Purchase Order Preview</h1>
      <PurchaseOrderPDF purchaseOrder={purchaseOrderData} /> */}
    </div>
  );
}
