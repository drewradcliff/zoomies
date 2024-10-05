import { Avatar } from "@radix-ui/react-avatar";
import { SendIcon } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const messages = [
  { id: 1, content: "ping", role: "user" },
  { id: 2, content: "pong", role: "bot" },
];

export default function Chat() {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Chat with Nano</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-center gap-3 pb-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role !== "user" && (
                <Avatar>
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback className="h-8 w-8">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-3xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="relative">
          <Input placeholder="Type your message..." />
          <Button
            variant="link"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
