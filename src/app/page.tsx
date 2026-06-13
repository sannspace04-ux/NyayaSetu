import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import Testimonials from "@/components/landing/Testimonials";
import Statistics from "@/components/landing/Statistics";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Statistics />
        <About />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
