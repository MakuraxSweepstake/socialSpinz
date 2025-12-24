import GlassWrapper from "@/components/molecules/GlassWrapper";
import Dashboard from "@/components/pages/dashboard";
import UspSlider from "@/components/pages/dashboard/UspSlider";
import { getAllGames, getSubGames, getUsp } from "@/serverApi/game";
import { getBanners, getSubBanners } from "@/serverApi/pages";
import Image from "next/image";
import Link from "next/link";
import DashboardProvider from "./DashboardProvider";

export const dynamic = "force-dynamic";

export default async function Home() {
  let games = null;
  let gamesError = null;
  let usps = null;
  let uspError = null;
  let subGames = null;
  let subGamesError = null;
  let banners = null;
  let bannersError = null;
  let subBanners = null;
  let subBannersError = null;

  // Fetch everything individually
  try {
    games = await getAllGames();
  } catch (err) {
    console.error("❌ Failed to fetch games:", err);
    gamesError = "Failed to load games.";
  }

  try {
    usps = await getUsp();
  } catch (err) {
    console.error("❌ Failed to fetch USP:", err);
    uspError = "Failed to load USPs.";
  }

  try {
    subGames = await getSubGames();
  } catch (err) {
    console.error("❌ Failed to fetch sub games:", err);
    subGamesError = "Failed to load trending games.";
  }

  try {
    banners = await getBanners();
  } catch (err) {
    console.error("❌ Failed to fetch banners:", err);
    bannersError = "Failed to load banners.";
  }

  try {
    subBanners = await getSubBanners();
  } catch (err) {
    console.error("❌ Failed to fetch sub banners:", err);
    subBannersError = "Failed to load sub banners.";
  }

  // console.log(banners);
  return (
    <DashboardProvider>
      <>
        {/* <KycBanner /> */}
        {/* Banners */}
        {bannersError ? (
          <p className="text-red-500">{bannersError}</p>
        ) : banners?.data?.length ? (
          <Dashboard slides={banners.data} />
        ) : null}

        {/* Games */}
        {gamesError ? (
          <p></p>
        ) : games?.data?.data?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 mb-8">
            {games.data.data.map((game) => (
              <Link
                href={`exclusive-games/${game.id}`}
                key={game.id}
                className="col-span-1 "
              >
                <GlassWrapper>
                  <div
                    className="flex items-center gap-3 py-2 px-6 "
                  // style={{
                  //   borderRadius: "24px",
                  //   background: "rgba(255, 255, 255, 0.10)",
                  // }}
                  >
                    <Image
                      src={game.thumbnail || "/assets/images/fallback.png"}
                      alt={game.name}
                      width={74}
                      height={74}
                      className="aspect-[1/1] object-cover group-hover:scale-105 transition-transform duration-300 rounded-full"
                    />
                    <strong className="text-[14px]">{game.name}</strong>
                  </div>
                </GlassWrapper>
              </Link>
            ))}
          </div>
        ) : ""}

        {/* Trending Games */}
        <section className="trending__games">
          <h2 className="text-[14px] mb-4">Top 10 Trending Games</h2>
          {subGamesError ? (
            <p></p>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 mb-8">
              {subGames?.data?.map((game: any) => (
                <Link
                  href={`exclusive-games/${game.id}`}
                  key={ game.image_url}
                  className="col-span-1 relative aspect-[1/1]"
                >
                  <Image
                    src={game.image_url || "/assets/images/fallback.png"}
                    alt={game.name || ""}
                    fill
                    className="rounded-[24px] lg:rounded-[32px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sub Banners */}
        {subBannersError ? (
          <p></p>
        ) : subBanners?.data?.length ? (
          <div className="dashboard-card-wrapper flex flex-col lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 justify-center">
            {subBanners.data.map((subBanner, index) => (
              <GlassWrapper key={subBanner.name || index}
                className="dashboard-card1 col-span-1 flex justify-between px-10 gap-2 rounded-[24px]">
                <div className="py-7 gap-6">
                  {subBanner.name && (
                    <h1
                      className="text-[40px] mb-[8px]"
                      style={{
                        color: "#FBD230",
                        lineHeight: "96%",
                        letterSpacing: "-0.682px",
                      }}
                    >
                      {subBanner.name}
                    </h1>
                  )}
                  {subBanner.description && (
                    <p
                      className="text-[13px] mb-[12px]"
                      style={{ lineHeight: "120%", color: "#FBD230" }}
                    >
                      {subBanner.description}
                    </p>
                  )}
                  {subBanner.cta_link && (
                    <Link
                      href={subBanner.cta_link}
                      className="ss-btn px-[18px] py-[11px] rounded-[28px] inline-block"
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(270deg, #D620D9 0.09%, #B40EF0 95.19%)"
                            : "linear-gradient(270deg, #F9B901 0.09%, #D09F12 95.19%)",
                      }}
                      target="_blank"
                    >
                      Play Now
                    </Link>
                  )}
                </div>
                {subBanner.image_url && (
                  <div className="dashboard-card-img aspect-[245/245] hidden md:block">
                    <Image
                      src={subBanner.image_url}
                      alt={subBanner.name || "Sub Banner"}
                      className="h-auto max-w-full"
                      width={245}
                      height={245}
                    />
                  </div>
                )}
              </GlassWrapper>
            ))}
          </div>
        ) : null}

        {/* USP Slider */}
        {uspError ? (
          <p></p>
        ) : (
          <UspSlider uspData={usps?.data || []} />
        )}
      </>
    </DashboardProvider>
  );
}
