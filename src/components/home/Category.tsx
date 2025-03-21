function Category({ name }: { name: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-[var(--border-color)] p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer">
      <h3 className="text-lg font-medium text-[var(--text-primary)]">{name}</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Click to view details</p>
    </div>
  );
}

export { Category };
