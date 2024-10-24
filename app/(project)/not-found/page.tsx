export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto p-4 px-8">
      <div className="p-4 grid place-items-center rounded-xl border border-dashed text-muted-foreground font-bold text-sm overflow-hidden">
        <h2 className="text-xl mb-2 text-foreground">
          The requested endpoint was not found!
        </h2>
        <p>Switch or create a new endpoint above.</p>
      </div>
    </main>
  );
}
