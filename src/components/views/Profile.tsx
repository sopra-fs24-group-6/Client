import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";
import NavBar from "../ui/NavBar";
//import initialPlayers from "components/placeholders/playerlist";
import languages from "helpers/languages.json";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract the user ID from the URL
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
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);

  const usernameInputRef = useRef(null);
  const birthDateInputRef = useRef(null);
  const nameInputRef = useRef(null);

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

  //retrieve userdata from server
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${userId}`);
        console.log(response.data);
        setUser(response.data);

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
  }, [userId, navigate]);

  //retrieve all users from server
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
      await api.post(`/friends/friendRequests`, requestBody);
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

  const formatDate = (dateString) => {
    const options = {
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
      <NavBar />
      <div className="Extension Flex">
        <NESContainerW title="" className="left">
          <NESContainerW title="User Information">
            <div>
              <span className="info-title">Name:</span>
              {isEditable ? (
                <div className="editable-input">
                  <input
                    ref={nameInputRef}
                    type="text"
                    defaultValue={user.name}
                  ></input>
                </div>
              ) : (
                <p className="info-text">{user.name}</p>
              )}
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
                <p className="info-text">{user.birthDate || "Not provided"}</p>
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
              <p className="info-text">{formatDate(user.creationDate)}</p>
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
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
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
        </NESContainerW>
        <NESContainerW title="" className="right">
          <NESContainerW title="User Stats">
            <p>Coming Soon</p>
          </NESContainerW>
          <NESContainerW title="Recent Games">
            <p>Coming Soon</p>
          </NESContainerW>
        </NESContainerW>
      </div>
    </>
  );
};

export default Profile;
