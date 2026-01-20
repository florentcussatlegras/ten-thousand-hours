import { Hero } from "@/components/hero";

const urlImageHero = '/hand-drawn-resignation-illustration.png';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className="flex items-center h-full justify-center gap-4 bg-white dark:bg-dark-bg">
        <div className="flex flex-row w-full h-full items-stretch justify-center">
            <div className="hidden lg:w-1/2 items-center lg:flex justify-center">
                <Hero imageUrl={urlImageHero} imageAlt="Books and watches on a desk" />
            </div>
            <div className="w-full lg:w-1/2 items-center flex mr-0">
                {children}
            </div>
        </div>
      </section>
    );
}
