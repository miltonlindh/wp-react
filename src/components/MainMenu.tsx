import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";


// Model for  a single menu item from wp rest api
interface MenuItem {
  id: number;
  title: string;
  url: string;
  parent: number;
  order: number;
  object_id: number;
  type: string;
}

export default function MainMenu() {
  // Local state for menu items, loading state and fetch errors
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load the main Wordpress menu on mount
  useEffect(() => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    async function fetchMenu() {
      try {
        const res = await fetch(`${API_URL}/menu-items?menu=main-menu`);

        if (!res.ok) {
          throw new Error("Kunde inte hämta menyn");
        }

        const data: MenuItem[] = await res.json();

        // sort menu by their WP order value
        data.sort((a, b) => a.order - b.order);

        setItems(data);
      } catch (err) {
        console.error(err);
        setMenuError("Kunde inte ladda menyn");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  // Convert a full wp url into clean internal route path
const wpUrlToPath = (fullUrl: string): string => {
  try {
    const url = new URL(fullUrl);
    const path = url.pathname.replace(/^\/|\/$/g, ""); // t.ex. "vara-tjanster"

    if (!path) {
      return "/";
    }
// Map wp page path to react route for pageview
    return `/page/${path}`;
  } catch {
    return "/";
  }
};


// Handle clicking a menu item (client side navigation)
  const handleClick = (item: MenuItem) => {
    const path = wpUrlToPath(item.url);
    navigate(path);
  };

  // Loading error states
  if (loading) return <span>Laddar meny...</span>;
  if (menuError) return <span>{menuError}</span>;


  // Render the menu items as bootstrap nav links
  return (
    <>
      {items.map((item) => (
        <Nav.Link
          key={item.id}
          href={wpUrlToPath(item.url)}
          onClick={(e) => {
            e.preventDefault();
            handleClick(item);
          }}
        >
          {item.title}
        </Nav.Link>
      ))}
    </>
  );
}
