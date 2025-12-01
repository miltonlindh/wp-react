/*import { useState, useEffect } from "react";
import { fetchCategories } from "../services/Categories";
import { useNavigate } from "react-router-dom"*/
import MainMenu from "./MainMenu";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
//import NavDropdown from 'react-bootstrap/NavDropdown';

/*
interface Category {
    id: number;
    name: string;
}
*/

export function Header() {
   /* // Hook for navigation
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    // Stores the fetched list of categories
    useEffect(() => {
        // Fetch categories on component mount
async function loadCats() {
    const data = await fetchCategories();

    setCategories(data);
}
loadCats();
    }, []);
 */
    return (
    <>
    {/* Bootstrap dropdown navbar */}
       <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        {/* Home button */}
        <Navbar.Brand href="/app">Lia-extrude</Navbar.Brand>
        {/* collapsible menu on mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Dropdown menu with categories */}
            {/**
            <NavDropdown title="Kategorier" id="basic-nav-dropdown">
                <Nav>
                   {categories.map((cat) => (
                    <NavDropdown.Item
                    key={cat.id}
                    onClick={() => navigate(`/?category=${cat.id}`)}
                    >
                        {cat.name}
                    </NavDropdown.Item>
                   ))}
                </Nav>
           
            </NavDropdown>
            */}

           <MainMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    );
}

