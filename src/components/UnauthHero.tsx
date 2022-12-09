import Image from "next/image";
import Link from "next/link";
import welcomeimage from "src/assets/background/welcome.png";
import moreThanTeam from "src/assets/more-than-team.svg";
import { Button } from "./common/Button";

export const UnauthHero = () => (
  <section id="hero" className="flex w-screen flex-col overflow-hidden">
    <div className="absolute  -z-30 h-[50vh] w-full">
      <Image
        src={welcomeimage}
        alt="fancy gradient background overflow-hidden"
        fill
        className="skew-y-[-20deg]"
      />
    </div>
    <div className="mx-auto flex h-screen w-full max-w-[1400px] flex-col-reverse items-center justify-center gap-10 px-10 pt-24 md:flex-row md:justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold md:text-7xl">
          <p>Winsze is more than app</p>
          <span className="block overflow-visible bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            This is a community
          </span>
          <span>to join all geeks</span>
        </h1>
        <Link href="/sign-up">
          <Button
            className="mt-4 w-max !rounded-full border-none px-10 py-4  transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-slate-100"
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
