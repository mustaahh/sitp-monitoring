import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "react-js-loader";
import { userRequest } from "../../requestMethods";
import { AiOutlineSearch } from "react-icons/ai";
import { VscNewFile } from "react-icons/vsc";
import "./data.css";
import { useSelector } from "react-redux";

const Data = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [initialLoading, setInitialLoading] = useState();
  const [keyword, setKeyword] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [activities, setActivities] = useState();

  useEffect(() => {
    const getActvities = async () => {
      setInitialLoading(true);
      try {
        const res = await userRequest.get(`/activities?id=${user._id}`);
        setActivities(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getActvities();
    setInitialLoading(false);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    let res;
    try {
      if (keyword == "") {
        res = await userRequest.get(`activities?id=${user._id}`);
      } else {
        res = await userRequest.get(`activities/search/${keyword}`, {
          params: { userId: user._id },
        });
      }
      setActivities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-12 sm:pr-10 sm:pt-10 pr-5 pt-5">
      <div className="col-span-12 shadow-md ml-8 sm:ml-16  pr-5 pl-6 pb-8 pt-7 bg-white rounded-lg">
        <div className="col-span-12 grid grid-cols-12  sm:mb-7  mb-3">
          <h1 className="header-semua-box sm:text-left text-center sm:col-span-7 col-span-12 mb-3 sm:mb-0">
            Daftar Laporan Kegiatan
          </h1>
          <div className="sm:col-span-5 col-span-12 sm:mx-0 mx-auto sm:ml-auto ml-0 flex justify-center items-center">
            <form
              className="semua-search-input relative  flex flex-row items-center ml-auto  text-[#9A9AB0]"
              onSubmit={(e) => {
                handleSearch(e);
                setSearchMode(true);
              }}
            >
              <input
                className="input-searchbar focus:text-[#333333]  border shadow-md sm:ml-auto ml-0"
                type="text"
                id="search"
                placeholder="Search here..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <AiOutlineSearch className="semua-search-icon" />
            </form>
          </div>
        </div>
        {initialLoading ? (
          <div className="col-span-12 flex justify-center items-center">
            <Loader
              type="spinner-default"
              bgColor={"#0D8BFF"}
              color={"#0D8BFF"}
              size={70}
            />
          </div>
        ) : (
          <div className="table-container col-span-12 grid grid-cols-12 overflow-x-auto">
            <table className="col-span-12 whitespace-nowrap ">
              <thead className="thead">
                <tr>
                  <td>No</td>
                  <td>Nama kegiatan</td>
                  <td>Tanggal Mulai</td>
                  <td>Tanggal Selesai</td>
                  <td>Jenis Kegiatan</td>
                  <td>Lokasi</td>
                  <td>Detail</td>
                </tr>
              </thead>
              <tbody>
                {activities?.length ? (
                  activities.map((a, i) => {
                    return (
                      <tr key={i} className="tbody">
                        <td>{i + 1}</td>
                        <td>{a.judul}</td>
                        <td>{moment(a.mulai).format("D MMM YYYY")}</td>
                        <td>{moment(a.selesai).format("D MMM YYYY")}</td>
                        <td>{a.jenisKegiatan}</td>
                        <td>{a.lokasi}</td>
                        <td>
                          <Link
                            className="table-anchor"
                            to={"/data/detail/" + a._id}
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : searchMode ? (
                  <td colSpan={7}>
                    <h2 className="flex flex-row items-center justify-center text-gray-500">
                      Pencarian Tidak Ditemukan
                    </h2>
                  </td>
                ) : (
                  <tr>
                    <td className="text-base  pt-7" colSpan={7}>
                      <div className="flex flex-row items-center justify-center text-gray-500">
                        <h2 className="flex flex-row items-center">
                          Belum Ada Laporan, Upload Di Icon &nbsp;
                          <VscNewFile className="text-main-blue" />
                        </h2>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Data;
