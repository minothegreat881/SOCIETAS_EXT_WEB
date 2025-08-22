export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-stone-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          SOCIETAS
        </h1>
      </div>
      
      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl text-red-400">
            Rímske pomocné jednotky
          </h2>
          <p className="mb-4 text-stone-300">
            Spoločnosť historickej rekonštrukcie
          </p>
          <p className="text-stone-400">
            Stránka sa načítava... Backend URL: {process.env.NEXT_PUBLIC_STRAPI_URL}
          </p>
        </div>
      </div>
    </main>
  )
}