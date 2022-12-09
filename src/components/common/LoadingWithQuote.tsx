import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import loader from "src/assets/tail-spin.svg";

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

function getQuote() {
  return fetch("https://api.quotable.io/random").then(
    (res) => res.json() as Promise<Quote>
  );
}

export const LoadingWithQuote = () => {
  const { data } = useQuery(["quotes"], getQuote, {
    refetchInterval: 10000,
  });

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Image
        src={loader}
        alt="circular loader"
        role="presentation"
        className="h-24 w-24"
      />
      <div className="mx-auto mt-12 flex max-w-sm flex-col text-center">
        <p className="text-lg">{data?.content}</p>
        <p className="mt-4 font-semibold text-slate-700">{data?.author}</p>
      </div>
    </div>
  );
};
