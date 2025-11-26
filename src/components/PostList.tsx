import { useState, useEffect } from "react"
import "../index.css"
import Spinner from "react-bootstrap/Spinner"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
// Models for the data we get from api
interface Post {
    id: number;
    date: string;
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



// Fetches posts from wp and shows them, and stores them
export default function PostList() {
        const [posts, setPosts ] = useState<Post[]>([]);

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
        
    }

// Start loading
    fetchPosts();

    }, []);

    
// Shows loading text 
        return (                        
          <div className="post-list">
            {posts.length === 0 ? (
//Bootstrap spinner show when the posts loads
            <Spinner animation="border" role="status">
             <span className="visually-hidden">Laddar...</span>
            </Spinner>
            ) : (
                //Show each post
         <Row className="g-4"> 
             {posts.map((post) => (
    <Col key={post.id} xs={12} md={6} lg={4}>
      <Card className="h-100">
        {post.imageUrl && (
          <Card.Img variant="top" src={post.imageUrl} alt={post.title.rendered} />
        )}

        <Card.Body>
            <div className="meta-row ">
         {/* Date and author*/}
              <span>{post.date.slice(0, 10)}</span>
              <span className="">
                 Av {post._embedded?.author?.[0]?.name} 
              </span>

         </div>


          <Card.Title>{post.title.rendered}</Card.Title>
          <Card.Text
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

            )
        }
       
           </div>
    );
};
