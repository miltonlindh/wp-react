import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import type { Product } from "../types/products";

// Data + Ui state
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"" | "pris_asc" | "pris_desc">("");

  // Filter values
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // load products from API on page load
  useEffect(() => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/produkter`);
        if (!res.ok) {
          throw new Error("Kunde inte hämta produkter");
        }

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fel när produkterna hämtades", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);
// Show spinner while fetching
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Laddar produkter...</span>
        </Spinner>
      </div>
    );
  }

  // Unique values for dropdowns
  const allTypes = Array.from(
    new Set(
      products.flatMap((p) => p.kladestyp ?? [])
    )
  );

  const allSizes = Array.from(
    new Set(
      products.flatMap((p) => p.storlek ?? [])
    )
  );

  // Filter products
  let visibleProducts = products.filter((p) => {
    const matchesType =
      !selectedType || p.kladestyp?.includes(selectedType);
    const matchesSize =
      !selectedSize || p.storlek?.includes(selectedSize);

    return matchesType && matchesSize;
  });

  // Price sorting
  if (sort === "pris_asc") {
    visibleProducts = [...visibleProducts].sort(
      (a, b) => Number(a.pris) - Number(b.pris)
    );
  } else if (sort === "pris_desc") {
    visibleProducts = [...visibleProducts].sort(
      (a, b) => Number(b.pris) - Number(a.pris)
    );
  }

  return (
    <Container className="products-page py-4">
       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
         <h1 className="mb-0">Produkter</h1>


        {/* Filters */}
       <ButtonGroup size="sm">
  <Button
    className={`sort-btn ${sort === "" ? "sort-btn--active" : ""}`}
    onClick={() => setSort("")}
  >
    Ingen sortering
  </Button>
  <Button
    className={`sort-btn ${sort === "pris_asc" ? "sort-btn--active" : ""}`}
    onClick={() => setSort("pris_asc")}
  >
    Pris: lägst först
  </Button>
  <Button
    className={`sort-btn ${sort === "pris_desc" ? "sort-btn--active" : ""}`}
    onClick={() => setSort("pris_desc")}
  >
    Pris: högst först
  </Button>
</ButtonGroup>

      </div>

      {/* Filters */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={6}>
        <Form.Select
  className="product-filter-select"
  value={selectedType}
  onChange={(e) => setSelectedType(e.target.value)}
>
  <option value="">Alla klädestyper</option>
  {allTypes.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</Form.Select>

        </Col>

        <Col xs={12} md={6}>
       <Form.Select
  className="product-filter-select"
  value={selectedSize}
  onChange={(e) => setSelectedSize(e.target.value)}
>
  <option value="">Alla storlekar</option>
  {allSizes.map((size) => (
    <option key={size} value={size}>
      {size}
    </option>
  ))}
</Form.Select>

        </Col>
      </Row>
     {/* Product list */}
      <Row className="g-4">
        {visibleProducts.map((p) => (
          <Col key={p.id} xs={12} md={6} lg={4}>
            <Card className="h-100 product-card">
              {p.image && (
                <Card.Img variant="top" src={p.image} alt={p.title} />
              )}

              <Card.Body>
                <Card.Title>{p.title}</Card.Title>

                {/* Price */}
                <p className="fw-bold mb-1">Pris: {p.pris} kr</p>

                {/* Color and material */}
                <p className="mb-1">
                  {p.farg && <>Färg: {p.farg} • </>}
                  {p.material && <>Material: {p.material}</>}
                </p>

                {/* Clothinstyps and Sizes */}
                <p className="mb-2">
                  {p.kladestyp?.length > 0 && (
                    <>
                      Typ: {p.kladestyp.join(", ")}
                      <br />
                    </>
                  )}
                  {p.storlek?.length > 0 && (
                    <>Storlekar: {p.storlek.join(", ")}</>
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
          {/* If no results */}
      {visibleProducts.length === 0 && (
  <p className="no-products-message mt-3">
    Inga produkter matchar filtren.
  </p>
)}

      </Row>
    </Container>
  );
}
