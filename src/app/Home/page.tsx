import HeroSection from "./component/Herosection";
import News from "./component/News";
import Products from "./component/Products";
import Promosection from "./component/Promosection";

export default function Home() {
  
  return (
    <div className="flex flex-col w-full pt-7 md:pt-10">
      <HeroSection newsCarouselSlot={<News />} />
      <Promosection/>
      <Products/>
    </div>
  );
}
