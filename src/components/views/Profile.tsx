import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "../ui/Spinner";
import PropTypes from "prop-types";
import languages from 'helpers/languages.json';


const FormField = (props) => {
  return (
    <div className="Update field">
      <label className="update label">
        {props.label}
      </label>
      <input
        className="update input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};


const Profile = () => {
  const id = useParams().userid;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [language, setLanguage] = useState('en');

  const backToGame = async () => {
    navigate("/game")
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, [updateTrigger]);

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="player">
        <h2>This is a profile page</h2>
        <ul className="player user-list">
          <li>Username: {user.username}</li>
          <li>Status: {user.status}</li>
          <li>Language: {user.language}</li>
          <li>Creation_Date:  {user.creationDate}</li>
          <li>Birthday: {user.birthday}</li>
        </ul>

        <Button
          width="100%"
          onClick={() => backToGame()}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="profile container">
      { content }
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Profile;
