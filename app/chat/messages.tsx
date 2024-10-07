"use client";

import { useState } from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { streamText, type CoreMessage } from "ai";
import { chromeai } from "chrome-ai";
import { SendIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Messages = () => {
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const answer = searchParams.get("answer");
  const [messages, setMessages] = useState<CoreMessage[]>([
    {
      content: `Hello! I'm Nano, your personal assistant. Would you like to know more about ${answer}?`,
      role: "assistant",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setMessages(newMessages);
    setInput("");
    try {
      const { textStream } = await streamText({
        model: chromeai(),
        system:
          "You are an assistent. Answer the user's questions about " + answer,
        prompt: "User: " + input,
      });
      let t = "";
      for await (const message of textStream) {
        t = t.concat(message);
        setMessages([...newMessages, { content: t, role: "assistant" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <ScrollArea className="mb-4 flex max-h-[75vh] min-h-full flex-col pr-4">
        {messages.map(({ content, role }, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 pb-4 ${
              role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {role !== "user" && (
              <Avatar>
                <AvatarImage src="/ai-avatar.png" alt="AI" />
                <AvatarFallback className="h-8 w-8">AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-3xl px-4 py-2 ${
                role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {content as string}
            </div>
            {role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>
      <form className="relative" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="submit"
          variant="link"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </form>
    </>
  );
};
