import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Form, Button, Dropdown } from "semantic-ui-react";
import axios from "axios";
import "./App.css";
import emailjs from "emailjs-com";

function HomePage() {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [tipDeseu, setTipDeseu] = useState("");
  const [deseu, setDeseu] = useState("");
  const [stare, setStare] = useState("");
  const [cantitate, setCantitate] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const navigate = useNavigate();

  const tipDeseuOptions = [
    {
      key: "laptop",
      text: "Laptop",
      value: "laptop",
    },
    {
      key: "monitor",
      text: "Monitor",
      value: "monitor",
    },
    {
      key: "unitate_centrala",
      text: "Unitate centrală",
      value: "unitate_centrala",
    },
    {
      key: "tastatura",
      text: "Tastatură",
      value: "tastatura",
    },
    {
      key: "mouse",
      text: "Mouse",
      value: "mouse",
    },
    {
      key: "cast",
      text: "Căști",
      value: "casti",
    },
    {
      key: "camera_video",
      text: "Cameră video / Microfon",
      value: "camera_video",
    },
    {
      key: "cabluri",
      text: "Cabluri diverse",
      value: "cabluri",
    },
    {
      key: "imprimanta",
      text: "Imprimantă",
      value: "imprimanta",
    },
    {
      key: "fax",
      text: "FAX",
      value: "fax",
    },
    {
      key: "telefon",
      text: "Telefon",
      value: "telefon",
    },
  ];

  const tipStareOptions = [
    {
      key: "defect",
      text: "Defect",
      value: "Defect",
    },
    {
      key: "functional",
      text: "Functional",
      value: "Functional",
    },
  ];
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = () =>
    nume &&
    isEmailValid(email) &&
    tipDeseu &&
    deseu &&
    stare &&
    cantitate &&
    feedbackRating > 0;

  const sendEmail = (formData) => {
    const serviceID = "service_gnnfc55";
    const templateID = "template_jf7qc27";
    const userID = "f2gM5zwlSw0rLvLlD";

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then(() => alert("Datele au fost trimise cu succes pe email!"))
      .catch(() =>
        alert("Eroare la trimiterea emailului. Verifică configurația.")
      );
  };

  const onSubmit = () => {
    if (!isFormValid()) {
      alert("Please fill in all fields correctly.");
      return;
    }

    axios
      .get(
        `https://api.sheetbest.com/sheets/75d91a11-2dc6-481b-a5be-6786d94932e2`
      )
      .then((response) => {
        const newID = `CMD${String(response.data.length + 1).padStart(5, "0")}`;
        const currentDateTime = new Date().toLocaleString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const data = {
          nume,
          email,
          tipDeseu,
          deseu,
          stare,
          cantitate,
          feedback: feedbackRating,
          data: currentDateTime,
          deseuLivrat: "FALSE",
          ID: newID,
        };

        return axios
          .post(
            `https://api.sheetbest.com/sheets/75d91a11-2dc6-481b-a5be-6786d94932e2`,
            data
          )
          .then(() => data);
      })
      .then((data) => {
        sendEmail(data);

        // Resetează câmpurile formularului
        setNume("");
        setEmail("");
        setTipDeseu("");
        setDeseu("");
        setStare("");
        setCantitate("");
        setFeedbackRating(0);

        // Navighează către pagina de confirmare
        navigate("/confirm");
      })
      .catch((error) => console.error("Error submitting data:", error));
  };

  return (
    <div className="form-container">
      <Form className="form-box">
        <Form.Field>
          <label>Nume</label>
          <input
            placeholder="Nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Adresa email</label>
          <input
            placeholder="Adresa Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </Form.Field>
        <Form.Field>
          <label>Tipul deșeului</label>
          <Dropdown
            placeholder="Selectează tipul deșeului"
            fluid
            selection
            options={tipDeseuOptions}
            value={tipDeseu}
            onChange={(e, { value }) => setTipDeseu(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Deseu</label>
          <input
            placeholder="Deseu"
            value={deseu}
            onChange={(e) => setDeseu(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Stare</label>
          <Dropdown
            placeholder="Selectează starea deseului"
            fluid
            selection
            options={tipStareOptions}
            value={stare}
            onChange={(e, { value }) => setStare(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Cantitate</label>
          <input
            type="number"
            placeholder="Cantitate"
            value={cantitate}
            onChange={(e) => setCantitate(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Feedback</label>
          <div className="feedback-rating">
            {[1, 2, 3, 4, 5].map((rating) => (
              <span
                key={rating}
                onClick={() => setFeedbackRating(rating)}
                className={`feedback-star ${
                  feedbackRating >= rating ? "active" : ""
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </Form.Field>
        <Button type="submit" onClick={onSubmit} disabled={!isFormValid()}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

// Pagina de confirmare
function ConfirmPage() {
  const navigate = useNavigate();

  return (
    <div className="confirm-container">
      <h1>Deșeul tău a fost înregistrat cu succes!</h1>
      <Button onClick={() => navigate("/")}>Adaugă alt deșeu</Button>
    </div>
  );
}

// Aplicația principală
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
      </Routes>
    </Router>
  );
}
