import { Suspense } from "react";
import { Messages } from "@/app/chat/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Chat() {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Chat with Nano</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense>
          <Messages />
        </Suspense>
      </CardContent>
    </Card>
  );
}
