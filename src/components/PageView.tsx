import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_BASE_URL;

// Model for Wp page
interface WPPage {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
}

export default function PageView() {
    // Routing param for loading the correct Wp page
    const { slug } = useParams< { slug: string }>();

    // Local state for page content, laoding state and fetch erros
    const [page, setPage] = useState<WPPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);


    // Load the page from wordpress when the slug changes
    useEffect(() => {
        //if no slug is provided, stop and show error
        if (!slug) {
            setPageError("Ingen sida angiven");
            setLoading(false);
            return;
        }
// fetch page from Wp REST API by slug
        async function fetchPage() {
            try {
                const res = await fetch(`${API_URL}/pages?slug=${slug}`);

                if(!res.ok) {
                    throw new Error("Kunde inte hämta sidan");
                }

                const data: WPPage[] = await res.json();
                setPage(data[0] ?? null);
            } catch (err) {
                console.error(err);
                setPageError("Kunde inte ladda sidan");
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [slug]);

    // Loading state
    if (loading) return <main>Laddar sida..</main>;
    // Error or no matching page
    if (pageError || !page) return <main>Sidan kunde inte hittas</main>;

    // Render WP content
    return(
        <main className="wp-page">
      <h1>{page.title.rendered}</h1>
            <article 
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
            />
        </main>
    )
}