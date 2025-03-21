import { getGreeting } from "../utils/getGreeting";

function Category() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Category</h1>
      <p className="text-center">This is the category page</p>
    </main>
  );
}

const categoriasFarmacos = [
  "Antibióticos",
  "Antineoplásicos",
  "Antivirales",
  "Fármacos cardiovasculares",
  "Psicofármacos",
  "Antiinflamatorios y analgésicos",
];


function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-white"
    >
      <h1 className="text-xl font-bold mb-6">{getGreeting()}</h1>
      <p className="text-center">This is the home page</p>
    </main>
  );
}

export { Home };