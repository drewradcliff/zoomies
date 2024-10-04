"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            onClick={handleFlip}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-64 p-6 flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              {!isFlipped ? (
                <p className="text-xl text-center">
                  {flashcards[currentIndex].definition}
                </p>
              ) : (
                <p
                  className="text-3xl font-bold text-center"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {flashcards[currentIndex].term}
                </p>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
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
        <p className="text-center mt-4 text-sm text-gray-600">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>
    </div>
  );
}
