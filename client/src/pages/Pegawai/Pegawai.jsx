import React, { useEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { userRequest } from "../../requestMethods";
import { CgProfile } from "react-icons/cg";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineSearch } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";

import "./pegawai.css";
import { useSelector } from "react-redux";
import AddPegawai from "../../components/Modal Pegawai/AddPegawai";
import EditPegawai from "../../components/Modal Pegawai/EditPegawai";
import { Link } from "react-router-dom";

const Pegawai = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [modal, setModal] = useState({
    tambah: false,
    ubah: { show: false, id: undefined },
  });
  const [hapus, setHapus] = useState(false);
  const [keyword, setKeyword] = useState();
  const [allPegawai, setAllPegawai] = useState();

  useEffect(() => {
    const getAllPegawai = async () => {
      try {
        const res = await userRequest.get("/users");
        const filteredPegawai = res.data.filter((d) => d._id !== user._id);
        setAllPegawai(filteredPegawai);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPegawai();
  }, [user._id, modal, hapus]);

  const handlePegawaiSearch = (e) => {
    e.preventDefault();
    const getAllPegawai = async () => {
      let res;
      try {
        if (keyword === "") {
          res = await userRequest.get("/users");
          const filteredPegawai = res.data.filter((d) => d._id !== user._id);
          setAllPegawai(filteredPegawai);
          return;
        }
        res = await userRequest.get("users/search/" + keyword);
        setAllPegawai(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPegawai();
  };

  const handleHapusPegawai = async (pegawai) => {
    setHapus(true);
    try {
      await userRequest.delete("users/" + pegawai._id);
      setHapus(false);
    } catch (error) {
      console.log(error.response.data.message);
      setHapus(false);
    }
  };

  useEffect(() => {
    if (modal.tambah || modal.ubah) {
      disableBodyScroll(document);
    } else {
      enableBodyScroll(document);
    }
  }, [modal]);

  return (
    <div className="grid grid-cols-12 font-Lato col-span-12 pt-5">
      <div className="col-span-12 grid grid-cols-12 pr-8 ml-10">
        <div className="col-span-12 bg-white grid grid-cols-12 pl-10 pr-10 py-10 shadow-md whitespace-nowrap">
          <div className="mb-10 flex flex-row col-span-12">
            <h1 className="text-2xl font-medium font-Mulish col-span-8 ">
              Data Pegawai
            </h1>
            <div className="ml-auto grid grid-cols-12 items-center">
              <div
                className="col-span-1 w-7 h-7 rounded-full bg-main-blue hover:bg-blue-500 cursor-pointer flex items-center justify-center text-white"
                onClick={() => setModal({ tambah: true })}
              >
                <AiOutlineUserAdd className="text-lg" />
              </div>

              <form
                className="relative text-[#9A9AB0] col-span-11"
                onSubmit={handlePegawaiSearch}
              >
                <input
                  className=" focus:text-[#333333] bg-white-sec w-full ml-3 pl-10 h-9 rounded-md outline-none border shadow-md"
                  type="text"
                  id="search"
                  placeholder="Search here..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <AiOutlineSearch className="absolute inset-x-6 top-3" />
              </form>
            </div>
          </div>
          <div className="col-span-12 grid grid-cols-12 overflow-x-auto">
            <table className="table-pegawai col-span-12 items-center font-Lato border-separate">
              <tbody className="">
                {allPegawai?.length ? (
                  allPegawai.map((p, i) => {
                    return (
                      <tr
                        className="pegawai-tr bg-white  shadow-lg col-span-12"
                        key={i}
                      >
                        <td>
                          {p.profilePic?.length ? (
                            <img
                              src={p.profilePic[0].url}
                              className="w-10 h-10 object-cover rounded-full ml-3"
                            />
                          ) : (
                            <CgProfile className="w-10 h-10 ml-3" />
                          )}
                        </td>
                        <td className="font-bold">{p.nama}</td>
                        <td>{p.jabatan}</td>
                        <td>{p.nip}</td>
                        <td>{p.isAdmin ? "Admin" : "User"}</td>
                        <td>
                          <div className="flex flex-row items-center gap-5">
                            <MdEdit
                              className="text-struktur cursor-pointer hover:text-black"
                              onClick={() => {
                                setModal({ ubah: { show: true, id: p._id } });
                              }}
                            />
                            <RiDeleteBin6Line
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => handleHapusPegawai(p)}
                            />
                          </div>
                        </td>
                        <td>
                          <Link to={"/pegawai/detail/" + p._id}>
                            <BsChevronRight className="text-main-blue cursor-pointer hover:text-blue-500" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="col-span-12 text-center text-gray-500">
                    User Tidak Ditemukan
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modal.tambah && <AddPegawai setModal={setModal} />}
      {modal.ubah?.show && (
        <EditPegawai setModal={setModal} id={modal.ubah.id} />
      )}
    </div>
  );
};

export default Pegawai;
