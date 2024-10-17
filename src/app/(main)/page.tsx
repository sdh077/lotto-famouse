import BestShop from "@/page/BestShop";
import LatestLotto from "@/page/LatestLotto";
import LocationInfo from "@/page/LocationInfo";

const getData = async () => {
  return await fetch(`https://lotto-famous.vercel.app/api/init`).then(res => res.json()).catch(() => 1141)
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