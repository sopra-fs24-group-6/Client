import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";
import NavBar from "../ui/NavBar";
import languages from "helpers/languages.json";
import { getDomain } from "helpers/getDomain";
import background2 from "../../assets/Backgrounds/bg2.jpeg";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);

  const usernameInputRef = useRef(null);
  const birthDateInputRef = useRef(null);
  const nameInputRef = useRef(null);
  // Initialize timestamp only once
  const [timestamp] = useState(new Date().getTime());

  const updateFriendRequests = async () => {
    const friendRequestsResponse = await api.get(
      `/friends/friendRequests?userId=${userId}`
    );

    if (!friendRequestsResponse.data.length) return;

    const usersRequests = friendRequestsResponse.data.map((friendRequest) =>
      api.get(`/users/${friendRequest.senderUserId}`)
    );

    // TODO: if needed, `any` has to be replaced with correct type definition
    const users: any = (await Promise.all(usersRequests)).map(
      (res: any) => res.data
    );

    const updatedFriendRequest = friendRequestsResponse.data.map(
      (friendRequest: any) => {
        return {
          ...friendRequest,
          username:
            users?.find((users: any) => users.id === friendRequest.senderUserId)
              ?.username || "unknown",
        };
      }
    );

    setFriendRequests(updatedFriendRequest);
  };

  const updateFriendList = async () => {
    const friendRequestsResponse = await api.get(`/friends?userId=${userId}`);

    if (!friendRequestsResponse.data.length) return;

    const usersRequests = friendRequestsResponse.data.map((friendRequest) => {
      const requestId =
        friendRequest.senderUserId === Number(userId)
          ? friendRequest.receiverUserId
          : friendRequest.senderUserId;

      return api.get(`/users/${requestId}`);
    });

    // TODO: if needed, `any` has to be replaced with correct type definition
    const users: any = (await Promise.all(usersRequests)).map(
      (res: any) => res.data
    );

    const updatedFriends = friendRequestsResponse.data.map(
      (friendRequest: any) => {
        const friendId =
          friendRequest.senderUserId === Number(userId)
            ? friendRequest.receiverUserId
            : friendRequest.senderUserId;

        return {
          ...friendRequest,
          username:
            users?.find((users: any) => users.id === friendId)?.username ||
            "unknown",
        };
      }
    );

    setFriends(updatedFriends);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${userId}`);
        console.log(response.data);
        setUser(response.data);
        const avatarSrc =
          getDomain() + "/" + response.data.avatarUrl + `?v=${timestamp}`;
        console.log(avatarSrc);
        setAvatar(avatarSrc);
        setIsLoggedInUser(
          localStorage.getItem("userId") === String(response.data.id)
        );

        /* const friendListResponse = await api.get(`/users/${userId}/friends`);
        setFriends(friendListResponse.data);

        const friendRequestsResponse = await api.get(
          `/users/${userId}/friendRequests`
        );
        setFriendRequests(friendRequestsResponse.data); */

        await updateFriendRequests();
        await updateFriendList();

        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch user details: ${handleError(error)}`);
        navigate("/users");
        setIsLoading(false);
      }
    };

    fetchUserDetails();
    // fetchAvatar();
  }, [userId, navigate, avatar]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
      setFilteredUsers(response.data.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Failed to fetch users:", handleError(error));
    }
  };

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);

    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (isUserListOpen) {
      fetchUsers();
    }
  }, [isUserListOpen]);

  const sendFriendRequest = async (receiverUserId) => {
    try {
      const requestBody = {
        senderUserId: user.id,
        receiverUserId,
      };
      await api.post("/friends/friendRequests", requestBody);
      setFriendRequestsSent([...friendRequestsSent, receiverUserId]);
    } catch (error) {
      console.error("Failed to send friend request:", handleError(error));
    }
  };

  const acceptFriendRequest = async (requester) => {
    try {
      await api.put(`/friends/friendRequests/${requester}`);

      // await api.post(`/friends/${requester.id}/friends`, requestBody2);

      await updateFriendRequests();
      await updateFriendList();
    } catch (error) {
      console.error("Failed to accept friend request:", handleError(error));
    }
  };

  const denyFriendRequest = async (requester) => {
    try {
      await api.delete(`/friends/friendRequests/${requester}`);
    } catch (error) {
      console.error("Failed to deny friend request:", handleError(error));
    }
  };

  const formatCreationDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", options);
  };

  const formatBirthdate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", options);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Prepare the form data
      const formData = new FormData();
      formData.append("avatar", file);

      // Send the new avatar to the server (via WebSocket or an API)
      try {
        const response = await api.post(`/${userId}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update the local avatar display
        setAvatar(
          getDomain() + "/" + response.data.avatarUrl + `?v=${timestamp}`
        );
      } catch (error) {
        console.error("Failed to upload avatar:", handleError(error));
      }
    }
  };

  const updateUserData = async () => {
    const newUsername = usernameInputRef?.current?.value;
    const newName = nameInputRef?.current?.value;
    const newBirthDate = birthDateInputRef?.current?.value;
    // const newLanguage = languageInputRef?.current?.value;
    const newLanguage = selectedLanguage;

    console.log(newLanguage);

    try {
      await api.put(`/users/${userId}`, {
        username: newUsername,
        name: newName,
        birthDate: new Date(newBirthDate),
        language: newLanguage,
      });

      navigate(0);
    } catch (error) {
      alert(
        `Something went wrong during updating user: \n${handleError(error)}`
      );
    }
  };

  if (isLoading || !user) {
    return <Spinner />;
  }

  return (
    <>
      <div
        className="background"
        style={{ backgroundImage: `url(${background2})` }}
      >
        <NavBar />
        <div className="Extension Flex">
          <NESContainerW title="" className="left style" scrollable={true}>
            <NESContainerW title="User Information">
              <div
                style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Avatar */}
                <img
                  src={avatar}
                  alt="User Avatar"
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
                {isHovered &&
                  localStorage.getItem("userId") === userId &&
                  (
                  <div
                    className="nes-badge"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "45%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "green",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="is-primary"
                      onClick={() =>
                        document.getElementById("fileInput").click()}>
                      +
                    </span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <span className="info-title">Status:</span>
                <p className="info-text">
                  <span style={{ marginRight: 8 }}>
                    {`${user.status === "OFFLINE" ? "🔴" : "🟢"} ${user.status}`}
                  </span>
                </p>
              </div>
              <div>
                <span className="info-title">Username:</span>
                {isEditable ? (
                  <div className="editable-input">
                    <input
                      ref={usernameInputRef}
                      type="text"
                      defaultValue={user.username}
                    ></input>
                  </div>
                ) : (
                  <p className="info-text">{user.username}</p>
                )}
              </div>
              <div>
                <span className="info-title">Birth Date:</span>
                {isEditable ? (
                  <div className="editable-input">
                    <input
                      ref={birthDateInputRef}
                      type="date"
                      defaultValue={
                        new Date(user.birthDate)?.toISOString()?.slice(0, 10) ||
                        ""
                      }
                    ></input>
                  </div>
                ) : (
                  <p className="info-text">
                    {formatBirthdate(user.birthDate) || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <span className="info-title">Language:</span>
                {isEditable ? (
                  <div className="editable-input">
                    <select
                      defaultValue={`${user.language}`}
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="info-text">
                    {languages.find((lang) => lang.code === user.language)
                      ?.name || "Unknown Language"}
                  </p>
                )}
              </div>
              <div>
                <span className="info-title">Creation Date:</span>
                <p className="info-text">
                  {formatCreationDate(user.creationDate)}
                </p>
              </div>
              <div className="user-details button-container">
                {isLoggedInUser && !isEditable && (
                  <CustomButton
                    text="Edit"
                    className="hover-orange"
                    onClick={() => setIsEditable(true)}
                  />
                )}
                {isLoggedInUser && isEditable && (
                  <React.Fragment>
                    <CustomButton
                      text="Cancel"
                      className="hover-red"
                      onClick={() => setIsEditable(false)}
                    />
                    <CustomButton
                      text="Save"
                      className="hover-green"
                      onClick={updateUserData}
                    />
                  </React.Fragment>
                )}
              </div>
            </NESContainerW>
          </NESContainerW>
          <NESContainerW title="" className="right style" scrollable={true}>
            <NESContainerW title="Friends">
              <ul className="list-style">
                {friends.map((player, index) => (
                  <li className="Aligner" key={index}>
                    <span style={{ marginRight: 8 }}>
                      {`${user.status === "OFFLINE" ? "🔴" : "🟢"}`}
                    </span>
                    <a
                      href={`/users/${player.id}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {player.username}
                    </a>
                  </li>
                ))}
              </ul>
              {isLoggedInUser && (
                <CustomButton
                  text="Add Friends"
                  className="small-kick margin-kick hover-red"
                  onClick={() => setIsUserListOpen(!isUserListOpen)}
                />
              )}
              {isUserListOpen && (
                <div className="modal-background">
                  <div className="modal-content">
                    <CustomButton
                      text="Close"
                      className="medium-kick margin-kick hover-red"
                      onClick={() => setIsUserListOpen(!isUserListOpen)}
                    ></CustomButton>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      placeholder="Search by name..."
                    />
                    <div
                      className="user-list-container"
                      style={{
                        maxHeight: "100px",
                        overflowY: "auto",
                      }}
                    >
                      <ul
                        className="user-list"
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredUsers.map((user) => (
                          <li key={user.id}>
                            <a
                              href={`/users/${user.id}`}
                              style={{ color: "black", textDecoration: "none" }}
                            >
                              {user.username}
                            </a>
                            {friendRequestsSent.includes(user.id) ? (
                              "Added"
                            ) : (
                              <CustomButton
                                text="Add Friend"
                                className="small-kick margin-kick hover-green"
                                onClick={() => sendFriendRequest(user.id)}
                              ></CustomButton>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </NESContainerW>
            {isLoggedInUser && (
              <NESContainerW title="Friend Requests">
                <ul className="list-style">
                  {friendRequests.map((requester) => (
                    <li className="Aligner" key={requester.id}>
                      <a
                        href={`/users/${requester.id}`}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        {requester.username}
                      </a>
                      <CustomButton
                        text="Accept"
                        className="small-kick margin-kick hover-green"
                        onClick={() => acceptFriendRequest(requester.id)}
                      />
                      <CustomButton
                        text="Deny"
                        className="small-kick margin-kick hover-red"
                        onClick={() => denyFriendRequest(requester.id)}
                      />
                    </li>
                  ))}
                </ul>
              </NESContainerW>
            )}
            <NESContainerW title="User Stats">
              <table style={{ margin: "0 auto", textAlign: "center" }}>
                <thead>
                  <tr>
                    <th style={{ paddingRight: "20px" }}>Games Played</th>
                    <th style={{ paddingRight: "20px" }}>Wins</th>
                    <th style={{ paddingRight: "20px" }}>Losses</th>
                    <th style={{ paddingRight: "20px" }}>W/L Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{user.wins + user.losses}</td>
                    <td>{user.wins}</td>
                    <td>{user.losses}</td>
                    <td>{(user.wins / user.losses).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </NESContainerW>
          </NESContainerW>
        </div>
      </div>
    </>
  );
};

export default Profile;