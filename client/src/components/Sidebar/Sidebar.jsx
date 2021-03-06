import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { logoutAttempt } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

// ICON
import LogoSitp from "../../assets/svg/logo.svg";
import { MdDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { VscNewFile } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { FaUsers } from "react-icons/fa";

// CSS
import "./sidebar.css";

const Sidebar = ({ sidebar, setSidebar }) => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  return (
    <nav
      className={`sidebar  lg:flex flex fixed z-30 top-0 left-0 bottom-0 flex-col overflow-y-auto border-r border-border-main-color px-10 py-7  text-font-sec bg-white  font-Poppins `}
    >
      <img src={LogoSitp} className="mb-12" />
      <div className="mb-9">
        <div className="text-sm mb-2 text-gray-500">Home</div>
        <div
          className={
            location === "/"
              ? `flex  text-main-blue hover:text-main-blue cursor-pointer`
              : `flex  hover:text-main-blue cursor-pointer`
          }
        >
          <div className="text-xl mr-2">
            <MdDashboard />
          </div>
          <Link to="/">
            <div className="text-sm ">Dashboard</div>
          </Link>
        </div>
      </div>

      <div className="mb-9">
        <div className="text-sm mb-3 text-gray-500">Laporan</div>
        <div
          className={
            location === "/data"
              ? `flex text-main-blue hover:text-main-blue cursor-pointer`
              : `flex hover:text-main-blue cursor-pointer`
          }
        >
          <div className="text-xl mr-2">
            <FaTasks />
          </div>
          <Link to="/data">
            <div className="text-sm mb-3">Data</div>
          </Link>
        </div>
        <div
          className={
            location === "/upload"
              ? `flex text-main-blue hover:text-main-blue cursor-pointer`
              : `flex hover:text-main-blue cursor-pointer`
          }
        >
          <div className="text-xl mr-2">
            <VscNewFile />
          </div>
          <Link to="/upload">
            <div className="text-sm ">Upload</div>
          </Link>
        </div>
      </div>
      <div className="mb-9">
        <div className="text-sm text-gray-500 mb-3">Account</div>
        {user?.isAdmin && (
          <div
            className={
              location === "/pegawai"
                ? `flex text-main-blue hover:text-main-blue cursor-pointer`
                : `flex hover:text-main-blue cursor-pointer`
            }
          >
            <div className="text-xl mr-2">
              <FaUsers />
            </div>
            <Link to="/pegawai">
              <div className="text-sm mb-3">Pegawai</div>
            </Link>
          </div>
        )}

        <div
          className={
            location === "/profile"
              ? `flex text-main-blue hover:text-main-blue cursor-pointer`
              : `flex hover:text-main-blue cursor-pointer`
          }
        >
          <div className="text-xl mr-2">
            <CgProfile />
          </div>
          <Link to="/profile">
            <div className="text-sm mb-3">My Profile</div>
          </Link>
        </div>
        <div className="flex order-last text-red-500 cursor-pointer hover:text-red-700">
          <div className="text-xl mr-2">
            <FiLogOut />
          </div>
          <div className="text-sm" onClick={() => dispatch(logoutAttempt())}>
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
