import React, { useEffect, useState } from "react";
import "./User.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../redux/actions/authActions";
import toast from "react-hot-toast";
import { getImageSrc } from "../../utils/getImageSrc";
import { reset } from "../../redux/slice/authSlice";

const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const EditUserProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const { user, success, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setPhone(user?.phone || "");
      setGender(user?.gender || "");
      setDob(user?.dob || "");
      setAddress(user?.address || "");
      setImage(user?.image || "");
      setRemoveImage(false);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setRemoveImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setImage("");
    setRemoveImage(true);
  };

  const handleUpdate = (id) => {
    const formData = new FormData();
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }
    formData.append("removeImage", removeImage ? "true" : "false");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("gender", gender);
    formData.append("dob", dob);
    dispatch(reset());
    dispatch(updateUserData({ id, formData }));
  };

  useEffect(() => {
    if (success) {
      toast.success("User Updated!");
      dispatch(reset());
      onClose();
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, success, error, onClose]);

  const renderUserImage = () => {
    if (removeImage) {
      return DEFAULT_AVATAR;
    }
    if (image && typeof image !== "string") {
      return URL.createObjectURL(image);
    }
    return getImageSrc(user?.image, DEFAULT_AVATAR);
  };

  const hasPhoto =
    !removeImage &&
    ((image && typeof image !== "string") || Boolean(user?.image));

  if (!isOpen) return null;
  return (
    <>
      <div className="editModal modal d-block" tabIndex={-1}>
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "450px" }}
        >
          <div className="modal-content">
            <div className="modal-header py-2">
              <h6 className="modal-title fw-bold">Edit Your Profile</h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body py-3">
              <div className="mod-details d-flex flex-column gap-2">
                <div className="text-center mb-1 d-flex flex-column align-items-center gap-2">
                  <img
                    src={renderUserImage()}
                    alt="userPic"
                    height={100}
                    width={100}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ccc",
                    }}
                  />
                  {hasPhoto && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      style={{ fontSize: "12px" }}
                      onClick={handleRemovePhoto}
                    >
                      <i className="fa-solid fa-trash-can me-1"></i>
                      Remove Photo
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <input
                    type="date"
                    className="form-control form-control-sm"
                    placeholder="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer py-1">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdate(user?._id)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserProfile;