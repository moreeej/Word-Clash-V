import { useNavigate } from "react-router-dom";

export default function ValentinesHome() {
  const navigate = useNavigate();

  function handleProceed() {
    navigate("/game");
  }

  return (
    <div className="valentines-container">
      <div className="hearts">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="heart"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            ❤️
          </div>
        ))}
      </div>
      <div className="content">
        <h1 className="greeting">Happy Valentine's Day, My Love!</h1>
        <p className="message">
          You are the light of my life, the beat in my heart, and the reason I
          smile every day. I love you more than words can say. ❤️
        </p>
        <button className="love-button" onClick={handleProceed}>
          Click for More Love
        </button>
      </div>
    </div>
  );
}
