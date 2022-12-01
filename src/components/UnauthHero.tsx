import Image from "next/image";
import Link from "next/link";
import welcomeimage from "src/assets/background/welcome.png";
import moreThanTeam from "src/assets/more-than-team.svg";
import { Button } from "./common/Button";

export const UnauthHero = () => (
  <section id="hero" className="flex w-screen flex-col overflow-hidden">
    <div className="absolute -top-[40vh] -z-30 h-screen w-full">
      <Image
        src={welcomeimage}
        alt="fancy gradient background overflow-hidden"
        fill
        className="skew-y-[-20deg]"
      />
    </div>
    <div className="mx-auto flex h-screen w-full max-w-[1400px] items-center justify-between gap-10">
      <div className="flex flex-col">
        <h1 className="text-7xl font-bold">
          <p>Winsze is more than app</p>
          <span className="block overflow-visible bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            This is a community
          </span>
          <span>to join all geeks</span>
        </h1>
        <Link href="/sign-up">
          <Button
            className="mt-4 w-max rounded-full px-10 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500"
            variant="secondary"
          >
            Join us
          </Button>
        </Link>
      </div>
      <Image src={moreThanTeam} alt="team" width={500} height={500} />
    </div>
  </section>
);
