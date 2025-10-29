import HeroSection from "./component/Herosection";
import Products from "./component/Products";
import Promosection from "./component/Promosection";

export default function Home() {
  
  return (
    <div className="flex flex-col w-full pt-15">
      <HeroSection/>
      <Promosection/>
      <Products/>
    </div>
  );
}
