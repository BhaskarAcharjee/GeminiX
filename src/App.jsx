import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;

      // Get the mobile menu element
      const mobileMenu = document.querySelector(".mobile-menu");

      if (newState) {
        // If sidebar is open, hide the mobile menu
        mobileMenu.style.display = "none";
      } else {
        // If sidebar is closed, show the mobile menu
        if (window.innerWidth <= 600) {
          mobileMenu.style.display = "inline-block";
        }
      }

      return newState;
    });
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Main toggleSidebar={toggleSidebar} />
    </>
  );
};

export default App;
