import React from "react";

function Table() {
  const isAdmin = user?.role === "administrator";

  // Handle editing and updating the data
  const handleEdit = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleSave = async (index) => {
    // Implement save logic to update the record in the DB here
    console.log("Saving changes for record:", data[index]);
  };

  return (
    <table className="w-full mt-4 border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="p-2 border border-gray-300">Invoice No</th>
          <th className="p-2 border border-gray-300">Supplier</th>
          <th className="p-2 border border-gray-300">GRN Number</th>
          <th className="p-2 border border-gray-300">Handover Date</th>
          <th className="p-2 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="p-2 border border-gray-300">
              <input
                type="text"
                value={row.invoiceNo}
                onChange={(e) => handleEdit(index, "invoiceNo", e.target.value)}
                disabled={!isAdmin}
              />
            </td>
            <td className="p-2 border border-gray-300">{row.supplier}</td>
            <td className="p-2 border border-gray-300">
              <input
                type="text"
                value={row.grnNumber}
                onChange={(e) => handleEdit(index, "grnNumber", e.target.value)}
                disabled={!isAdmin}
              />
            </td>
            <td className="p-2 border border-gray-300">{row.handoverDate}</td>
            <td className="p-2 border border-gray-300">
              {isAdmin ? (
                <button
                  onClick={() => handleSave(index)}
                  className="text-blue-500"
                >
                  Save
                </button>
              ) : user?.role === "receiver" ? (
                <button className="text-green-500">Received</button>
              ) : (
                <span>View Only</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
