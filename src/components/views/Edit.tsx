import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Edit.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import languages from 'helpers/languages.json';


const FormField = (props) => {
    return (
      <div className="edit field">
        <label className="edit label">{props.label}</label>
        <input
          className="edit input"
          placeholder={props.message}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
  FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    message: PropTypes.string,
    onChange: PropTypes.func,
  };

  const Edit = () => {
    const navigate = useNavigate();
    const [birthday, setBirthday] = useState<string>("");
    const [username, setUsername] = useState<string>(null);
    const [language, setLanguage] = useState('en');
    const id = localStorage.getItem("id")
    console.log('Current User', localStorage.getItem("id"))
  
    const doEdit = async () => {
      try {
        
        const requestBody = JSON.stringify({ username, birthday, language});
        console.log(requestBody)
        const response = await api.put(`/users/${id}`, requestBody);
  
        // Get the returned user and update a new object.
        const user = new User(response.data);
  
        // Login successfully worked --> navigate to the last web page in the GameRouter
        navigate(-1);
      } catch (error) {
        alert(
          `Something went wrong during the login: \n${handleError(error)}`
        );
      }
    };
  
    return (
      <BaseContainer>
        <div className="edit container">
          <div className="edit form">
          <h4 className="title">Edit Profile</h4>
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
              message = "enter here"
            />
            <FormField
              label="Birthday"
              value={birthday}
              onChange={(n) => setBirthday(n)}
              message = "optional"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                  {lang.name}
                  </option>
                ))}
            </select>
            <div className="edit button-container">
              <Button
                disabled={!username}
                width="100%"
                onClick={() => doEdit()}
              >
                Submit
              </Button>
              <Button
                width="100%"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
    );
  };
  
  /**
   * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
   */
  export default Edit;
  
