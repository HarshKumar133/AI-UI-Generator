export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
        ✨ Deterministic UI Generator
      </h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        Project initialized. Building components...
      </p>
    </main>
  );
}