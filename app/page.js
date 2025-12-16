// app/page.js
import MainLayout from './components/MainLayout';
import Hero from './components/Hero';
import Whyis from './components/Whyis';
import HowItWorks from './components/HowItWorks';
import TeacherCTA from './components/TeacherCTA';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import ChatButton from './components/ChatButton';   
import ImagePage from './images'; // Import the ImagePage component
import CoachProfile from './CoachProfile';
import CertificatesPage from './components/CertificatesPage';


export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <HowItWorks />
      <ImagePage />
      <TeacherCTA />
      <CoachProfile/>
      <Whyis />
        <CertificatesPage />  
      <Pricing />
      <FAQ />
      <CTASection />
      
      

      {/* ⬅️ The chat button will appear bottom-right on your homepage */}
      <ChatButton />
    </MainLayout>
  );
}
