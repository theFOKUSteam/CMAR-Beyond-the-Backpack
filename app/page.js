import Hero from "@/components/Hero";
import EventInfo from "@/components/EventInfo";
import Services from "@/components/Services";
import ImportantInfo from "@/components/ImportantInfo";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <EventInfo />
      <Services />
      <ImportantInfo />

      <section id="register" className="register-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Register Now</span>
            <h2>Reserve Your Spot for Beyond the Backpack</h2>
            <p>
              Fill out the form below for your child. Fields marked with{" "}
              <span className="req">*</span> are required.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
