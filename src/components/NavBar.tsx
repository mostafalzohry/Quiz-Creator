import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomNavbar: React.FC = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand
        href="#home"
        style={{ fontSize: "1.5rem", fontWeight: "bold" }}
      >
        QuizApp
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#create">Create Quiz</Nav.Link>
          <Nav.Link href="#edit">Edit Quiz</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
