import { useEffect, useState } from "react";
import { useNavigate, useSearchParams} from "react-router-dom";
import { Container } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { fetchCategories } from "../services/Categories";

interface Category {
    id: number;
    name: string;
}

export default function CategoryFilter() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const activeCategory = searchParams.get("category");

    useEffect(() => {
        async function loadCats() {
            try{
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Kunde inte ladda kategorier", err);
            }
        }

        loadCats();
    },[]);

    //Helper to change the category in url
    function handleSelect(id: number | null) {
        if (id === null){
            navigate("/");
        } else {
            navigate(`/?category=${id}`);
        }

    }

    const activeLabel = 
    activeCategory === null
    ? "Alla kategorier"
    : categories.find((c) => String(c.id) === activeCategory)?.name ||
    "Alla kategorier"

    return(
        <div className="border-bottom bg-dark py-2">
      <Container>
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="category-dropdown"
            className="w-100"
          >
            {activeLabel}
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">

            <Dropdown.Item onClick={() => handleSelect(null)}>
              Alla kategorier
            </Dropdown.Item>

            {categories.map((cat) => (
              <Dropdown.Item
                key={cat.id}
                active={String(cat.id) === activeCategory}
                onClick={() => handleSelect(cat.id)}
              >
                {cat.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </div>

    );

}
