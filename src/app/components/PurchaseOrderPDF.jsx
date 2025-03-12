"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Add this import
import { toast } from "react-toastify";
import { getSupplier } from "@/src/app/services/supplierService";

const PurchaseOrderPDF = React.forwardRef(({ purchaseOrder }, ref) => {
  const [loading, setLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const data = await getSupplier();
        // Find supplier based on supplier name
        const filteredSupplier = data.find(
          (supplier) => supplier.company === purchaseOrder.supplierName
        );
        console.log("Filtered supplier:", filteredSupplier); // Debug log
        setSupplierData(filteredSupplier);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    fetchSupplierData();
  }, [purchaseOrder.supplierName]);

  // Add data validation
  useEffect(() => {
    if (purchaseOrder) {
      console.log("PurchaseOrder data received:", purchaseOrder);
      // Validate required fields
      const requiredFields = [
        "poNumber",
        "supplierName",
        "items",
        "terms",
        "date",
      ];

      const missingFields = requiredFields.filter(
        (field) => !purchaseOrder[field]
      );
      if (missingFields.length > 0) {
        console.warn("Missing required fields:", missingFields);
      }

      // Validate items array
      if (purchaseOrder.items) {
        console.log("Items data:", purchaseOrder.items);
        purchaseOrder.items.forEach((item, index) => {
          if (!item.description || !item.quantity || !item.unitPrice) {
            console.warn(`Item ${index + 1} is missing required properties`);
          }
        });
      }

      // Validate terms object
      if (purchaseOrder.terms) {
        console.log("Terms data:", purchaseOrder.terms);
      }
    }
  }, [purchaseOrder]);

  const generatePDF = React.useCallback(
    (shouldDownload = false) => {
      try {
        setLoading(true);
        const doc = new jsPDF();
        doc.setFont("times", "normal");

        // Add margins for letterhead and footer
        const topMargin = 20; // Increased top margin for letterhead (in mm)
        const bottomMargin = 25; // Space for footer (in mm)
        const pageHeight = doc.internal.pageSize.height;

        // Helper function for text
        const addText = (text, x, y, fontSize = 12, fontWeight = "normal") => {
          if (text) {
            doc.setFontSize(fontSize);
            doc.setFont("times", fontWeight);
            doc.text(text, x, y + topMargin); // Add topMargin to all Y positions
          }
        };

        // Start position adjusted for letterhead
        const startY = 20;
        addText("PURCHASE ORDER", 75, startY, 14, "bold");

        // Info Section with Boxes
        // Email
        doc.rect(14, startY + 10 + topMargin, 180, 7);
        addText("Email", 16, startY + 15, 10);
        doc.rect(36, startY + 10 + topMargin, 158, 7);
        addText(supplierData?.email || "", 40, startY + 15, 10);

        // Format the date to show only YYYY-MM-DD
        const formattedDate = purchaseOrder.date
          ? new Date(purchaseOrder.date).toISOString().split("T")[0]
          : "";

        // Date box with formatted date
        doc.rect(14, startY + 17 + topMargin, 180, 7);
        addText("Date", 16, startY + 22, 10);
        doc.rect(36, startY + 17 + topMargin, 158, 7);
        addText(formattedDate, 40, startY + 22, 10);

        // Attendee (using supplier name)
        doc.rect(14, startY + 24 + topMargin, 180, 7);
        addText("Attn", 16, startY + 29, 10);
        doc.rect(36, startY + 24 + topMargin, 158, 7);
        addText(supplierData?.name || "", 40, startY + 29, 10);

        // Company & Address
        doc.rect(14, startY + 31 + topMargin, 180, 7);
        addText("Company", 16, startY + 36, 10);
        doc.rect(36, startY + 31 + topMargin, 158, 7);
        const companyWithAddress = supplierData
          ? `${supplierData.company} - ${supplierData.address}`
          : "";
        addText(companyWithAddress, 40, startY + 36, 10);

        // PO Number
        doc.rect(130, startY + 17 + topMargin, 26, 7);
        addText("P/O NO :", 132, startY + 22, 10);
        doc.rect(156, startY + 17 + topMargin, 38, 7);
        addText(purchaseOrder.poNumber, 160, startY + 22, 10);

        // Remove description from header boxes and add it between header and table
        const descriptionText = purchaseOrder.description
          ? `This Purchase Order refers to ${purchaseOrder.description}`
          : "";

        // Add description text without borders, after header section
        addText(descriptionText, 14, startY + 45, 10);

        // --- Table ---
        const currency = purchaseOrder.currency || "LKR";
        const tableColumn = [
          // Removed "Item" column
          "Description",
          "Qty",
          `Unit Price (${currency})`,
          `Total Price (${currency})`,
        ];

        // Format the items data correctly from purchaseOrder - without line number
        const tableRows = purchaseOrder.items.map((item) => [
          // Removed index + 1
          item.description || "",
          item.quantity || 0,
          Number(item.unitPrice || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          Number(item.total || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        ]);

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: startY + 55 + topMargin,
          margin: {
            top: topMargin,
            bottom: bottomMargin,
            horizontal: 14,
          },
          columnStyles: {
            0: { cellWidth: 95 }, // Increased width for Description
            1: { halign: "center", cellWidth: 15, valign: "middle" }, // Qty
            2: { halign: "right", cellWidth: 35, valign: "middle" }, // Unit Price
            3: { halign: "right", cellWidth: 35, valign: "middle" }, // Total Price
          },
          styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            fontSize: 10,
            cellPadding: 3,
            overflow: "linebreak", // Handle text overflow with line breaks
          },
          headStyles: {
            fillColor: [255, 255, 255], // set header background color to white
            textColor: [0, 0, 0], // set header text color to black
            fontStyle: "normal", // set header font style to normal
            halign: "center",
          },
        });

        const finalY = doc.autoTable.previous.finalY;

        // Calculate values based on percentages
        const subTotal = purchaseOrder.total || 0;
        const calculationRows = [];

        // Only add discount if percentage or amount exists
        if (purchaseOrder.DiscountPercentage > 0) {
          const discountAmount =
            (subTotal * purchaseOrder.DiscountPercentage) / 100;
          calculationRows.push([
            "",
            "",
            "",
            {
              content: `Discount (${purchaseOrder.DiscountPercentage}%)`,
              styles: { halign: "left" },
            },
            Number(discountAmount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }),
          ]);
        }

        // Only add VAT if percentage exists
        if (purchaseOrder.VATPercentage > 0) {
          const vatAmount = (subTotal * purchaseOrder.VATPercentage) / 100;
          calculationRows.push([
            "",
            "",
            "",
            {
              content: `VAT (${purchaseOrder.VATPercentage}%)`,
              styles: { halign: "left" },
            },
            Number(vatAmount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }),
          ]);
        }

        // Only add TAX if percentage exists
        if (purchaseOrder.TaxPercentage > 0) {
          const taxAmount = (subTotal * purchaseOrder.TaxPercentage) / 100;
          calculationRows.push([
            "",
            "",
            "",
            {
              content: `TAX (${purchaseOrder.TaxPercentage}%)`,
              styles: { halign: "left" },
            },
            Number(taxAmount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }),
          ]);
        }

        // Add subtotal and total
        calculationRows.push(
          [
            "",
            "",
            "",
            { content: "Sub Total", styles: { halign: "left" } },
            Number(subTotal).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }),
          ],
          [
            "",
            "",
            "",
            { content: "TOTAL", styles: { halign: "left", fontStyle: "bold" } },
            Number(purchaseOrder.total).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }),
          ]
        );

        // Add the calculation table with reduced spacing
        doc.autoTable({
          body: calculationRows,
          startY: finalY + 1, // Reduced space after items table
          margin: { horizontal: 14 },
          tableWidth: 196,
          columnStyles: {
            0: { cellWidth: 15 }, // Item
            1: { cellWidth: 80 }, // Description
            2: { cellWidth: 15 }, // Qty
            3: { cellWidth: 35 }, // Label
            4: { cellWidth: 35, halign: "right", valign: "middle" }, // Amount
          },
          styles: {
            fontSize: 10,
            lineColor: [255, 255, 255],
            cellPadding: 2,
          },
          showHead: false,
        });

        // Update the Terms and Conditions section with aligned labels
        const calculationTableFinalY = doc.autoTable.previous.finalY;
        let termsY = calculationTableFinalY + 1;

        // Define terms with proper spacing for alignment
        const termsLabels = {
          payment: "Payment        ",
          warranty: "Warranty       ",
          amc: "AMC            ",
          delivery: "Delivery        ",
          installation: "Installation   ",
          validity: "Validity        ",
        };

        const terms = Object.entries(purchaseOrder.terms || {})
          .filter(([_, value]) => value && value.trim() !== "")
          .map(([key, value]) => ({
            label: termsLabels[key] || key,
            value: value,
          }));

        if (terms.length > 0) {
          addText(
            "Terms and conditions",
            14,
            calculationTableFinalY + 2,
            11,
            "underline"
          );

          termsY = calculationTableFinalY + 6;
          terms.forEach((term) => {
            addText(`${term.label}: ${term.value}`, 14, termsY, 11);
            termsY += 4;
          });
        }

        // Add some padding even if there are no terms (reduced)
        termsY = terms.length > 0 ? termsY : calculationTableFinalY + 3;

        // Ensure footer doesn't overlap with bottom margin
        const availableHeight = pageHeight - bottomMargin;
        if (termsY + 30 > availableHeight) {
          doc.addPage();
          termsY = topMargin;
        }

        // --- Footer with specific formatting ---
        addText("Thank you", 14, termsY + 25, 11);
        addText("Yours Truly,", 14, termsY + 30, 11);

        // Add line for signature
        // doc.line(14, termsY + 35, 50, termsY + 35);

        // Add signature name and title with underscore prefix
        addText("_________________", 14, termsY + 40, 11);
        addText(purchaseOrder.signatureName, 14, termsY + 45, 11);
        addText(purchaseOrder.signatureTitle, 14, termsY + 50, 11);

        if (shouldDownload) {
          doc.save(`PurchaseOrder_${purchaseOrder.poNumber}.pdf`);
        } else {
          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfPreview(pdfUrl);
        }
      } catch (error) {
        console.error("PDF generation error:", error);
        console.error("Description data:", {
          description: purchaseOrder.description,
          error: error.message,
        });
        toast.error("Failed to generate PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [purchaseOrder, supplierData]
  );

  React.useImperativeHandle(ref, () => ({
    generatePDF,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          onClick={() => generatePDF(false)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Preview PDF"}
        </button>
        {pdfPreview && (
          <button
            onClick={() => generatePDF(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        )}
      </div>

      {/* PDF Preview */}
      {pdfPreview && (
        <div className="w-full h-[800px] border-2 border-gray-300 rounded-lg">
          <iframe
            src={pdfPreview}
            className="w-full h-full"
            title="PDF Preview"
          />
        </div>
      )}
    </div>
  );
});

PurchaseOrderPDF.displayName = "PurchaseOrderPDF";

export default PurchaseOrderPDF;
