"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Key, type Category } from "@/lib/constants";
import { getCards } from "@/lib/get-trivia-deck";

export default function HomePage() {
  const [interests] = useLocalStorage<Category[]>(Key.INTERESTS, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  const query = useQuery({
    enabled: !!interests?.length,
    queryKey: ["cards"],
    queryFn: () => getCards(5, interests),
  });

  useEffect(() => {
    if (!!interests?.length) return;
    router.push("/onboarding");
  }, [interests, router]);

  if (query.isPending) {
    return <p className="text-center">loading...</p>;
  }

  if (query.isError) {
    console.error(query.error);
    return (
      <p className="text-center">
        oops! something went wrong. check the console...
      </p>
    );
  }

  return (
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
                {query.data[currentIndex]?.question}
                <br />
                <span className="text-sm text-gray-600">
                  {query.data[currentIndex]?.category}
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
                {query.data[currentIndex]?.answer}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        <Button
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
          }}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          disabled={currentIndex === query.data.length - 1}
          onClick={() => {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
          }}
        >
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        {`${currentIndex + 1} of ${query.data.length}`}
      </p>
    </div>
  );
}
