function Button({ children, onClick, type = "button", disabled = false, variant = "primary", ...props }) {
  return (
    <button className={`btn ${variant}`} type={type} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;