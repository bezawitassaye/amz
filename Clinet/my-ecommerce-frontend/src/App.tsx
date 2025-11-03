
import ProductList from "./components/ProductList"
import './index.css'
import SweatshirtPage from "./pages/SweatshirtPage"
import { Provider } from "react-redux";
import { store } from "./redux/store";
function App() {


  return (
    <>
      <Provider store={store}>
    <SweatshirtPage/>
    
       </Provider>
    </>
  )
}

export default App
