import { useState } from "react";

const steps = [
  {
    message: "¡Hola! ¿Cómo puedo ayudarte?",
    options: [
      { label: "Ver productos", nextStep: 1 },
      { label: "Hablar con soporte", nextStep: 2 },
    ],
  },
];

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hola, soy un bot" },
    {
      sender: "user",
      text: "Hola, como estas mi nombre es ibrahim",
    },
  ]);
  const [input, setInput] = useState("");

  console.log(messages[messages.length - 1]);

  const sendMessageUser = () => {
    setMessages((prevState) => [...prevState, { sender: "user", text: input }]);
    setInput("");
  };
  const sendMessageBot = () => {
    if (messages[messages.length - 1]) {
    }
    setMessages((prevState) => [...prevState, { sender: "bot", text: input }]);
    setInput("");
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
                      ? "bg-gray-300 text-black"
                      : "bg-blue-500 text-white"
                  } rounded-lg p-2 text-sm max-w-[75%] mb-1 break-words`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className="flex-grow border border-black rounded-lg p-1 px-3 text-sm"
            />
            <button
              onClick={sendMessageUser}
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
