import LogoImg from '/images/logo.jpg'


export default function InvoiceLogo() {
    return (
        <div className="relative max-lg:row-start-1">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <img src={LogoImg} alt="My Image" width="200" height="150" />
                </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
        </div>
    )
}
