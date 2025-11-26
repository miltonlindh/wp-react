import { useState, useEffect } from "react";
import { fetchCategories } from "../services/Categories";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


interface Category {
    id: number;
    name: string;
}


export function Header() {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
async function loadCats() {
    const data = await fetchCategories();
    setCategories(data);
}
loadCats();
    }, []);
 
    return (
    <>
    {/* Bootstrap dropdown navbar */}
       <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Lia-extrude</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Kategorier" id="basic-nav-dropdown">
                <Nav>
                    {categories.map((cat) => (
                        <Nav.Link key={cat.id}>{cat.name}</Nav.Link>
                    ))}
                </Nav>
           
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    );
}

