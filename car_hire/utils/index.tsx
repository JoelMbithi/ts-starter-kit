import { CarCardProps, FilterProps } from "@/types";


export async function fetchCars(filters:FilterProps) { const { manufacturer, year, model, limit,fuel} = filters 
const headers = { 'x-rapidapi-key': '78d50a9ffemsha72d1b4d5963227p10c85djsndf08871d2df6', 'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com' }
 const response = await fetch(
   `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&fuel-type=${fuel}`,
   { headers: headers }
 )
   const result = await response.json()
   //console.log("API result:", result);
   return result; }


export const calculateCarRent = (city_mpg: number | string, year: number) => {
  const basePricePerDay = 50
  const mileageFactor = 0.1
  const ageFactor = 0.05

  // safely convert to number
  const mpg = Number(city_mpg) || 0

  const mileageRate = mpg * mileageFactor
  const ageRate = (new Date().getFullYear() - year) * ageFactor

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate
  return Math.round(rentalRatePerDay)
}


export const generateCarImageUrl = (car: CarCardProps , angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append("customer", "img");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", year.toString());

  if (angle) {
    url.searchParams.append("angle", angle);
  }

  return url.toString();
};


export const updateSearchParams = (type:string, value:string) => {
  const searchParams = new URLSearchParams(window.location.search)

      searchParams.set(type, value)

      const newPathname = `${window.location.pathname}?${searchParams.toString()}`
      
      return newPathname
}