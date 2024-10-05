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
import { Key, Category } from "@/lib/constants";

const choices = Object.values(Category);

export default function Onboarding() {
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [, setInterests] = useLocalStorage<Category[]>(Key.INTERESTS, []);
  const router = useRouter();

  const handleInterestChange = (interest: Category) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInterests(selectedInterests);
    router.push("/");
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit}>
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
                  onCheckedChange={() => handleInterestChange(category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium leading-none capitalize"
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
