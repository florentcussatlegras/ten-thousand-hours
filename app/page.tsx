import { Hero } from "@/components/hero";
import SearchBarHomepage from "@/components/search-bar-homepage";
import * as actions from "@/app/actions/actions";

const imageHero = "/hand-drawn-resignation-illustration.png";

export default async function Home() {
  const topics: any[] = await actions.getListTopics();

  return (
    <section className="flex items-center h-full justify-center gap-4 bg-white dark:bg-dark-bg w-full p-0 m-0">
      <div className="flex flex-row w-full h-full items-stretch justify-between">
        <div className="hidden xl:w-1/2 items-center xl:flex justify-center"> 
          {/* Dark */}
          <div className="block">
            <Hero
              imageUrl={imageHero}
              imageAlt="Books and watches on a desk (dark)"
            />
          </div>
        </div>
        <div className="w-full 2xl:w-1/2 h-full flex flex-col gap-10 items-center xl:items-start justify-center ml-0 xl:ml-18 2xl:ml-0">
          <div className="flex flex-col gap-4 sm:px-0 sm:mx-0 w-[350px] sm:w-[600px] md:w-[700px] lg:w-[950px] xl:w-full 2xl:w-3/4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-4xl 2xl:text-5xl font-bold text-default-600 dark:text-white/90 text-wrap">
              Quel domaine souhaitez-vous{" "}
              <span className="text-sky-500">maîtriser</span> ?
            </h1>
            <SearchBarHomepage topics={topics} />
          </div>
        </div>
      </div>
    </section>
  );
}
