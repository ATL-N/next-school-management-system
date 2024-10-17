"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaBookOpen,
  FaCalendarAlt,
  FaCog,
  FaChevronRight,
  FaUserCheck,
  FaCalendarCheck,
  FaUniversity,
  FaMoneyBillWave,
  FaEnvelope,
  FaUsers,
  FaClock,
  FaBell,
  FaBoxes,
  FaMoneyCheckAlt,
  FaBars,
} from "react-icons/fa";

const SidePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [lastExpandedItem, setLastExpandedItem] = useState(null);
  const pathname = usePathname();

  // Your menuItems array remains the same
   const menuItems = [
    {
      icon: <FaTachometerAlt />,
      text: "Dashboard",
      href: "/",
    },
    {
      icon: <FaCalendarCheck />,
      text: "Attendance",
      href: "/pages/attendance",
    },
    {
      icon: <FaBook />,
      text: "Classes",
      href: "/pages/classes",
    },

    // {
    //   icon: <FaUniversity />,
    //   text: "Department",
    //   href: "/pages/department/",
    //   // subItems: [
    //   //   { text: "Department Details", href: "/pages/department/details" },
    //   // ],
    // },
    {
      icon: <FaCalendarAlt />,
      text: "Events",
      href: "/pages/events",
    },
    {
      icon: <FaMoneyCheckAlt />,
      text: "Fees",
      href: "/pages/fees",
    },
    {
      icon: <FaMoneyBillWave />,
      text: "Finance",
      href: "/pages/financial",
      // subItems: [
      //   { text: "Finance Details", href: "/pages/financial/details" },
      //   { text: "Finance Details 2", href: "/pages/financial/details2" },
      //   { text: "Finance Dashboard", href: "/pages/financial/dashboard" },
      //   { text: "Fee Structure", href: "/pages/financial/feesstructure" },
      //   { text: "Payment History", href: "/pages/financial/history" },
      //   { text: "Payment Reports", href: "/pages/financial/reports" },
      //   { text: "Generate Invoice", href: "/pages/financial/invoice" },
      // ],
    },
    {
      icon: <FaBookOpen />,
      text: "Exams and Remarks",
      href: "/pages/grading",
      // subItems: [
      //   { text: "Examination", href: "/pages/grading" },
      //   // { text: "Edit Grades", href: "/pages/grading/edit" },
      //   // { text: "Grade Book", href: "/pages/grading/gradebook" },
      //   // { text: "Generate Report Cards", href: "/pages/grading/reportcard" },
      //   // { text: "Grade Analytics", href: "/pages/grading" },
      //   // { text: "Grade Analytics", href: "/pages/grading/analytics" },
      //   // { text: "Remarks", href: "/pages/studentremarks/details" },
      // ],
    },
    {
      icon: <FaBoxes />,
      text: "Inventory",
      href: "/pages/inventory",
      subItems: [
        { text: "Items Management", href: "/pages/inventory/items" },
        { text: "Stock Management", href: "/pages/inventory/stock" },
        { text: "Supply Management", href: "/pages/inventory/supply" },
      ],
    },
    {
      icon: <FaEnvelope />,
      text: "Messaging",
      href: "/pages/messaging",
      subItems: [
        { text: "Messaging Hub", href: "/pages/messaging" },
        { text: "Inbox", href: "/pages/messaging/inbox" },
        { text: "Compose", href: "/pages/messaging/compose" },
        { text: "View Message", href: "/pages/messaging/view" },
        { text: "Broadcast", href: "/pages/messaging/broadcast" },
        { text: "Email Templates", href: "/pages/messaging/templates" },
      ],
    },
    {
      icon: <FaBell />,
      text: "Notifications",
      href: "/pages/notification",
    },
    {
      icon: <FaCalendarAlt />,
      text: "Reports",
      href: "/pages/reports/details",
      // subItems: [
      //   { text: "Report Details", href: "/pages/reports/details" },
      //   { text: "Create Schedule", href: "/reports/create" },
      // ],
    },
    {
      icon: <FaCalendarAlt />,
      text: "Semester",
      href: "/pages/semester",
    },
    {
      icon: <FaCog />,
      text: "Settings",
      href: "/pages/settings/settingshub",
      // subItems: [{ text: "Settings", href: "/pages/settings/settingshub" }],
    },

    {
      icon: <FaBook />,
      text: "Subjects",
      href: "/pages/subjects",
    },
    {
      icon: <FaUserGraduate />,
      text: "Students",
      href: "/pages/students",
    },

    {
      icon: <FaChalkboardTeacher />,
      text: "Staff",
      href: "/pages/staff",
    },

    {
      icon: <FaClock />,
      text: "Timetable",
      href: "/pages/timetable",
    },
    {
      icon: <FaUsers />,
      text: "User Management",
      href: "/pages/users",
      
    },
  ].sort((a, b) => a.text.localeCompare(b.text));
  useEffect(() => {
    if (isExpanded && lastExpandedItem !== null) {
      setExpandedItem(lastExpandedItem);
    } else if (!isExpanded) {
      setExpandedItem(null);
    }
  }, [isExpanded, lastExpandedItem]);

  const toggleSubItems = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
      setLastExpandedItem(null);
    } else {
      setExpandedItem(index);
      setLastExpandedItem(index);
    }
  };

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <motion.nav
      initial={{ width: "4rem" }}
      animate={{ width: isExpanded ? "16rem" : "4rem" }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full bg-gray-900 text-gray-100 shadow-lg z-50 overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 h-full overflow-y-auto scrollbar-hide">
        <div className="flex items-center mb-6">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isExpanded ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl cursor-pointer"
          >
            <FaBars />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold ml-2 overflow-hidden whitespace-nowrap"
          >
            School System
          </motion.h2>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems && item.subItems.length > 0 ? (
                <div>
                  <button
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => toggleSubItems(index)}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{item.icon}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.text}
                      </motion.span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedItem === index ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronRight />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && expandedItem === index && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-1"
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className={`block p-2 rounded-lg transition-colors duration-200 ${
                                isActive(subItem.href)
                                  ? "bg-blue-600 text-white pointer-events-none"
                                  : "hover:bg-gray-800"
                              }`}
                            >
                              {subItem.text}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block ${
                    isActive(item.href) ? "pointer-events-none" : ""
                  }`}
                >
                  <div
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.text}
                    </motion.span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default SidePanel;
