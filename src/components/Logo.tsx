import Image from 'next/image';

export const Logo = ({ scrolled = false, className = "", height = "h-10" }: { scrolled?: boolean; className?: string; height?: string }) => (
    <div className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${className}`}>
        <div className={`relative ${height} aspect-square transition-all duration-300 group-hover:scale-110 ${
            !scrolled ? "brightness-0 invert" : ""
        }`}>
            <Image
                src="/assets/images/logo_no_bg1.png"
                alt="GuinéeLearn Icon"
                fill
                sizes="(max-width: 768px) 100vw, 40px"
                className="object-contain"
                priority
            />
        </div>
        <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-300 ${
            scrolled ? "text-[#0F2D1E]" : "text-white"
        }`}>
            Guinée<span className={scrolled ? "text-[#1B6B3A]" : "text-green-400"}>Learn</span>
        </span>
    </div>
);
