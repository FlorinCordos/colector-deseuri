import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Dropdown, Modal, Input } from "semantic-ui-react";
import "./App.css";
import axios from "axios";
import emailjs from "emailjs-com";

function HomePage() {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [tipDeseu, setTipDeseu] = useState([]);
  const [deseuriCantitati, setDeseuriCantitati] = useState({});
  const [currentDeseu, setCurrentDeseu] = useState(null);
  const [currentCantitate, setCurrentCantitate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deseuColectat, setDeseuColectat] = useState("");
  const navigate = useNavigate();

  const tipDeseuOptions = [
    {
      key: "Laptop",
      text: "Laptop",
      value: "Laptop",
    },
    {
      key: "Monitor",
      text: "Monitor",
      value: "Monitor",
    },
    {
      key: "Unitate Centrală",
      text: "Unitate centrală",
      value: "Unitate Centrală",
    },
    {
      key: "Tastatură",
      text: "Tastatură",
      value: "Tastatură",
    },
    {
      key: "Mouse",
      text: "Mouse",
      value: "Mouse",
    },
    {
      key: "Căști",
      text: "Căști",
      value: "Căști",
    },
    {
      key: "Cameră video / Microfon",
      text: "Cameră video / Microfon",
      value: "Cameră video / Microfon",
    },
    {
      key: "Cabluri diverse",
      text: "Cabluri diverse",
      value: "Cabluri diverse",
    },
    {
      key: "Imprimantă",
      text: "Imprimantă",
      value: "Imprimantă",
    },
    {
      key: "Fax",
      text: "Fax",
      value: "Fax",
    },
    {
      key: "Telefon",
      text: "Telefon",
      value: "Telefon",
    },
  ];

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = () =>
    nume && isEmailValid(email) && Object.keys(deseuriCantitati).length > 0;

  const sendEmail = (formData) => {
    //const serviceID = "service_gnnfc55";
    const serviceID = "service_63pevco";
    //const templateID = "template_jf7qc27";
    const templateID = "template_8cxkr2q";
    //const userID = "f2gM5zwlSw0rLvLlD";
    const userID = "VjH0XbNX--vjFPpE_";

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then(() => alert("Datele au fost trimise cu succes pe email!"))
      .catch(() =>
        alert("Eroare la trimiterea emailului. Verifică configurația.")
      );
  };

  const handleDeseuSelect = (e, { value }) => {
    const newlySelected = value.filter((v) => !tipDeseu.includes(v));
    if (newlySelected.length > 0) {
      setCurrentDeseu(newlySelected[0]);
      setModalOpen(true);
    }
    setTipDeseu(value);
  };

  const handleModalSubmit = () => {
    setDeseuriCantitati((prev) => ({
      ...prev,
      [currentDeseu]: currentCantitate,
    }));
    setModalOpen(false);
    setCurrentCantitate("");
    setCurrentDeseu(null);
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
        //const newID = `CMD${String(response.data.length + 1).padStart(5, "0")}`;
        const ID_AUX = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const newID = `CMD${ID_AUX.slice(0, 3)}${ID_AUX.slice(-4)}`;
        //const newID = `CMD${uuidv4()}`;

        const currentDateTime = new Date().toLocaleString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const rows = Object.entries(deseuriCantitati).map(
          ([tip, cantitate]) => ({
            nume,
            email,
            tipDeseu: tip,
            cantitate,
            data: currentDateTime,
            deseuLivrat: "FALSE",
            ID: newID,
            deseuColectat: "FALSE",
          })
        );

        // Construim un rezumat al deșeurilor pentru email
        const deseuriSummary = Object.entries(deseuriCantitati)
          .map(([tip, cantitate]) => `${tip} (${cantitate})`)
          .join(", ");

        const formData = {
          nume,
          email,
          deseuri: deseuriSummary, // Trimitem tipurile și cantitățile
          ID: newID, // Trimitem ID-ul
        };

        return axios
          .post(
            `https://api.sheetbest.com/sheets/75d91a11-2dc6-481b-a5be-6786d94932e2`,
            rows
          )
          .then(() => formData);
      })
      .then((formData) => {
        sendEmail(formData); // Send the data to EmailJS

        // Reset the form fields
        setNume("");
        setEmail("");
        setTipDeseu([]);
        setDeseuriCantitati({});
        // Navighează către pagina de confirmare
        navigate("/confirm");
      })
      .catch((error) => console.error("Error submitting data:", error));
  };

  return (
    <div className="form-container">
      <header className="app-header">GreenGadget</header>
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
            multiple
            selection
            options={tipDeseuOptions}
            value={tipDeseu}
            onChange={handleDeseuSelect}
          />
        </Form.Field>
        <Button type="submit" onClick={onSubmit} disabled={!isFormValid()}>
          Submit
        </Button>
      </Form>

      <Modal open={modalOpen} size="mini">
        <Modal.Header>Cantitate pentru {currentDeseu}</Modal.Header>
        <Modal.Content>
          <Input
            type="number"
            placeholder="Cantitate"
            value={currentCantitate}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // Permite doar numere pozitive
                setCurrentCantitate(value);
              }
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleModalSubmit} disabled={!currentCantitate}>
              Salvează
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
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
