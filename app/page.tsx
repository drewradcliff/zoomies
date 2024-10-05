"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFlashcards } from "@/lib/get-flashcards";

const interests = ["science", "music", "technology"] as const;

export default function Home() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getFlashcards>>>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFlashcards(5, interests)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

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
            onClick={() => {
              setIsFlipped(!isFlipped);
            }}
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
                  {data?.[currentIndex]?.question}
                  <br />
                  <span className="text-sm text-gray-600">
                    {data?.[currentIndex]?.category}
                  </span>
                </p>
              </div>
              <div
                className="absolute flex h-full w-full items-center justify-center rounded-xl bg-white p-6 shadow-lg backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-center text-3xl font-bold">
                  {data?.[currentIndex]?.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between">
          <Button
            disabled={!data || currentIndex === 0}
            onClick={() => {
              setCurrentIndex(currentIndex - 1);
              setIsFlipped(false);
            }}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            disabled={!data || currentIndex === data.length - 1}
            onClick={() => {
              setCurrentIndex(currentIndex + 1);
              setIsFlipped(false);
            }}
          >
            Next <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          {loading
            ? "loading..."
            : !data
              ? `error... ${error}`
              : `${currentIndex + 1} of ${data.length}`}
        </p>
      </div>
    </div>
  );
}
