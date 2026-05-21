import Footer from './components/Footer'
import Navbar from './components/Navbar'
import FilterSection from './components/filters/FilterSection'
import SearchResultsSection from './components/results/SearchResultsSection'
import SearchSection from './components/search/SearchSection'
import { SearchProvider } from './context/SearchContext'

const App = () => {
  return (
    <SearchProvider>
      <div className="flex min-h-svh flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <SearchSection />
          <FilterSection />
          <SearchResultsSection />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  )
}

export default App
