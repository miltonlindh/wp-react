import { Header } from "../src/components/Header"
import { Footer } from "../src/components/Footer"
import PostList  from "../src/components/PostList"
function App() {

  return (
    < div className="d-flex flex-column min-vh-100">
   
      <Header />
      <main className="flex-fill bg-dark">
      <PostList />
      </main>

      < Footer />
    </div>
  )
}

export default App
