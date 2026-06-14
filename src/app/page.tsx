import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Statistics from "@/components/landing/Statistics";
import About from "@/components/landing/About";
import Testimonials from "@/components/landing/Testimonials";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import FloatingChat from "@/components/shared/FloatingChat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero — 2-column layout with chat preview */}
        <Hero />
        {/* 2. Quick access panels */}
        <Features />
        {/* 3. Scrolling legal areas carousel */}
        <HowItWorks />
        {/* 4. Platform stats */}
        <Statistics />
        {/* 5. Mission / pillars */}
        <About />
        {/* 6. Emergency helplines */}
        <Testimonials />
        {/* 7. CTA */}
        <CallToAction />
      </main>
      <Footer />
      {/* Floating chatbot button — always visible */}
      <FloatingChat />
    </>
  );
}
