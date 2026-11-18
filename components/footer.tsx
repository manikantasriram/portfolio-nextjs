import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="foot-term" aria-hidden="true">
          <b>$</b> exit
          <span className="caret" />
        </p>
        <div className="foot-row">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <a href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
