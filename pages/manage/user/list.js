import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import apiPaths from "../../../services/apiRoutes";
import AuthContext from "../../context/authContext";
import UserAuthForm from "../../components/forms/UserAuthForm";

const ManageUser = () => {
  const { requestServer, userInfo } = useContext(AuthContext);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const callbackModal = (retVal) => {
    closeModal();

    const user = { ...selectedUser };
    user = { ...user, auth_code: retVal.auth_code };
    console.log("user > ", user);
    setSelectedUser(() => user);

    updateUserList(user);
  };

  const updateUserList = (user) => {
    console.log("selectedUser > ", user);
    const prevUserList = [...userList];
    prevUserList.forEach((item) => {
      if (item.email === user.email) {
        item.auth_code = user.auth_code;
      }
    });
    //console.log("userList >> ", userList);
    //console.log("prevUserList >> ", prevUserList);
    setUserList(() => prevUserList);
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "320px",
      height: "auto",
      borderRadius: "10px",
      transform: "translate(-50%, -50%)",
    },
  };

  const getUserList = async () => {
    const url = apiPaths.adminGetUserList;
    const params = {};

    const result = await requestServer(url, params);
    result = result.map((item) => ({ ...item, checked: false }));
    setUserList(() => result);
    console.log("User list >> ", userList);
  };

  const handleItemChange = (email) => {
    //console.log(userList);
    let user = {};
    const updatedList = userList.map((item) => {
      if (item.email === email) {
        if (!item.checked) {
          user = { ...item };
        }
        item.checked = !item.checked;
      } else {
        item.checked = false;
      }
      return item;
    });

    setUserList(updatedList);
    setSelectedUser(user);
  };

  useEffect(() => {
    (async () => {
      await getUserList();
    })();
  }, [userInfo]);

  //권한 선택 모달창 open
  const handleAuthChange = () => {
    if (isSelected()) {
      openModal();
    }
  };

  //권한 선택 모달창 open
  const handleDelete = async () => {
    if (isSelected()) {
      const user = { email: selectedUser.email, delete_yn: "Y" };

      const { result, resultCd } = await requestServer(
        apiPaths.adminChangeUser,
        user
      );

      if (resultCd === "00") {
        alert("삭제되었습니다.");
        setSelectedUser({});
        await getUserList();
      } else {
        alert(result);
      }
    }
  };

  const isSelected = () => {
    //console.log("selectedUser > ", selectedUser);
    if (Object.keys(selectedUser).length == 0) {
      alert("사용자를 선택해 주세요.");
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="py-6">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customModalStyles}
      >
        <UserAuthForm
          selectedUser={selectedUser}
          onCancel={closeModal}
          onComplete={callbackModal}
        />
      </Modal>
      <h3 className="text-base font-semibold leading-7 ">가입된 사용자 목록</h3>
      <p className="text-right">{`${userList.length} 건`}</p>
      <ul className="mt-6 border-y border-gray-200 dark:border-gray-300">
        {userList.length > 0 &&
          userList.map((item, index) => {
            const { name, email, company_code, auth_code, create_dtm } = item;
            return (
              <li
                className="border-b border-gray-100 dark:border-gray-200 flex justify-between gap-x-3 py-5 sm:px-5 hover:bg-gray-100"
                key={index}
                onClick={() => handleItemChange(item.email)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="grid gap-x-5 w-full grid-cols-6 items-center">
                  <p className="col-span-3 sm:col-span-1 text-sm font-semibold leading-6 text-gray-500 dark:text-gray-300">
                    {email}
                  </p>
                  <p className="text-center col-span-2 sm:col-span-3 sm:text-left text-sm font-semibold leading-6 text-gray-500 dark:text-gray-300">
                    {name}
                  </p>
                  <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5 justify-end">
                    <div className="flex justify-end">
                      <p
                        className={
                          "text-sm w-16 text-center h-fit text-white font-bold dark:text-gray-300 px-2 py-1 rounded-full " +
                          (auth_code == "USER"
                            ? "bg-indigo-400 ring-indigo-400"
                            : auth_code == "ADMIN"
                            ? "bg-orange-400 ring-orange-400"
                            : "bg-slate-400 ring-slate-400")
                        }
                      >
                        {auth_code}
                      </p>
                    </div>
                    <p className="hidden sm:block text-right text-sm font-semibold leading-6 text-gray-500 dark:text-gray-300">
                      {create_dtm.substring(0, 10)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="rounded-md w-auto bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          onClick={handleAuthChange}
        >
          권한 수정
        </button>
        <button
          type="button"
          className="rounded-md w-20 bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default ManageUser;
