import { useState } from "react"
import Loader from "../../components/Loader"
import UsersNavbar from "../../components/UsersNavbar";


export default function UsersHome() {
  const [loading, setLoading] = useState(false);


  return (
    <>
      {loading ? (
        <Loader />
      ): (
        <>
          <UsersNavbar />
          <div>User's Home</div>
        </>
      )}
    </>
  )
}

