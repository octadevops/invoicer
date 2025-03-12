"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getPurchaseOrders,
  updatePOStatus,
  getPODetails,
  getPOForPDF,
} from "../services/poService";
import PurchaseOrderPDF from "../components/PurchaseOrderPDF";
import PinModal from "../components/PinModal";
import { HiChevronDown, HiChevronRight } from "react-icons/hi2";

const POApprovals = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const pdfRef = React.useRef();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const data = await getPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      toast.error("Error fetching purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (po) => {
    setSelectedPO(po);
    setShowPinModal(true);
  };

  const handlePinSubmit = async (pin) => {
    try {
      if (!selectedPO) {
        toast.error("No PO selected");
        return;
      }

      const response = await updatePOStatus(selectedPO.id, pin);
      if (response.success) {
        toast.success("Purchase order approved successfully");
        // After successful approval, show the PDF modal
        setShowPDF(true);
        await fetchPurchaseOrders(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to approve PO");
      }
    } catch (error) {
      toast.error("Error approving purchase order");
    } finally {
      setShowPinModal(false);
      // Don't reset selectedPO here since we need it for the PDF
    }
  };

  const handlePrint = async (po) => {
    try {
      setLoading(true);
      toast.info("Preparing PDF...");

      console.log("Original PO data:", po); // Debug log

      const pdfData = await getPOForPDF(po.id);
      console.log("PDF data fetched:", pdfData); // Debug log

      const poDetails = await getPODetails(po.id);
      console.log("PO details fetched:", poDetails); // Debug log

      if (!pdfData || !poDetails) {
        throw new Error("Failed to fetch PO data");
      }

      // Prepare data for PDF
      const pdfDataFormatted = {
        ...pdfData,
        id: po.id,
        items: poDetails,
        // Include supplier info
        supplierName: po.supplierName,
        date: po.date,
        // Terms data
        terms: {
          payment: po.terms?.payment || "",
          warranty: po.terms?.warranty || "",
          amc: po.terms?.amc || "",
          delivery: po.terms?.delivery || "",
          installation: po.terms?.installation || "",
          validity: po.terms?.validity || "",
        },
        // Calculations
        DiscountPercentage: po.DiscountPercentage || 0,
        DiscountAmount: po.DiscountAmount || 0,
        VATPercentage: po.VATPercentage || 0,
        VATAmount: po.VATAmount || 0,
        TaxPercentage: po.TaxPercentage || 0,
        TaxAmount: po.TaxAmount || 0,
        total: po.total || 0,
      };

      console.log("Formatted PDF data:", pdfDataFormatted); // Debug log

      setSelectedPO(pdfDataFormatted);
      setShowPDF(true);
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Error preparing PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintConfirm = async () => {
    try {
      if (!selectedPO?.id || !pdfRef.current) {
        toast.error("PDF preparation failed");
        return;
      }

      const success = await pdfRef.current.generatePDF(true);
      if (success) {
        const response = await updatePOStatus(selectedPO.id, null, true);
        if (response.success) {
          toast.success("Document printed successfully");
          await fetchPurchaseOrders();
        } else {
          throw new Error(response.message || "Failed to update print status");
        }
      }
    } catch (error) {
      console.error("Print confirm error:", error);
      toast.error(error.message || "Error during print process");
    } finally {
      setShowPDF(false);
      setSelectedPO(null);
    }
  };

  const toggleRowExpansion = async (poId) => {
    if (expandedRow === poId) {
      setExpandedRow(null);
      return;
    }

    setExpandedRow(poId);
    try {
      if (!expandedDetails[poId]) {
        const details = await getPODetails(poId);
        // Ensure details is an array
        const detailsArray = Array.isArray(details) ? details : [];
        setExpandedDetails((prev) => ({
          ...prev,
          [poId]: detailsArray,
        }));
      }
    } catch (error) {
      console.error("Error fetching PO details:", error);
      toast.error("Error fetching PO details");
      setExpandedDetails((prev) => ({
        ...prev,
        [poId]: [],
      }));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Purchase Order Approvals</h2>

      {purchaseOrders.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-600 text-white text-sm uppercase font-medium">
                <th className="px-4 py-2 border border-gray-300"></th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  PO Number
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Supplier
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Date
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Department
                </th>
                <th className="px-4 py-2 border border-gray-300 text-right">
                  Amount
                </th>
                <th className="px-4 py-2 border border-gray-300 text-right">
                  Description
                </th>
                <th className="px-4 py-2 border border-gray-300 text-right">
                  Attendee
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  Status
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  Payment Terms
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  Delivery
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  Warranty
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  AMC
                </th>
                <th className="px-4 py-2 border border-gray-300 text-center">
                  Installation
                </th>

                <th className="px-4 py-2 border border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <React.Fragment key={po.id}>
                  <tr className="bg-slate-100 hover:bg-gray-200">
                    <td className="px-4 py-2 border border-gray-300">
                      <button
                        onClick={() => toggleRowExpansion(po.id)}
                        className="p-1 hover:bg-gray-300 rounded"
                      >
                        {expandedRow === po.id ? (
                          <HiChevronDown className="w-5 h-5" />
                        ) : (
                          <HiChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.supplierName}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(po.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.department}
                    </td>

                    <td className="px-4 py-2 border border-gray-300 text-right">
                      {Number(po.total).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.description}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.attendee}
                    </td>

                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          po.isApproved
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {po.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.terms?.payment}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.terms?.delivery}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.terms?.warranty}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.terms?.amc}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {po.terms?.installation}
                    </td>

                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!po.isApproved && (
                          <button
                            onClick={() => handleApprove(po)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                          >
                            Approve
                          </button>
                        )}
                        {po.isApproved && (
                          <button
                            onClick={() => handlePrint(po)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                          >
                            Print
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === po.id && (
                    <tr>
                      <td
                        colSpan="16"
                        className="px-4 py-2 border border-gray-300"
                      >
                        <div className="p-4 bg-white">
                          <div className="mb-6">
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="px-4 py-2 border text-left">
                                      Description
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Quantity
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Unit Price
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Total
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Payment Terms
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Warranty
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      AMC Terms
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Installation
                                    </th>
                                    <th className="px-4 py-2 border text-right">
                                      Delivery
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {expandedDetails[po.id] &&
                                    Array.isArray(expandedDetails[po.id]) &&
                                    expandedDetails[po.id].map((detail) => (
                                      <tr
                                        key={detail.lineId}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-2 border">
                                          {detail.description}
                                        </td>
                                        <td className="px-4 py-2 border text-right">
                                          {detail.quantity}
                                        </td>
                                        <td className="px-4 py-2 border text-right">
                                          {Number(
                                            detail.unitPrice
                                          ).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </td>
                                        <td className="px-4 py-2 border text-right">
                                          {Number(detail.total).toLocaleString(
                                            "en-US",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </td>
                                        <td className="px-4 py-2 border text-left">
                                          {detail.paymentTerms}
                                        </td>
                                        <td className="px-4 py-2 border text-left">
                                          {detail.warranty}
                                        </td>
                                        <td className="px-4 py-2 border text-left">
                                          {detail.amcTerms}
                                        </td>
                                        <td className="px-4 py-2 border text-left">
                                          {detail.installation}
                                        </td>
                                        <td className="px-4 py-2 border text-left">
                                          {detail.deliveryTerms}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No purchase orders found.</p>
      )}

      {showPinModal && (
        <PinModal
          onClose={() => {
            setShowPinModal(false);
            setSelectedPO(null);
          }}
          onSubmit={handlePinSubmit}
        />
      )}

      {showPDF && selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Purchase Order Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintConfirm}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Print & Save"}
                </button>
                <button
                  onClick={() => {
                    setShowPDF(false);
                    setSelectedPO(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
            <PurchaseOrderPDF ref={pdfRef} purchaseOrder={selectedPO} />
          </div>
        </div>
      )}
    </div>
  );
};

export default POApprovals;
