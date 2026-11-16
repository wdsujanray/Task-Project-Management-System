import Dev from "../common/Dev";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© 2026 TaskFlow</span>
        <div className="dev">
          <p>Developed by <Dev /></p>
        </div>
        <span>Project management made simple</span>
      </div>
    </footer>
  );
}

export default Footer;