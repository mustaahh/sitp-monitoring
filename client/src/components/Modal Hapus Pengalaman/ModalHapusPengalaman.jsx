import React from "react";
import Loader from "react-js-loader";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";

const ModalHapusPengalaman = ({
  setModal,
  index,
  profile,
  setLoading,
  loading,
}) => {
  const user = useSelector((state) => state.user.currentUser);

  const handleHapusPengalaman = async (index) => {
    setLoading(true);
    try {
      const filteredPengalaman = profile.pengalaman.filter(
        (p, i) => i !== index
      );
      await userRequest.put("users/" + user._id, {
        pengalaman: filteredPengalaman,
      });
      setModal({ hapus: false });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div class="black-bg" id="modal-hapus">
      <div class="modal-hapus-popup">
        <h1 class="header-hapus-popup">Hapus Data</h1>
        <p class="paragraf-hapus-popup">Anda yakin ingin menghapus data ini?</p>

        <div class="popup-buttons hapus-buttons">
          <button
            class="btn-detail buttons-popup bg-white"
            onClick={() => setModal({ hapusPengalaman: false })}
          >
            Batal
          </button>

          <button
            class="btn-detail buttons-popup bg-red"
            onClick={() => handleHapusPengalaman(index)}
          >
            {loading ? (
              <Loader
                type="spinner-default"
                bgColor={"#FFFFFF"}
                color={"#FFFFFF"}
                size={40}
              />
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHapusPengalaman;
