import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Post } from "../components/PostList";
import { Container, Row, Col, Card , Spinner} from "react-bootstrap";

export default function PostTemplate() {
  // Get slug from the url
  const { slug } = useParams<{ slug: string }>();

  // State for the post, image url and loading
  const [post, setPost] = useState<Post | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load the post and the image when slug changes
  useEffect(() => {
    async function loadPost() {
      const API_URL = import.meta.env.VITE_BASE_URL;

      // Get the post by slug 
      const res = await fetch(`${API_URL}/posts?slug=${slug}`);
      const data: Post[] = await res.json();
      const p = data[0] || null;

      setPost(p);

      // If it has a image fetch that
      const mediaLink = p?._links?.["wp:featuredmedia"]?.[0]?.href;

      if (mediaLink) {
        const mediaRes = await fetch(mediaLink);
        const mediaData = await mediaRes.json();
        setImageUrl(mediaData.source_url);
      }

      setLoading(false);
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) return  
  <Spinner animation="border" role="status">
   <span className="visually-hidden">Laddar...</span>
  </Spinner>;
  if (!post) return <p>Inlägg hittades ej</p>;

  return (
    <Container className="single-post-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="single-post">
            {/* Image if it exists */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={post.title.rendered}
                className="single-post-image"
              />
            )}

            {/* Date and Author */}
            <div className="meta-row">
              <span>{post.date.slice(0, 10)}</span>
              <span> Av {post._embedded?.author?.[0]?.name}</span>
            </div>

            {/* Title */}
            <h1 className="single-post-title">{post.title.rendered}</h1>

            {/* Content from Wp*/}
            <div
              className="single-post-content"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
