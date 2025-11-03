import ProductList from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const SweatshirtPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className=""></div>
      <div className="flex-1 p-6 pl-0 pr-0 ">
        <Header  />
        <div className=""></div>
        <ProductList />
      </div>
    </div>
  );
};

export default SweatshirtPage;
