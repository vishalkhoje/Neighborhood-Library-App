import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        {children}
      </main>
      <footer className="page-footer">
        &copy; {new Date().getFullYear()} Neighborhood Library Service
      </footer>
    </div>
  );
}
