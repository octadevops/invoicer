import React from "react";

const CardComp = ({ title, className = "", children }) => {
  return (
    <div
      className={`flex flex-col items-center mb-4 p-4 border border-cyan-600 rounded-xl ${className}`}
    >
      <div className="text-left font-semibold text-lg pb-4">{title}</div>
      <div className="">{children}</div>
    </div>
  );
};

export default CardComp;
