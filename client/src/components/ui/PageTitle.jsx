function PageTitle({ title, subtitle }) {
  return (
    <header className="page-title">
      <p className="eyebrow">Workspace</p>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export default PageTitle;
