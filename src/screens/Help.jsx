import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { CHAT } from "../data/assistant.js";
import chevron from "../assets/icon-chevron.svg";
import sendIcon from "../assets/icon-send.svg";

/* The assistant. The conversation opens on the exchange the frame draws and
   goes on from there: what is typed is matched against the topics the
   assistant knows and answered from the same fare table the rest of the app
   reads, so it cannot quote a figure the app would contradict. Most answers
   end on the row that opens the screen which does the thing. */
function Bubble({ message, onAction }) {
  const mine = message.from === "user";
  return (
    <div className={"chat-bubble " + (mine ? "chat-bubble--mine" : "chat-bubble--theirs")}>
      <p className="chat-lines">
        {message.lines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </p>
      {message.action && (
        <button type="button" className="chat-action" onClick={() => onAction?.(message.action.to)}>
          <span className="chat-action-what">
            <span className="chat-action-label">{message.action.label}</span>
            <span className="chat-action-sub">{message.action.sub}</span>
          </span>
          <img src={chevron} alt="" width="7" height="12" />
        </button>
      )}
    </div>
  );
}

export default function Help({ messages = CHAT, draft, onDraft, onSend, onBack, onAction, onPerson }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Account" />

      <div className="scr-body">
        <h1 className="scr-title">Help</h1>
        <p className="chat-who">Compass Assistant</p>

        <div className="chat-stack">
          {messages.map((message, i) => (
            <Bubble key={i} message={message} onAction={onAction} />
          ))}
        </div>
      </div>

      <div className="chat-footer">
        <Button tone="secondary" onClick={onPerson}>
          Talk to a Person
        </Button>
        <form
          className="chat-bar"
          onSubmit={(e) => {
            e.preventDefault();
            onSend?.();
          }}
        >
          <div className="chat-field">
            <input
              className="chat-input"
              type="text"
              placeholder="Message"
              value={draft}
              onChange={(e) => onDraft?.(e.target.value)}
            />
          </div>
          <button type="submit" className="chat-send" aria-label="Send">
            <img src={sendIcon} alt="" width="18" height="18" />
          </button>
        </form>
      </div>

      <HomeIndicator />
    </div>
  );
}
