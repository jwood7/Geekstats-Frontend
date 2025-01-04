export default function PercentBar({colorFore, colorBack, hoverText, percent}: {colorFore: string, colorBack: string, hoverText: string, percent: number}) {
    return (
    <span title={hoverText} className="w-full">
        <div 
            className={`relative h-3`} 
            style={{
                backgroundColor: colorBack,
            }}
        >
            <div
                className={`h-3`}
                style={{
                    width: `${percent}%`,
                    backgroundColor: colorFore,
                }}
            />
        </div>
    </span>
    )
}