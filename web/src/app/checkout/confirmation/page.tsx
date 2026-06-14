import Link from "next/link";

export default function CheckoutConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your reservation. A confirmation email has been sent to your inbox.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 text-left">
          <h3 className="font-bold text-gray-900 mb-2">What's next?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Download your VectoMatrix mobile app.</li>
            <li>✅ Your digital itinerary and tickets are synced automatically.</li>
            <li>✅ The travel agency will contact you shortly.</li>
          </ul>
        </div>

        <Link 
          href="/"
          className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
