import { useState } from "react";

const TRIGGERS = {
  saludo: ["hola", "buenos dias", "buenas tardes"],
  despedida: ["adios", "hasta luego"],
  opciones: ["opciones", "ver mas"],
};

const FLOWS = {
  saludo: {
    message: "¡Hola! soy un bot, ¿Cómo te puedo ayudar?",
    options: ["Ver opciones", "Nada, gracias"],
    nextFlows: { "Ver opciones": "opciones", "Nada, gracias": null },
  },
  opciones: {
    message: "Aquí tienes las opciones:",
    options: ["Clima", "Noticias", "Soporte Técnico"],
    nextFlows: {
      Clima: "clima",
      Noticias: "noticias",
      "Soporte Técnico": "soporte",
    },
  },
  clima: { message: "El clima hoy es soleado.", options: [], nextFlows: {} },
  noticias: {
    message: "Aquí están las noticias del día.",
    options: [],
    nextFlows: {},
  },
  soporte: {
    message: "Conéctandote al soporte técnico...",
    options: [],
    nextFlows: {},
  },
};

const findTrigger = (message) => {
  for (const trigger in TRIGGERS) {
    if (
      TRIGGERS[trigger].some((word) => message.toLowerCase().includes(word))
    ) {
      return trigger;
    }
  }
  return null;
};

const initialMessage = {
  sender: "bot",
  message: "Hola, Soy un bot en que nesecitas que te ayude",
};

function App() {
  const [flow, setFlow] = useState();
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");

  const handleClick = (nextStep) => {
    const newFlow = FLOWS[nextStep];
    if (newFlow) {
      setFlow(nextStep);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: newFlow.message },
      ]);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setInput("");

      const trigger = findTrigger(userMessage);
      if (trigger) {
        botResponse(trigger);
      } else {
        setMessages([
          ...messages,
          { text: userMessage, sender: "user" },
          { text: "No entiendo lo que me dices", sender: "bot" },
        ]);
      }
    }
  };

  const botResponse = (trigger) => {
    const newFlow = FLOWS[trigger];
    if (newFlow) {
      setFlow(trigger);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: newFlow.message },
      ]);
    }
  };

  return (
    <>
      <main className="grid place-content-center h-screen">
        <h1 className="text-center">CHAT-BOT</h1>
        <section className="w-[350px] h-[500px] border border-black rounded-3xl flex flex-col p-5">
          <div className="flex-grow">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`${
                    message.sender === "bot"
                      ? "bg-gray-300 text-black rounded-bl-none"
                      : "bg-blue-500 text-white rounded-br-none"
                  } rounded-xl p-2 text-sm max-w-[75%] mb-1 break-words`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div className="mb-1 flex gap-2">
              {flow &&
                FLOWS[flow]?.options?.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleClick(FLOWS[flow].nextFlows[option])}
                    className="p-1 px-2 text-sm bg-blue-600 rounded-3xl text-white hover:bg-blue-700 transition-colors"
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className="flex-grow border border-black rounded-lg p-1 px-3 text-sm"
            />
            <button
              onClick={sendMessage}
              className="border border-black rounded-lg p-1 px-3 text-sm mt-auto"
            >
              Enviar
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
