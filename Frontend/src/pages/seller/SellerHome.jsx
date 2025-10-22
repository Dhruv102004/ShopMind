import SellerNavbar from "../../components/SellerNavbar"

function SellerHome() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black">
        <SellerNavbar/>
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Welcome Seller</h2>
            </div>

        </div>
    </div>
  )
}

export default SellerHome