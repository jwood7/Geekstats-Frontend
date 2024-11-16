export default function TeamPlayerCard() {
    return (
        <div className="flex drop-shadow bg-neutral-800 w-full h-fit rounded-xl text-white overflow-clip gap-2.5">
            <div className="bg-gold p-2.5">
                <div className="w-20 h-20 bg-neutral-500 my-auto rounded overflow-clip">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + "yakobay" + ".png"} alt="Yakobay"/> }</div>
            </div>
            <div className="w-full flex flex-col pt-2.5">
                <div className="text-xl font-bold">Yakobay</div>
                <div className="flex flex-row text-xs py-0.5 gap-1">
                    <div className="flex flex-col gap-2.5">
                        <div>Stat</div>
                        <div>Stat</div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <div>Stat</div>
                        <div>Stat</div>
                    </div>
                </div>
            </div>
        </div>
    )
}