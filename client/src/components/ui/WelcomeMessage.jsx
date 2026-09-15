function WelcomeMessage({ name, projectName }) {
  return (
    <p className="welcome-message">
      Welcome, <strong>{name}</strong>. You are working in {projectName}.
    </p>
  );
}

export default WelcomeMessage;