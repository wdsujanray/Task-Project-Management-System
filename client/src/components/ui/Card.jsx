function Card({ children, title, description, className = "" }) {
  return (
    <article className={`card ${className}`.trim()}>
      {title && <h3>{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </article>
  );
}

export default Card;
