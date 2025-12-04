import { Routes, Route } from "react-router-dom"
import PostTemplate from "./components/PostTemplate"
import { Header } from "../src/components/Header"
import { Footer } from "../src/components/Footer"
import PostList  from "../src/components/PostList"
import PageView from "./components/PageView";
import ProductsPage from "./components/ProductPage"
function App() {

  return (
    < div className="d-flex flex-column min-vh-100 bg-dark">
   
      <Header />
     <Routes>
          <Route  path="/" element={<PostList />} />
          <Route path="/:slug" element={<PostTemplate />}/>
          <Route path="/page/:slug" element={<PageView />} />
          <Route path="/page/produkter" element={<ProductsPage />} />
     </Routes>

      < Footer />
    </div>
  )
}

export default App
