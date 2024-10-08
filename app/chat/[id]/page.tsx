"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { streamText, type CoreMessage } from "ai";
import { chromeai } from "chrome-ai";
import { SendIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Key } from "@/lib/constants";
import type { Trivia } from "@/lib/get-trivia-deck";

export default function Chat({ params }: { params: { id: string } }) {
  const [input, setInput] = useState("");
  const [deck] = useLocalStorage<Trivia[]>(Key.DECK, []);
  const card = deck.find((t) => t.id === params.id);
  const [messages, setMessages] = useState<CoreMessage[]>([
    {
      content: `Hello! I'm Nano, your personal assistant. Would you like to know more about ${card?.answer}?`,
      role: "assistant",
    },
  ]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
        system: `You are an assistant. Answer the user's questions about the answer to this trivia question: "Question: ${card?.question} Answer: ${card?.answer}"`,
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

  if (!card) return notFound();

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Chat with Nano</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 flex max-h-[75vh] min-h-full flex-col overflow-auto pr-4"
          ref={scrollAreaRef}
        >
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
        </div>
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
      </CardContent>
    </Card>
  );
}
