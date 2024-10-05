"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const interests = [
  { id: "science", label: "Science" },
  { id: "math", label: "Math" },
  { id: "history", label: "History" },
  { id: "literature", label: "Literature" },
  { id: "art", label: "Art" },
  { id: "music", label: "Music" },
  { id: "technology", label: "Technology" },
  { id: "sports", label: "Sports" },
];

export default function Onboarding() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const router = useRouter();

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userInterests", JSON.stringify(selectedInterests));
    router.push("/");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome aboard!</CardTitle>
          <CardDescription>
            Select your interests to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {interests.map((interest) => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox
                  id={interest.id}
                  checked={selectedInterests.includes(interest.id)}
                  onCheckedChange={() => handleInterestChange(interest.id)}
                />
                <label
                  htmlFor={interest.id}
                  className="text-sm font-medium leading-none"
                >
                  {interest.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Complete Onboarding
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
