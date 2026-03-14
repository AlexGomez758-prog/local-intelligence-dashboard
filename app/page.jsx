
export default function Page() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{fontSize:"40px"}}>
        Local & Global Intelligence Dashboard
      </h1>

      <p style={{fontSize:"18px"}}>
        A hub for local business owners to track local news,
        global events, and economic updates.
      </p>

      <div style={{marginTop:"30px"}}>
        <h2>Local Business Updates</h2>
        <p>Permits, zoning, traffic, retail, grants.</p>

        <h2>Global News</h2>
        <p>World economics, geopolitics, AI developments.</p>

        <h2>Memo Board</h2>
        <p>Save notes for consulting insights.</p>
      </div>
    </main>
  );
}
