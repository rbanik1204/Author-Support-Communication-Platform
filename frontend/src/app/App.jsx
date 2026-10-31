import { Outlet, useNavigation } from "react-router"
import PageLoader from "../components/common/PageLoader"

function App() {
  const navigation = useNavigation()

  const isNavigating = navigation.state !== "idle"

  return (
    <>
      {isNavigating && <PageLoader />}
      <Outlet />
    </>
  )
}

export default App
