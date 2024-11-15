export default function WeeklyMap() {
    return (
        <div className="flex drop-shadow bg-neutral-200 w-full h-fit px-2 rounded content-center">
            <div className="w-11 bg-neutral-500 my-auto mr-1.5">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + "yakobay" + ".png"} alt="JingShen"/> }</div>
            <div className="w-full flex justify-between">
                <div>
                    <p className="font-bold text-4">de_jingshen</p>
                    <p className="text-3">CT win rate: 50%</p>
                </div>
                <div>
                    <div>stars</div>
                    <div>badges</div>
                </div>
            </div>
        </div>
    )
}