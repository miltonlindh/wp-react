import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import CategoryFilter from "../components/CategoryFilter"
import Spinner from "react-bootstrap/Spinner"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

// Models for the data we get from api
export interface Post {
    id: number;
    date: string;
    slug: string;
    categories: number[];
    title: {
      rendered: string;
      };
    excerpt: {
        rendered: string;
    }
    content: {
        rendered: string;
    }
    _links: {
        "wp:featuredmedia"?: {href: string}[];
    }
    imageUrl?: string;

    _embedded?: {
        author?: { id: number; name: string} [];

    }

}

interface Media {
    id: number;
    description: { rendered: string };
    source_url: string;
}
// Fallback if excerpt is missing
function getPreviewText(post: Post): string {
  const hasExcerpt =
    post.excerpt?.rendered &&
    post.excerpt.rendered.trim() !== "" &&
    post.excerpt.rendered.trim() !== "<p></p>";

  const sourceHtml = hasExcerpt
    ? post.excerpt.rendered
    : post.content?.rendered || "";

  const textOnly = sourceHtml.replace(/<[^>]+>/g, "").trim();
  // Change length of excerpt
  const maxLength = 150;

  if (textOnly.length <= maxLength) {
    return textOnly;
  }
  return textOnly.slice(0, maxLength) + "...";
}


// Fetches posts from wp and shows them, and stores them
export default function PostList() {
        const [posts, setPosts ] = useState<Post[]>([]);
        const [loading, setLoading] = useState(true);
        const [searchParams] = useSearchParams();
        const activeCategory = searchParams.get("category");


// Runs once when the page load
useEffect(() => {
    const API_URL = import.meta.env.VITE_BASE_URL;

//Loads posts and their images
    async function fetchPosts() {
        const res = await fetch(`${API_URL}/posts?_embed`)
        const data: Post[] = await res.json();

// Add image to each post
        const postsWithImages = await Promise.all(
            data.map(async (post) => {
                const mediaLink = post._links["wp:featuredmedia"]?.[0]?.href;

// No image = post as it is
                if (!mediaLink) {
                    return post;
                }

// Get image data
                const mediaRes = await fetch(mediaLink);
                const mediaData: Media = await mediaRes.json();
// Add image url to the post
                return {
                    ...post,
                    imageUrl: mediaData.source_url,
                }
            })
        )
// Save posts so we can show them
        setPosts(postsWithImages);
        setLoading(false);

    }

// Start loading
    fetchPosts();

    }, []);

    const visiblePosts = activeCategory
  ? posts.filter((post) =>
      post.categories.includes(Number(activeCategory))
    )
  : posts;

// Shows loading text 
        return (               
          <>
                <CategoryFilter />
         
  <div className="post-list">
    {loading ? (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Laddar...</span>
      </Spinner>
    ) : visiblePosts.length === 0 ? (
      <p>Inga inlägg hittades.</p>
    ) : (
      <Row className="g-4">
        {visiblePosts.map((post) => (
     
          <Col key={post.id} xs={12} md={6} lg={4}>
            <Card className="h-100">
                {/* Image */}
              {post.imageUrl && (
                <Card.Img
                  variant="top"
                  src={post.imageUrl}
                  alt={post.title.rendered}
                />
              )}

              <Card.Body>
                <div className="meta-row">
                  {/* Date and author */}
                  <span>{post.date.slice(0, 10)}</span>
                  <span> Av {post._embedded?.author?.[0]?.name}</span>
                </div>

                {/* title */}
                <Card.Title>
                  <Link to={post.slug}>{post.title.rendered}</Link>
                </Card.Title>

               <Card.Text>{getPreviewText(post)}</Card.Text>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )}
  </div>
        </>

);

};
