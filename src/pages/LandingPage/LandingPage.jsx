import LandingNavbar from '../../components/Navbar/LandingNavbar';
import LandingHero from '../../components/HeroBanner/LandingHero';
import FAQ from '../../components/FAQ/FAQ';
import Footer from '../../components/Footer/Footer';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <LandingNavbar />
      <LandingHero />
      <FAQ />
      <Footer />
    </div>
  );
}
