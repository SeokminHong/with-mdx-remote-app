import React from "react";
import { getNextLocale, setLocale } from "../utils/locale";

const changeLocale = () => {
  setLocale(getNextLocale());
  history.go(0);
};

export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <div>
        <button onClick={changeLocale}>Change Locale</button>
      </div>
      <div className="wrapper">{children}</div>
      <style jsx>{`
        .wrapper {
          max-width: 36rem;
          margin: 0 auto;
          padding: 1.5rem;
        }
      `}</style>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }

        :root {
          --site-color: royalblue;
          --divider-color: rgba(0, 0, 0, 0.4);
        }

        html {
          font: 100%/1.5 system-ui;
        }

        a {
          color: inherit;
          text-decoration-color: var(--divider-color);
          text-decoration-thickness: 2px;
        }

        a:hover {
          color: var(--site-color);
          text-decoration-color: currentcolor;
        }

        h1,
        p {
          margin-bottom: 1.5rem;
        }

        code {
          font-family: "Menlo";
        }
      `}</style>
    </>
  );
}
