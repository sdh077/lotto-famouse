import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import BestShop from "@/pages/BestShop";
import LatestLotto from "@/pages/LatestLotto";
import LocationInfo from "@/pages/LocationInfo";

const getData = async () => {
  return await fetch(`${NEXT_PUBLIC_API_URL}/api/init`).then(res => res.json())
}

export default async function Home() {
  const { latestNo } = await getData()
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 container pt-8 h-full">
      <div className='flex flex-col gap-4'>
        <LatestLotto latestNo={latestNo} />
        <LocationInfo />
      </div>
      <BestShop />
    </div>
  );
}