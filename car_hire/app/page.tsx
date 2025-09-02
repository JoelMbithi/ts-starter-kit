import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/utils";
import Image from "next/image";

type SearchParams = {
  manufacturer?: string;
  year?: number;
  fuel?: string;
  limit?: number;
  model?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams; // 👈 FIX

  const allCars = await fetchCars({
    manufacturer: params.manufacturer || "",
    year: params.year || 2025,
    fuel: params.fuel || "",
    limit: params.limit || 20,
    model: params.model || ""
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  return (
    <div className="overflow-hidden">
     
     <Hero/>

     <div className="mt-12 mb-8  px-12 py-4 max-width " id="discover">
      <div className=" flex flex-col items-start justify-start gap-y-2.5 text-black">
        <h1 className="text-4xl font-extrabold">
          Car Cataloque
        </h1>
        <p className="text-gray-600">Find Your Dream cars of your choice</p>
      </div>

      <div className="mt-12 w-full  flex justify-between items-center flex-wrap gap-5">
        <SearchBar/>

        <div className="flex justify-start flex-wrap items-center gap-2">
          <CustomFilter title="fuel" options={fuels}/>
           <CustomFilter title="year" options={yearsOfProduction}/>
          
        </div>
      </div>

      {!isDataEmpty ? (
        <section>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8 pt-14">
            {allCars?.map((car,index) => (
              <CarCard key={index} car={car}/>
            ))}
          </div>
        </section>

      ): (
        <div className="mt-16 flex justify-center items-center flex-col gap-2">
          <h2 className="text-black text-xl font-bold"> Oops, no results</h2>
          <p>{allCars?.message}</p>

        </div>
      )}

     </div>
     <ShowMore
     pageNumber={(searchParams.pageNumber || 10) / 10}
     isNext = {(searchParams.limit || 10) > allCars.length}
     />
    </div>
  );
}
