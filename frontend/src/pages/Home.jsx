import About from "../components/About";
import Action from "../components/Action";
import FeaturedDoctors from "../components/FeaturedDoctors";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Specializations from "../components/Specializations";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <About/>
      <WhyChooseUs/>
      <Specializations/>
      <FeaturedDoctors/>
      <Testimonials/>
      <Action/>
      <Footer/>
    </>
  );
};

export default Home;
