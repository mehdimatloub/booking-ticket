import { useState } from 'react';
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

const fields = signupFields;
let fieldsState = {};

fields.forEach(field => fieldsState[field.id] = '');

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const router = useRouter();
  const handleChange = (e) => setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signupState["confirm-password"] === signupState["mot_de_passe"]) {
      const newUser = { ...signupState };
      delete newUser["confirm-password"];
      createAccount(newUser);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match!',
        text: 'Please make sure the passwords match.',
      });
    }
  };

  const createAccount = (newUser) => {
    axios.post("http://localhost:3000/utilisateurs/register", newUser)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'You can now login with your registered email and password.',
        }).then(() => {
          // Navigate to Login page after successful signup
          router.push({
            pathname: "/Login",
            query: { email: newUser.email, mot_de_passe: newUser.password },
          });
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed!',
          text: 'An error occurred while signing up. Please try again later.',
        });
        console.error("Error creating account:", error);
      });
  };


  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {
          fields.map(field =>
            <Input
              key={field.id}
              handleChange={handleChange}
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          )
        }
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
