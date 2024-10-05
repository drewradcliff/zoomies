"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const flashcards = [
  {
    id: 1,
    term: "React",
    definition: "A JavaScript library for building user interfaces",
  },
  { id: 2, term: "Component", definition: "A reusable piece of UI in React" },
  {
    id: 3,
    term: "State",
    definition: "An object that holds data that may change over time",
  },
  {
    id: 4,
    term: "Props",
    definition: "Arguments passed into React components",
  },
  {
    id: 5,
    term: "Hook",
    definition:
      "Functions that let you use state and other React features without writing a class",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative h-64 w-full"
            onClick={handleFlip}
          >
            <motion.div
              className="absolute h-full w-full"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-white p-6 shadow-lg backface-hidden">
                <p className="text-center text-xl">
                  {flashcards[currentIndex]?.definition}
                </p>
              </div>
              <div
                className="absolute flex h-full w-full items-center justify-center rounded-xl bg-white p-6 shadow-lg backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-center text-3xl font-bold">
                  {flashcards[currentIndex]?.term}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            Next <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>
    </div>
  );
}
