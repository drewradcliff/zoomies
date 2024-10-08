"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, Key } from "@/lib/constants";

const choices = Object.values(Category);

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [, setInterests] = useLocalStorage<Category[]>(Key.INTERESTS, []);

  return (
    <Card className="mx-auto w-full max-w-lg">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setInterests(selectedInterests);
          router.replace("/");
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome aboard!</CardTitle>
          <CardDescription>
            Select your interests to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {choices.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedInterests.includes(category)}
                  onCheckedChange={() => {
                    setSelectedInterests((prev) =>
                      prev.includes(category)
                        ? prev.filter((interest) => interest !== category)
                        : prev.concat(category),
                    );
                  }}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium capitalize leading-none"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
