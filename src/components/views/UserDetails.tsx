import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { Button } from "components/ui/Button";

const UserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract the user ID from the URL
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditable, setIsEditable] = useState(false);

  const usernameInputRef = useRef(null);
  const birthDateInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);

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
    const newBirthDate = birthDateInputRef?.current?.value;

    try {
      const response = await api.put(`/users/${userId}`, {
        username: newUsername,
        birthDate: new Date(newBirthDate),
      });

      navigate(0);
    } catch (error) {
      alert(
        `Something went wrong during updating user: \n${handleError(error)}`
      );
    }
  };

  const renderEditButton = () => {
    const isLoggedInUserId = localStorage.getItem("userId") === String(user.id);

    if (isLoggedInUserId && isEditable) {
      return (
        <React.Fragment>
          <Button
            width="100%"
            onClick={() => setIsEditable(false)}
            className="editable-cancel-btn"
          >
            Cancel
          </Button>
          <Button width="100%" onClick={updateUserData}>
            Save
          </Button>
        </React.Fragment>
      );
    }

    if (isLoggedInUserId) {
      return (
        <Button width="100%" onClick={() => setIsEditable(true)}>
          Edit
        </Button>
      );
    }

    return null;
  };

  if (isLoading || !user) {
    return <Spinner />;
  }

  return (
    <BaseContainer>
      <div className="login container user-details">
        <h2 className="header title">User Details</h2>
        <div className="login form">
          <div>
            <span className="info-title">Name:</span>
            <p className="info-text">{user.name}</p>
          </div>
          <div>
            <span className="info-title">Status:</span>
            <p className="info-text">
              <span style={{ marginRight: 8 }}>
                {`${user.status === "OFFLINE" ? "🔴" : "🟢"} - ${user.status}`}
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
            <span className="info-title">Creation Date:</span>
            <p className="info-text">{user.creationDate}</p>
          </div>

          <div className="user-details button-container">
            {renderEditButton()}
          </div>
          <div className="user-details button-container">
            <Button width="100%" onClick={() => navigate("/users")}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default UserDetails;