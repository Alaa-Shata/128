import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ContinuousBackdrop from "@/components/ContinuousBackdrop";
import CoffeeStream from "@/components/CoffeeStream";
import ProductJourney from "@/components/ProductJourney";
import BrandIntro from "@/components/BrandIntro";
import MenuUniverse from "@/components/MenuUniverse";
import Experience from "@/components/Experience";
import BigMoment from "@/components/BigMoment";
import VisitContact from "@/components/VisitContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <ContinuousBackdrop />
      {/* the coffee poured by the opening cup — flows behind every chapter down to the 128 moment */}
      <CoffeeStream />
      <main id="top">
        {/* Chapters 1–3: one continuous pinned composition (opening → product world → featured) */}
        <ProductJourney />
        <BrandIntro />
        <Experience />
        <BigMoment />
        <MenuUniverse />
        <VisitContact />
      </main>
      <Footer />
    </>
  );
}
