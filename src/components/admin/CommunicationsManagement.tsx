
import React from "react";

const CommunicationsManagement = () => {
  return (
    <div className="space-y-6 text-[#C9A95B]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-din uppercase tracking-wide">Communications Management</h2>
      </div>
      
      <div className="w-full h-[533px] rounded-md border border-[#C9A95B]/30 overflow-hidden">
        <iframe 
          className="airtable-embed" 
          src="https://airtable.com/embed/appOYgfdA248ogUOF/shr6q2uoqhYcKwA7u?viewControls=on" 
          frameBorder="0" 
          width="100%" 
          height="100%" 
          style={{ background: "transparent", border: "1px solid #ccc" }}
          title="Communications Airtable View"
        />
      </div>
    </div>
  );
};

export default CommunicationsManagement;
