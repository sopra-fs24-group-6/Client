import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import NESContainerW from "../ui/NESContainerW";
import "styles/views/Game.scss";
import CustomButton from "../ui/CustomButton";
import NavBar from "../ui/NavBar";
import initialPlayers from "components/placeholders/playerlist";
import languages from 'helpers/languages.json';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract the user ID from the URL
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const usernameInputRef = useRef(null);
  const birthDateInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const friends = initialPlayers;

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${userId}`);
        console.log(response.data)
        setUser(response.data);

        setIsLoggedInUser(
          localStorage.getItem("userId") === String(response.data.id)
        );

        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch user details: ${handleError(error)}`);
        navigate("/users");
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  const updateUserData = async () => {
    const newUsername = usernameInputRef?.current?.value;
    const newName = nameInputRef?.current?.value;
    const newBirthDate = birthDateInputRef?.current?.value;
    // const newLanguage = languageInputRef?.current?.value;
    const newLanguage = selectedLanguage;

    console.log(newLanguage)

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
                    new Date(user.birthDate)?.toISOString()?.slice(0, 10) || ""
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
                  onChange={(e) => setSelectedLanguage(e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="info-text">
                {languages.find(lang => lang.code === user.language)?.name || "Unknown Language"}
              </p>
            )}
          </div>
          <div>
            <span className="info-title">Creation Date:</span>
            <p className="info-text">{user.creationDate}</p>
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
          <div className="user-details button-container">
            <CustomButton
              text="Go Back"
              className="hover-orange"
              onClick={() => navigate("/users")}
            ></CustomButton>
          </div>
        </NESContainerW>
        <NESContainerW title="Friends">
          <ul className="list-style">
            {friends.map((player, index) => (
              <li className="Aligner" key={index}>
                {player}

                <CustomButton
                  text="Invite"
                  className="small-kick margin-kick hover-red"
                ></CustomButton>
              </li>
            ))}
          </ul>
        </NESContainerW>
      </NESContainerW>
      <NESContainerW title="" className="right">
        <NESContainerW title="User Stats">
          <p>Coming Soon</p>
        </NESContainerW>
        <NESContainerW title="Recent Games">
          <p>Coming Soon</p>
        </NESContainerW>
      </NESContainerW>
    </>
  );
};

export default Profile;
