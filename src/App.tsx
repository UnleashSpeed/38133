import { Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import HomePage from '../app/page'
import Clause7Page from '../app/clause7/page'
import Clause8Page from '../app/clause8/page'
import Clause9Page from '../app/clause9/page'
import AboutPage from '../app/about/page'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clause7" element={<Clause7Page />} />
        <Route path="/clause8" element={<Clause8Page />} />
        <Route path="/clause9" element={<Clause9Page />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}
