import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-48 bg-soGray p-4 border-r border-soGray">
      <ul className="space-y-2">
        <li>
          <Link to="/" className="text-soBlue hover:underline text-sm">Home</Link>
        </li>
        <li>
          <Link to="/" className="text-soBlue hover:underline text-sm">Questions</Link>
        </li>
        <li>
          <Link to="/tags" className="text-soBlue hover:underline text-sm">Tags</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;