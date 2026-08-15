import './Footer.css';

const footerLinks = [
  ['FAQ', 'Help Centre', 'Account', 'Media Centre'],
  ['Investor Relations', 'Jobs', 'Redeem Gift Cards', 'Buy Gift Cards'],
  ['Ways to Watch', 'Terms of Use', 'Privacy', 'Cookie Preferences'],
  ['Corporate Information', 'Contact Us', 'Speed Test', 'Legal Notices'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__contact">
          Questions? Call <a href="tel:000-800-919-1694">000-800-919-1694</a>
        </p>

        <nav className="footer__links">
          {footerLinks.flat().map((link) => (
            <a key={link} href="#" className="footer__link">
              {link}
            </a>
          ))}
        </nav>

        <div className="footer__lang">
          <span className="footer__lang-icon">🌐</span>
          <select className="footer__lang-select" defaultValue="en">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <p className="footer__copy">
          Netflix India
        </p>
      </div>
    </footer>
  );
}
