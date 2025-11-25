import { useState, useEffect } from "react"
import "../index.css"
import Spinner from "react-bootstrap/Spinner"

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
                posts.map((post) => (
                    <article key={post.id}>
                        {/* image */}
                        {post.imageUrl && (
                            <img src={post.imageUrl} alt={post.title.rendered} />
                        )}
                        <div className="info">
                            {/* Date, only date no time*/}
                            <p>{post.date.slice(0, 10)}</p>
                        <h4>
                            {/* Author */}
                            Av {post._embedded?.author?.[0]?.name}
                        </h4>
                        </div>
                        <div className="post-card">
                            {/* Title */}
                        <h2>{post.title.rendered}</h2>
                        {/* Displays formatted WP text */}
                        <p 
                        dangerouslySetInnerHTML={{ __html: post.content.rendered}}
                      />
                      </div>
                    </article>
                ))
            )
        }
       
           </div>
    );
};
