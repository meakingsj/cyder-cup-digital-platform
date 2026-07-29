import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./App.css";

function App() {
  return (
    <div className="site-shell">
      <Header />

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <p className="eyebrow">The tradition continues</p>

            <h1>
              Cyder
              <span>Cup</span>
            </h1>

            <p className="hero-subtitle">
              The official digital home of Team Navy versus Team Red.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#live">
                View Live Event
              </a>

              <a className="button button-secondary" href="#history">
                Explore History
              </a>
            </div>
          </div>

          <aside className="event-card" aria-label="Upcoming tournament">
            <p className="event-label">Next Event</p>
            <p className="event-year">2026</p>

            <div className="team-matchup">
              <span>Team Navy</span>
              <strong>VS</strong>
              <span>Team Red</span>
            </div>

            <p className="event-status">Tournament details coming soon</p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;