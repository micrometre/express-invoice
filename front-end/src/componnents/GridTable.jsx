export default function GridTable() {
    return (
        <div>

            <div
                className="container m-auto grid grid-cols-3 grid-rows-5 gap-4 md:grid-cols-5 lg:grid-cols-8"
            >
                <div className="tile col-span-full bg-teal-500">
                    <h1 className="tile-marker">ONE</h1>
                </div>
                <div
                    className="tile col-span-1 row-start-2 row-end-5 bg-amber-500 md:col-span-2 lg:col-span-3"
                >
                    <h1 className="tile-marker">TWO</h1>
                </div>
                <div
                    className="tile col-span-2 row-start-4 row-end-5 bg-yellow-500 md:col-span-3 md:row-start-2 md:row-end-3 lg:col-span-5"
                >
                    <h1 className="tile-marker">THREE</h1>
                </div>
                <div className="tile bg-lime-600 lg:col-span-2 lg:col-start-4">
                    <h1 className="tile-marker">FOUR</h1>
                </div>
                <div className="tile bg-green-600">
                    <h1 className="tile-marker">FIVE</h1>
                </div>
                <div className="tile bg-emerald-500">
                    <h1 className="tile-marker">SIX</h1>
                </div>
                <div className="tile bg-teal-500">
                    <h1 className="tile-marker">SEVEN</h1>
                </div>
                <div className="tile bg-purple-500">
                    <h1 className="tile-marker">EIGHT</h1>
                </div>
                <div className="tile row-start-5 bg-pink-500 md:col-span-full">
                    <h1 className="tile-marker">NINE</h1>
                </div>
            </div>





        </div>
    )
}