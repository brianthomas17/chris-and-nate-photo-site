
import React from "react";

const MessagesSent = () => {
  return (
    <div className="space-y-6 text-[#C9A95B]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-din uppercase tracking-wide">Messages Sent</h2>
      </div>
      
      <div className="w-full h-[533px] rounded-md border border-[#C9A95B]/30 overflow-hidden">
        <iframe 
          className="airtable-embed" 
          src="https://airtable.com/embed/appOYgfdA248ogUOF/shrUOfiljewN8xpTs?viewControls=on" 
          frameBorder="0" 
          width="100%" 
          height="100%" 
          style={{ background: "transparent", border: "1px solid #ccc" }}
          title="Messages Sent Airtable View"
        />
      </div>
    </div>
  );
};

export default MessagesSent;
