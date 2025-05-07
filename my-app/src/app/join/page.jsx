import MenuBtn from "../components/MenuBtn/MenuBtn"

export default function Join() {
    return(
        <div className="relative h-screen flex flex-col justify-center items-center gap-10 before:bg-[url('/bg-join.jpg')] before:bg-no-repeat before:bg-cover before:content=[''] before:absolute before:inset-0 before:opacity-30 ">
        
        <div className="isolate">
            <div className="text-center mb-2.5">
                <h1 className="text-7xl">FakeQuizly</h1>
                <p className="text-2xl">Enter game pin to join</p>
            </div>
            <div className="bg-white p-5 rounded-md flex flex-col">
                <input className="bg-white text-gray-700 p-3.5 border-2 mb-2.5" type="password" placeholder="Game Code"></input>
                <MenuBtn className="w-full" text="Join Game" link="" />
            </div>

        </div>
        </div>
    )
}