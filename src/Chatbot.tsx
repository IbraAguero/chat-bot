import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import CloseIcon from "./CloseIcon";
import MessageIcon from "./MessageIcon";
import { AnimatePresence, motion } from "framer-motion";

const FLOWS = {
  bienvenida: {
    message: ["¡Hola! soy un bot", "¿Cómo te puedo ayudar?"],
    options: ["Ver productos", "Hablar con soporte"],
    triggers: ["hola", "buenos dias", "buen dia", "buenas tardes"],
    nextFlows: {
      "Ver productos": "productos",
      "Hablar con soporte": "soporte",
    },
  },
  productos: {
    message: ["Aquí tienes las opciones de productos:"],
    options: ["Buzos", "Remeras", "Pantalones", "Camperas"],
    triggers: ["productos", "ver productos"],
    nextFlows: {
      Buzos: "buzos",
      Remeras: "remeras",
      Pantalones: "pantalones",
      Camperas: "camperas",
    },
  },
  camperas: {
    message: ["Has seleccionado Camperas."],
    options: [],
    triggers: ["camperas"],
    nextFlows: {},
  },
  buzos: {
    message: ["Has seleccionado Buzos."],
    options: [],
    triggers: ["buzos"],
    nextFlows: {},
  },
  remeras: {
    message: ["Has seleccionado Remeras."],
    options: [],
    triggers: ["remeras"],
    nextFlows: {},
  },
  soporte: {
    message: ["Conectándote al soporte técnico..."],
    options: [],
    triggers: ["soporte", "hablar con soporte"],
    nextFlows: {},
  },
  despedida: {
    message: ["Hasta luego, espero que tengas un buen día."],
    options: [],
    triggers: ["adios", "hasta luego", "chau"],
    nextFlows: {},
  },
  desconocido: {
    message: [
      "No entiendo lo que me dices",
      "prueba con algunas de estas opciones.",
    ],
    options: ["Ver productos", "Hablar con soporte"],
    nextFlows: {
      "Ver productos": "productos",
      "Hablar con soporte": "soporte",
    },
  },
};

const findTrigger = (message: string) => {
  for (const flowKey in FLOWS) {
    const flow = FLOWS[flowKey];
    if (
      flow.triggers &&
      flow.triggers.some((word: string) => message.toLowerCase().includes(word))
    ) {
      return flowKey;
    }
  }
  return null;
};

type Message = {
  sender: "bot" | "user";
  text: string;
};

function Chatbot({ initialFlow }) {
  const [flow, setFlow] = useState<string | null>(initialFlow);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages, flow, showOptions]);

  useEffect(() => {
    addMessagesWithDelay(FLOWS[initialFlow].message);
  }, [initialFlow]);

  const handleClick = (option: string) => {
    const nextStep = FLOWS[flow].nextFlows[option];
    const newFlow = FLOWS[nextStep];
    if (newFlow) {
      setMessages((prev) => [...prev, { sender: "user", text: option }]);
      setShowOptions(false);
      setFlow(nextStep);
      addMessagesWithDelay(newFlow.message);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      setFlow(null);
      const userMessage = input.trim();
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setInput("");

      const trigger = findTrigger(userMessage);
      if (trigger) {
        botResponse(trigger);
      } else {
        setFlow("desconocido");
        botResponse("desconocido");
      }
    }
  };

  const botResponse = (trigger: string) => {
    const newFlow = FLOWS[trigger];
    if (newFlow) {
      setShowOptions(false);
      addMessagesWithDelay(newFlow.message);
      setFlow(trigger);
    }
  };

  const addMessagesWithDelay = (messagesArray: string[]) => {
    messagesArray.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: message }]);

        if (index === messagesArray.length - 1) {
          setTimeout(() => {
            setShowOptions(true);
          }, 500);
        }
      }, 1000 * (index + 1));
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <main className="grid place-content-center h-screen">
      <AnimatePresence>
        {showChat && (
          <motion.section
            initial={{ opacity: 0, height: "0px" }}
            animate={{ opacity: 1, height: "500px" }}
            exit={{ opacity: 0, height: "0px" }}
            className="fixed right-4 bottom-20 w-[350px] h-[500px] rounded-xl shadow-[0px_20px_60px_rgba(0,0,0,_0.5)] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 px-6 rounded-t-xl bg-gradient-to-r from-cyan-500 to-blue-500">
              <h1 className=" font-bold text-white text-xl ">Bot Ibra</h1>
            </div>
            <div className="py-4 px-4 flex-grow overflow-y-auto rounded-md flex flex-col gap-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`animation ${
                      message.sender === "bot"
                        ? "bg-gray-300 text-black rounded-bl-none"
                        : "bg-blue-500 text-white rounded-br-none my-1.5"
                    } rounded-lg p-2 px-3 shadow-[0px_4px_12px_rgba(0,0,0,_0.3)] text-sm font-normal max-w-[85%] break-words`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {showOptions && (
                <div className="flex flex-col gap-2">
                  {flow &&
                    FLOWS[flow]?.options?.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleClick(option)}
                        className="animation p-2 px-5 w-fit text-sm font-medium rounded-lg border border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            <div>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex gap-2 py-4 border-t-2 border-blue-600 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Escribí acá.."
                  className="flex-grow rounded-lg text-sm font-medium px-2 outline-none"
                />
                <button>
                  <MessageIcon />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-blue-500 w-12 h-12 rounded-full grid place-content-center text-white transition-colors"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: showChat ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {showChat ? <CloseIcon /> : <ChatbotIcon />}
        </motion.div>
      </button>
    </main>
  );
}

export default Chatbot;
