import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import Swal from 'sweetalert2';

const fields = loginFields;
let fieldsState = {};
fields.forEach(field => fieldsState[field.id] = '');

export default function Login() {
  const router = useRouter();
  const { email, mot_de_passe } = router.query;

  useEffect(() => {
    if (email && mot_de_passe) {
      // Pre-fill the login inputs with the email and password from the query parameters
      setLoginState({
        ...loginState,
        email: email,
        password: mot_de_passe,
      });
    }
  }, [email, mot_de_passe]);

  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  }

  // Handle Login API Integration here
  const authenticateUser = () => {
    const endpoint = "http://localhost:3000/utilisateurs/login";
    const { email, mot_de_passe } = loginState;
    const requestBody = JSON.stringify({ email, mot_de_passe: mot_de_passe });
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
    .then(response => response.json())
    .then(data => {
      if (data?.message === "Adresse e-mail incorrecte") {
        Swal.fire({
          icon: 'error',
          title: 'Incorrect Email',
          text: 'The email address you provided is incorrect.',
        });
      }
      else {
        if (data?.message === "Mot de passe incorrect") {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect Password',
            text: 'The password you entered is incorrect.',
          });
        }
        else {
          if (data?.message === "Échec de la connexion de l'utilisateur") {
            Swal.fire({
              icon: 'error',
              title: 'Connection Failed',
              text: 'Failed to connect the user.',
            });
          }
          else {
            if (data?.token) {
              localStorage.setItem("token", data.token);
              router.push("/"); // Redirect to the homepage after successful login
            }
            else {
              console.log("Token not found"); // Handle token not found case
            }
          }
        }
      }      
      // localStorage.setItem("token", data.token);
      // router.push("/"); // Redirect to the homepage after successful login
    })
    .catch(error => {
      // Handle login failure
      console.error("Login failed:", error);
    });
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {
          fields.map(field =>
            <Input
              key={field.id}
              handleChange={handleChange}
              value={loginState[field.id]}
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
      </div>

      <FormAction handleSubmit={handleSubmit} text="Login" />

    </form>
  );
}
