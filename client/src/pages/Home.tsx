import Hero from "../components/home/Hero";
import ServiceBenefits from "../components/home/ServiceBenefits";
import ShopByCategory from "../components/home/ShopByCategory";
import BestSellers from "../components/home/BestSellers";
import PromoBanners from "../components/home/PromoBanners";
import TrustedBrands from "../components/home/TrustedBrands";
import Testimonials from "../components/home/Testimonials";
import EnquirySection from "../components/home/EnquirySection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceBenefits />
      <ShopByCategory />
      <BestSellers />
      <PromoBanners />
      <TrustedBrands />
      <Testimonials />
      <EnquirySection />
    </>
  );
}
