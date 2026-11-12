import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ChevronDown,
  X,
  Menu,
  Compass,
} from "lucide-react";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
} from "react-icons/fi";

// Clean Word-by-Word Wave Reveal Animation that replays smoothly on every scroll (once: false)
function WordWaveText({
  text,
  className = "",
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{
            duration: 0.4,
            delay: delayOffset + i * 0.05,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

// Wave-Letter Fade-In Entrance on Scroll for Headings that replays every time (once: false)
function LetterWaveHeading({
  text,
  className = "",
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  return (
    <h4
      ref={ref}
      className={`font-['Satoshi'] font-bold text-[22px] sm:text-[24px] text-[#212121] tracking-[-0.48px] leading-tight ${className}`}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{
            duration: 0.35,
            delay: delayOffset + i * 0.03,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h4>
  );
}

// Interactive Hero Frosted Glass Booking Card with 3D Cursor Tilt & Specular Highlight
function InteractiveGlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-180, 180], [10, -10]), {
    damping: 24,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-180, 180], [-10, 10]), {
    damping: 24,
    stiffness: 200,
  });

  const [specular, setSpecular] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
    setSpecular({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpecular((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Specular Radial Glass Highlight Tracking Cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: specular.opacity,
          background: `radial-gradient(circle 240px at ${specular.x}% ${specular.y}%, rgba(255,255,255,0.22), transparent 75%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// Smooth Spring Hover Lift & Subtle Cursor Parallax for Cards
function InteractiveHoverCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [4, -4]), {
    damping: 20,
    stiffness: 300,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-4, 4]), {
    damping: 20,
    stiffness: 300,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, scale: 1.015 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3D Concave Instagram Carousel with Cursor Direction / Acceleration / Drag
function InteractiveInstagramCarousel({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const velocityRef = useRef(-1.2); // default auto-scroll speed left

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 16.666;
      lastTime = time;

      const currentX = x.get();
      // Track length for seamless wrap
      const newX = currentX + velocityRef.current * delta;

      if (newX <= -3500) {
        x.set(0);
      } else if (newX >= 0 && velocityRef.current > 0) {
        x.set(-3500);
      } else {
        x.set(newX);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [x]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1

    // Left zone (< 0.4): accelerates reverse/rightwards
    // Right zone (> 0.6): accelerates leftwards
    // Center: gentle auto-scroll
    if (relativeX < 0.4) {
      velocityRef.current = (0.4 - relativeX) * 7.5;
    } else if (relativeX > 0.6) {
      velocityRef.current = -1.2 - (relativeX - 0.6) * 7.5;
    } else {
      velocityRef.current = -1.2;
    }
  };

  const handleMouseLeave = () => {
    velocityRef.current = -1.2;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden py-4 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Concave Mask */}
      <svg
        className="absolute top-0 left-0 right-0 w-full h-24 sm:h-32 z-20 pointer-events-none fill-white"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M 0 0 L 1440 0 L 1440 0 Q 720 120 0 0 Z" />
      </svg>

      {/* Bottom Concave Mask */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-32 z-20 pointer-events-none fill-white"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M 0 120 L 1440 120 L 1440 120 Q 720 0 0 120 Z" />
      </svg>

      <motion.div
        drag="x"
        dragConstraints={{ left: -3500, right: 0 }}
        style={{ x }}
        className="flex gap-5 w-max"
      >
        {[...images, ...images].map((imgUrl, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04, rotateY: 5, zIndex: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-[280px] sm:w-[340px] h-[500px] rounded-none overflow-hidden bg-neutral-100 flex-shrink-0 group relative shadow-md"
          >
            <img
              src={imgUrl}
              alt={`Instagram ${i + 1}`}
              className="w-full h-full object-cover rounded-none"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
              <FiInstagram className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Traveli() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Quick Search Booking Form State
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDeparture, setSearchDeparture] = useState("");
  const [searchReturn, setSearchReturn] = useState("");
  const [searchTraveler, setSearchTraveler] = useState("01 person");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Section 3: Welcome Polaroid Fan scroll-linked spread & cursor tilt
  const polaroidSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: polaroidScroll } = useScroll({
    target: polaroidSectionRef,
    offset: ["start end", "center center"],
  });
  const smoothPolaroidScroll = useSpring(polaroidScroll, { damping: 20, stiffness: 100 });
  const card1Rot = useTransform(smoothPolaroidScroll, [0, 1], [-5, 1.5]);
  const card2Rot = useTransform(smoothPolaroidScroll, [0, 1], [-2, 1.88]);
  const card3Rot = useTransform(smoothPolaroidScroll, [0, 1], [0, 2.0]);
  const card4Rot = useTransform(smoothPolaroidScroll, [0, 1], [-12, -7.0]);

  const [fanMouse, setFanMouse] = useState({ x: 0, y: 0 });
  const handleFanMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFanMouse({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };
  const handleFanMouseLeave = () => setFanMouse({ x: 0, y: 0 });

  // Section 4: Founder Quote orbit scroll rotation & mouse parallax
  const orbitSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: orbitScroll } = useScroll({
    target: orbitSectionRef,
    offset: ["start end", "end start"],
  });
  const smoothOrbit = useSpring(orbitScroll, { damping: 25, stiffness: 80 });
  const middleRingScrollRotate = useTransform(smoothOrbit, [0, 1], [0, 180]);
  const outerRingScrollRotate = useTransform(smoothOrbit, [0, 1], [0, -180]);

  const [orbitMouse, setOrbitMouse] = useState({ x: 0, y: 0 });
  const handleOrbitMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrbitMouse({
      x: (e.clientX - rect.left - rect.width / 2) / 35,
      y: (e.clientY - rect.top - rect.height / 2) / 35,
    });
  };
  const handleOrbitMouseLeave = () => setOrbitMouse({ x: 0, y: 0 });

  // Section 10: Promo banner scroll spread & magnetic badge tilt
  const promoSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: promoScroll } = useScroll({
    target: promoSectionRef,
    offset: ["start end", "end start"],
  });
  const smoothPromo = useSpring(promoScroll, { damping: 20, stiffness: 90 });
  const promoCard1Rot = useTransform(smoothPromo, [0, 1], [-20, -8]);
  const promoCard2Rot = useTransform(smoothPromo, [0, 1], [-8, 2]);
  const promoCard3Rot = useTransform(smoothPromo, [0, 1], [6, 18]);

  const [promoBadgeMouse, setPromoBadgeMouse] = useState({ x: 0, y: 0 });
  const handlePromoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPromoBadgeMouse({
      x: (e.clientX - rect.left - rect.width / 2) / 10,
      y: (e.clientY - rect.top - rect.height / 2) / 10,
    });
  };
  const handlePromoMouseLeave = () => setPromoBadgeMouse({ x: 0, y: 0 });

  // Instagram Feed images
  const instagramImages = [
    "/images/figma/image_5ce07a60.png",
    "/images/figma/image_ad5f65ba.png",
    "/images/figma/image_33715cf4.png",
    "/images/figma/image_656ef5f8.png",
    "/images/figma/image_46a8f9b7.png",
  ];

  // Tour Cards for Horizontal Auto-Scrolling Track in Video Section
  const tourCards = [
    {
      title: "Royal City Center",
      badge: "03 Tour Plan",
      image: "/images/figma/image_729e84d8.png",
    },
    {
      title: "Serene Lake Escape",
      badge: "05 Tour Plan",
      image: "/images/figma/image_5ee2b172.png",
    },
    {
      title: "Emerald Forest Retreat",
      badge: "07 Tour Plan",
      image: "/images/figma/image_3ee44c7d.png",
    },
  ];

  return (
    <div className="flex flex-col bg-white text-[#212121] min-h-screen font-sans selection:bg-[#212121] selection:text-white overflow-x-hidden">
      {/* ==================== 1. TOP NAVBAR (Figma 205:7919) ==================== */}
      <header className="bg-white w-full px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-neutral-100 shadow-sm">
        {/* Left: Vetri Vinayagar Travels Logo */}
        <a href="#home" className="flex items-center">
          <img
            src="/images/logod.png"
            alt="Vetri Vinayagar Travels"
            className="h-11 w-auto object-contain"
          />
        </a>

        {/* Center: Horizontal navigation links (Home in bold #110F0F, About, Essentials with chevron, Destination in #555555, gap-9 text-[15px] font-medium) */}
        <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium">
          <a href="#home" className="text-[#110F0F] font-bold">
            Home
          </a>
          <a href="#about" className="text-[#555555] hover:text-[#110F0F] transition-colors">
            About
          </a>
          <div className="relative group cursor-pointer py-2 flex items-center gap-1.5 text-[#555555] hover:text-[#110F0F] transition-colors">
            <span>Essentials</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 text-[#555555]" />
            <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 text-[#212121]">
              <a href="#how-it-works" className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 font-medium">
                How It Works
              </a>
              <a href="#adventures" className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 font-medium">
                Tour Plans &amp; Video
              </a>
              <a href="#testimonials" className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 font-medium">
                Traveler Reviews
              </a>
            </div>
          </div>
          <a href="#destinations" className="text-[#555555] hover:text-[#110F0F] transition-colors">
            Destination
          </a>
        </nav>

        {/* Right: Dark pill CTA button (bg-[#1C1C1C] text-white rounded-full px-6 py-3 flex items-center gap-2 text-[14px] font-medium) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#1C1C1C] text-white rounded-full px-6 py-3 text-[14px] font-medium hover:bg-black transition-all shadow-md active:scale-95"
          >
            <div className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center">
              <Compass className="w-2.5 h-2.5 text-white" />
            </div>
            <span>Get A Quote</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#110F0F] hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[73px] z-40 bg-white border-b border-neutral-200 px-6 py-4 flex flex-col gap-3 text-[#110F0F] shadow-lg">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold py-2 text-[#110F0F]">
            Home
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-[#555555] hover:text-[#110F0F]">
            About
          </a>
          <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-[#555555] hover:text-[#110F0F]">
            Destination
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-[#555555] hover:text-[#110F0F]">
            How It Works
          </a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-[#555555] hover:text-[#110F0F]">
            Reviews
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setQuoteModalOpen(true);
            }}
            className="mt-2 w-full py-3 rounded-full bg-[#1C1C1C] text-white text-sm font-medium shadow"
          >
            Get A Quote
          </button>
        </div>
      )}

      {/* ==================== 1. HERO SECTION (205:7842) ==================== */}
      {/* Rounded Hero Section directly below navbar with mx-6 rounded-[28px] */}
      <section
        id="home"
        className="relative mx-4 sm:mx-6 my-3 rounded-[28px] min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center overflow-hidden bg-[#07090e]"
      >
        {/* Hero Video & Earth Space Backdrop — 100% Bright, ZERO Dark Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[28px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/figma/canvas_b44aa943.png"
            className="w-full h-full object-cover object-center"
          >
            <source src="/Uploads/download.mp4" type="video/mp4" />
            <img
              src="/images/figma/canvas_b44aa943.png"
              alt="Earth Space Backdrop"
              className="w-full h-full object-cover object-center"
            />
          </video>
          <img
            src="/images/figma/canvas_b44aa943.png"
            alt="Earth Space Backdrop"
            className="w-full h-full object-cover object-center absolute inset-0 -z-10"
          />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-20 max-w-[1300px] w-full mx-auto px-6 sm:px-10 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 my-auto">
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start max-w-[540px] text-left text-white"
          >
            {/* Clean White Rating Text without dark pill container */}
            <div className="flex items-center gap-2 text-[14px] font-medium text-white/90 mb-4 tracking-normal">
              <span>4.8 Stars on</span>
              <span className="text-white font-semibold">(586,679 reviews)</span>
            </div>

            {/* 3-line Bold Satoshi Headline */}
            <h1 className="font-['Satoshi'] font-black text-[46px] sm:text-[56px] lg:text-[64px] leading-[1.04] tracking-[-0.03em] text-white">
              Your next<br />
              adventure is one<br />
              click away
            </h1>
          </motion.div>

          {/* Right Frosted Glass Booking Card with 3D Tilt & Specular Highlight */}
          <InteractiveGlassCard className="w-full max-w-[400px] backdrop-blur-[24px] bg-white/10 border border-white/25 rounded-[24px] p-6 sm:p-7 shadow-[0px_30px_60px_rgba(0,0,0,0.4)] text-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchSubmitted(true);
                setTimeout(() => setSearchSubmitted(false), 4000);
              }}
              className="flex flex-col gap-4 text-left"
            >
              <div className="grid grid-cols-2 gap-3.5">
                {/* Where to -> Country */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-normal text-white">
                    Where to
                  </label>
                  <div className="relative">
                    <select
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                      className="w-full bg-white/[0.08] border border-white/25 rounded-[10px] px-3 py-2.5 text-xs sm:text-sm text-white appearance-none outline-none focus:border-white/50 cursor-pointer [&>option]:text-black"
                    >
                      <option value="">Country</option>
                      <option value="Japan">Japan</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="India">India</option>
                      <option value="Norway">Norway</option>
                      <option value="France">France</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Departure */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-normal text-white">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={searchDeparture}
                    onChange={(e) => setSearchDeparture(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/25 rounded-[10px] px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-white/50 cursor-pointer [color-scheme:dark]"
                  />
                </div>

                {/* Return date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-normal text-white">
                    Return date
                  </label>
                  <input
                    type="date"
                    value={searchReturn}
                    onChange={(e) => setSearchReturn(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/25 rounded-[10px] px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-white/50 cursor-pointer [color-scheme:dark]"
                  />
                </div>

                {/* Traveler */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-normal text-white">
                    Traveler
                  </label>
                  <div className="relative">
                    <select
                      value={searchTraveler}
                      onChange={(e) => setSearchTraveler(e.target.value)}
                      className="w-full bg-white/[0.08] border border-white/25 rounded-[10px] px-3 py-2.5 text-xs sm:text-sm text-white appearance-none outline-none focus:border-white/50 cursor-pointer [&>option]:text-black"
                    >
                      <option value="01 person">01 person</option>
                      <option value="02 persons">02 persons</option>
                      <option value="03-05 persons">03-05 persons</option>
                      <option value="Group 6+">Group 6+</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* White pill CTA button: [compass icon] Explore Now */}
              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2.5 bg-white text-[#110F0F] px-6 py-3 rounded-full text-[14px] font-bold capitalize hover:bg-neutral-100 transition-all shadow-md active:scale-95 self-start"
              >
                <div className="w-5 h-5 rounded-full border border-[#110F0F] flex items-center justify-center">
                  <Compass className="w-3 h-3 text-[#110F0F]" />
                </div>
                <span>Explore Now</span>
              </button>
            </form>

            {searchSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 px-3 py-2 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-medium rounded-lg text-center"
              >
                ✓ Searching packages for {searchDestination || "your selected dates"}...
              </motion.div>
            )}
          </InteractiveGlassCard>
        </div>
      </section>

      {/* ==================== 2. TRUST STRIP BELOW HERO (205:6794) ==================== */}
      {/* Forced onto ONE single centered horizontal row — zero wrapping */}
      <div className="w-full bg-white border-b border-neutral-100">
        <div className="max-w-[1300px] mx-auto py-10 px-6 flex flex-row items-center justify-center gap-8 md:gap-14 whitespace-nowrap overflow-x-auto text-[15px] sm:text-[16px] font-['Satoshi:Medium'] text-[#212121]">
          {/* Item 1: Free cancellation on most tours */}
          <div className="flex items-center gap-3 shrink-0">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#110F0F" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-5" stroke="#110F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Free cancellation on most tours</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />

          {/* Item 2: Secure payment, 100% guaranteed */}
          <div className="flex items-center gap-3 shrink-0">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L4 5v5c0 4.5 2.5 7.5 6 8.5 3.5-1 6-4 6-8.5V5l-6-3z" stroke="#110F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 10l2 2 3.5-3.5" stroke="#110F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Secure payment, 100% guaranteed</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />

          {/* Item 3: 24/7 travel support */}
          <div className="flex items-center gap-3 shrink-0">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M3 4a2 2 0 012-2h1.5a1 1 0 011 .8l.7 3.5a1 1 0 01-.3.9l-1.3 1.3a11 11 0 005.7 5.7l1.3-1.3a1 1 0 01.9-.3l3.5.7a1 1 0 01.8 1V16a2 2 0 01-2 2h-1C7.8 18 2 12.2 2 5V4z" stroke="#110F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>24/7 travel support</span>
          </div>
        </div>
      </div>

      {/* ==================== 3. WELCOME POLAROID FAN (205:6794) ==================== */}
      <section
        id="about"
        ref={polaroidSectionRef}
        className="py-20 lg:py-28 max-w-[1440px] mx-auto px-6 w-full text-center relative overflow-hidden"
      >
        {/* Section Headline */}
        <div className="max-w-3xl mx-auto mb-16 relative z-10">
          <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#110F0F]">
            <WordWaveText text="TravelBid tourism Welcome You!" />
          </h2>
          <p className="mt-4 text-xl sm:text-2xl text-[#555555] font-normal">
            We don&apos;t sell trips. We craft journeys.
          </p>
        </div>

        {/* 4-Card Overlapping Angled Polaroid Fan with Scroll-Linked Spread & Cursor Parallax */}
        <div
          onMouseMove={handleFanMouseMove}
          onMouseLeave={handleFanMouseLeave}
          className="relative max-w-[1300px] mx-auto min-h-[460px] flex items-center justify-center py-6 cursor-pointer"
        >
          {/* Faint grey line-art world landmarks watermark */}
          <img
            src="/images/figma/image_2_c7f5d4d8.png"
            alt="World Landmarks Watermark"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1050px] max-w-none opacity-40 pointer-events-none z-0"
          />

          {/* Cards Track with dynamic scroll progress rotation and cursor tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
            {/* Card 1: Munnar — scroll-tied rotation + cursor parallax */}
            <motion.div
              style={{ rotate: card1Rot, x: fanMouse.x, y: fanMouse.y }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              className="rounded-[12px] overflow-visible relative shadow-lg border border-neutral-200 bg-white"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md z-30">
                <img
                  src="/images/figma/ellipse_1_50dd16ae.png"
                  alt="Sticker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-neutral-100">
                <img
                  src="/images/figma/image_6d53decb.png"
                  alt="Munnar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Card 2: Hawa Mahal — scroll-tied rotation + cursor parallax */}
            <motion.div
              style={{ rotate: card2Rot, x: fanMouse.x * 0.7, y: fanMouse.y * 0.7 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.08 }}
              className="rounded-[12px] overflow-hidden shadow-lg border border-neutral-200 bg-white"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <img
                  src="/images/figma/image_9c6852f8.png"
                  alt="Hawa Mahal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Card 3: Waterfall — scroll-tied rotation + cursor parallax */}
            <motion.div
              style={{ rotate: card3Rot, x: -fanMouse.x * 0.7, y: fanMouse.y * 0.7 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.16 }}
              className="rounded-[12px] overflow-hidden shadow-lg border border-neutral-200 bg-white"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <img
                  src="/images/figma/image_3820d761.png"
                  alt="Waterfall"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Card 4: Howrah Bridge — scroll-tied rotation + cursor parallax */}
            <motion.div
              style={{ rotate: card4Rot, x: -fanMouse.x, y: fanMouse.y }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.24 }}
              className="rounded-[12px] overflow-visible relative shadow-lg border border-neutral-200 bg-white"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md z-30">
                <img
                  src="/images/figma/ellipse_2_02b2704e.png"
                  alt="Sticker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-neutral-100">
                <img
                  src="/images/figma/image_c3806624.png"
                  alt="Howrah Bridge"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 4. FOUNDER QUOTE & 6-CARD GRID (205:8324 & 205:6821) ==================== */}
      <section
        ref={orbitSectionRef}
        onMouseMove={handleOrbitMouseMove}
        onMouseLeave={handleOrbitMouseLeave}
        className="relative py-24 bg-[#F8F8F8] border-y border-[#E5E5E5] overflow-hidden text-center"
      >
        {/* World Landmarks Watermark behind orbit rings */}
        <img
          src="/images/figma/image_2_c7f5d4d8.png"
          alt="World Landmarks Watermark"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] max-w-none opacity-25 pointer-events-none z-0"
        />

        {/* Concentric Orbit Rings Background Animation Driven by Scroll & Mouse Parallax */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-0">
          <motion.div
            style={{ x: orbitMouse.x, y: orbitMouse.y }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="relative w-[700px] h-[700px] flex items-center justify-center"
          >
            {/* Inner Ring */}
            <div className="absolute w-[360px] h-[360px] rounded-full border border-neutral-300" />
            {/* Middle Ring with scroll-driven continuous rotation */}
            <motion.div
              style={{ rotate: middleRingScrollRotate }}
              className="absolute w-[520px] h-[520px] rounded-full border border-dashed border-neutral-300"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full overflow-hidden border border-white shadow">
                <img
                  src="/images/figma/ellipse_1_a42861bd.png"
                  alt="Destination thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            {/* Outer Ring with reverse scroll-driven rotation */}
            <motion.div
              style={{ rotate: outerRingScrollRotate }}
              className="absolute w-[680px] h-[680px] rounded-full border border-neutral-300"
            >
              <div className="absolute top-1/3 -left-4 w-9 h-9 rounded-full overflow-hidden border border-white shadow">
                <img
                  src="/images/figma/ellipse_2_3e11c7ba.png"
                  alt="Destination thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1/4 -right-4 w-9 h-9 rounded-full overflow-hidden border border-white shadow">
                <img
                  src="/images/figma/ellipse_3_a00ea6c7.png"
                  alt="Destination thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quote Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 mb-20">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-[-0.72px] leading-[1.3] text-[#212121]">
            <WordWaveText
              text="“We built Travelbid for the traveler we used to be — curious, budget-aware, and desperate for a platform that actually cared.”"
            />
          </blockquote>
          <p className="mt-6 text-sm sm:text-base font-semibold tracking-wide text-[#555555] uppercase">
            Nowazul Huq Shehran, Founder &amp; Co
          </p>
        </div>

        {/* 6-Card Values Grid (205:6821) — Matching exact 3x2 thin hairline border grid (1px solid #EAEAEA) with Spring Physics Hover */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-6">
          <div className="rounded-[10px] overflow-hidden border border-[#EAEAEA] bg-white divide-y divide-[#EAEAEA] text-left shadow-sm">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAEAEA]">
              {/* Card 1: Curated, not crowded */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="20" cy="20" r="14" />
                    <ellipse cx="20" cy="20" rx="7" ry="14" />
                    <path d="M6 20h28" />
                    <rect x="22" y="10" width="12" height="18" rx="2" fill="white" stroke="#110F0F" strokeWidth="1.75" />
                    <circle cx="28" cy="16" r="2.5" />
                    <path d="M25 22h6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    Curated, not crowded
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    Every listing is hand-reviewed. We choose quality over quantity — always.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: No hidden fees. Ever. */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="20" cy="20" r="10" />
                    <ellipse cx="20" cy="20" rx="18" ry="6" transform="rotate(-30 20 20)" />
                    <circle cx="34" cy="12" r="2" fill="#110F0F" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    No hidden fees. Ever.
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    The price you see is the price you pay. Transparent billing is non-negotiable.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Travel responsibly */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 24l3-8h18l3 8v8a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2H14v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-8z" />
                    <circle cx="13" cy="24" r="2.5" />
                    <circle cx="27" cy="24" r="2.5" />
                    <path d="M12 16h16" />
                    <circle cx="32" cy="10" r="4" />
                    <path d="M35 13l3 3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    Travel responsibly
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    We offset every booking&apos;s carbon footprint and partner with eco-certified operators.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAEAEA]">
              {/* Card 4: Local-first mindset */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="12" width="14" height="22" rx="1" />
                    <path d="M22 18h10v16H22" />
                    <path d="M12 17h2M16 17h2M12 22h2M16 22h2M12 27h2M16 27h2" />
                    <path d="M26 23h2M26 28h2" />
                    <path d="M13 34v-3h4v3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    Local-first mindset
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    We route your spend to local guides and communities — not global chains.
                  </p>
                </div>
              </motion.div>

              {/* Card 5: Humans on standby (24/7 Headset/Support Icon) */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 22v-4a12 12 0 0124 0v4" />
                    <rect x="6" y="20" width="5" height="9" rx="2" fill="white" stroke="#110F0F" strokeWidth="1.75" />
                    <rect x="29" y="20" width="5" height="9" rx="2" fill="white" stroke="#110F0F" strokeWidth="1.75" />
                    <path d="M31 29v3a4 4 0 01-4 4h-5" />
                    <circle cx="20" cy="36" r="2" fill="#110F0F" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    Humans on standby
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    24/7 real-person support. No bots. No ticket queues. A real traveler picks up.
                  </p>
                </div>
              </motion.div>

              {/* Card 6: Book with confidence (Passport & Plane Ticket Icon) */}
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-9 flex flex-col justify-between h-[285px] bg-white transition-colors cursor-pointer"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-start text-[#110F0F]">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="#110F0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="10" width="16" height="22" rx="2" />
                    <circle cx="15" cy="18" r="3.5" />
                    <path d="M11 26h8" />
                    <path d="M23 14l10-4v18l-10 4V14z" />
                    <path d="M27 16l3 3-3 3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Satoshi:Bold'] text-[24px] text-[#212121] tracking-[-0.48px] leading-[29px] mb-3">
                    Book with confidence
                  </h4>
                  <p className="font-['Satoshi:Regular'] text-[16px] text-[#555555] leading-[26px]">
                    Free cancellation, price match guarantee, and full refund protection on every trip.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. TOP #01 DESTINATIONS BENTO GRID (205:9174) ==================== */}
      <section id="destinations" className="py-20 lg:py-28 max-w-[1300px] mx-auto px-6 w-full">
        {/* Header (Clean, NO invented subtitle) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#110F0F] leading-tight">
              Top #01 destinations<br />traveler&apos;s love
            </h2>
          </div>
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="self-start sm:self-auto px-6 py-2.5 rounded-full border border-[#212121] text-[#212121] text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm"
          >
            More Destinations
          </button>
        </div>

        {/* 6 Clean Borderless Rounded Image Cards with Spring Physics Hover Lift & Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Row 1, Card 1: Brihadeeswarar Temple - $449 */}
          <InteractiveHoverCard className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_d66de817.png"
                alt="Brihadeeswarar Temple"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Brihadeeswarar Temple
              </h4>
              <span className="text-[14px] text-[#555555]">
                $449 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>

          {/* Row 1, Card 2: Manali - $350 (Snowy blue mountain peak image) */}
          <InteractiveHoverCard className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_05fe878c.png"
                alt="Manali"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Manali
              </h4>
              <span className="text-[14px] text-[#555555]">
                $350 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>

          {/* Row 1, Card 3: Snowy Peak Retreat - $559 (Mountain train image) */}
          <InteractiveHoverCard className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_3_1555823f.png"
                alt="Snowy Peak Retreat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Snowy Peak Retreat
              </h4>
              <span className="text-[14px] text-[#555555]">
                $559 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>

          {/* Row 2, Card 1: Kaziranga National Park - $649 (Wider left card) */}
          <InteractiveHoverCard className="lg:col-span-2 group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_c534d6f7.png"
                alt="Kaziranga National Park"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Kaziranga National Park
              </h4>
              <span className="text-[14px] text-[#555555]">
                $649 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>

          {/* Row 2, Card 2: Tirupati - $349 (White temple gopuram image) */}
          <InteractiveHoverCard className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-40px)] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_302e3c59.png"
                alt="Tirupati"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Tirupati
              </h4>
              <span className="text-[14px] text-[#555555]">
                $349 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>

          {/* Row 2, Card 3: Rishikesh - $499 (Turquoise river & bridge image) */}
          <InteractiveHoverCard className="lg:col-span-3 group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/9] lg:aspect-[24/7] rounded-[20px] overflow-hidden bg-neutral-100">
              <img
                src="/images/figma/image_4_e7d8f241.png"
                alt="Rishikesh"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="text-[20px] font-bold text-[#110F0F]">
                Rishikesh
              </h4>
              <span className="text-[14px] text-[#555555]">
                $499 <span className="text-[#555555]">/Per person</span>
              </span>
            </div>
          </InteractiveHoverCard>
        </div>
      </section>

      {/* ==================== 6. MARQUEE TICKER (205:9391) ==================== */}
      <div className="py-8 bg-white overflow-hidden select-none border-y border-[#F0F0F0]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6 text-[44px] sm:text-[48px] font-black tracking-tight text-[#E8E8E8]">
              <span>Explore</span>
              <span>Travel &amp; Tour</span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 7. VIDEO & TOUR PLANS (211:9406 & 211:9416) ==================== */}
      <section
        id="adventures"
        className="relative min-h-[640px] lg:min-h-[740px] flex flex-col justify-between py-16 overflow-hidden text-white"
      >
        {/* Full-bleed bright green tea plantation video & background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/figma/image_6_6fe691f6.png"
            className="w-full h-full object-cover"
          >
            <source
              src="/Uploads/Tea_plantation_landscape_video_5d739df1.mp4"
              type="video/mp4"
            />
            <img
              src="/images/figma/image_6_6fe691f6.png"
              alt="Tea Plantation"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Subtle gradient for white title readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </div>

        {/* Centered White Title (48px Bold, NO subtitle, NO mute/expand buttons) */}
        <div className="relative z-10 max-w-3xl mx-auto text-center pt-8 pb-10 px-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Top notch destination for<br />your next adventure
          </h2>
        </div>

        {/* Continuous Horizontal Auto-Scrolling Marquee Track */}
        <div className="relative z-10 w-full overflow-hidden pb-8">
          <div className="flex animate-marquee gap-6 w-max">
            {[...tourCards, ...tourCards, ...tourCards, ...tourCards].map((card, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[320px] h-[400px] sm:h-[440px] rounded-[20px] overflow-hidden relative shadow-2xl flex-shrink-0 group"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Frosted top-left pill badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white">
                  {card.badge}
                </div>

                {/* White bold title overlaid at bottom-left */}
                <div className="absolute bottom-5 left-5 right-5">
                  <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 8. TESTIMONIALS BENTO GRID (205:7428) ==================== */}
      <section
        id="testimonials"
        className="py-20 lg:py-28 max-w-[1300px] mx-auto px-6 w-full"
      >
        <div className="mb-12">
          {/* Tilted Happy Travelers badge */}
          <div className="inline-block transform -rotate-2 mb-3 px-4 py-1.5 rounded-full bg-[#F3F3F3] border border-neutral-300 text-xs sm:text-sm font-semibold tracking-wide text-[#212121]">
            Happy Travelers
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#212121] tracking-[-1.44px]">
            Memorable journeys shared by travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: 4.9* Score Card (205:7429) with * as superscript */}
          <div className="bg-white rounded-[12px] border border-[#d9d9d9] p-8 flex flex-col justify-between items-center text-center shadow-sm">
            <div>
              <div className="text-[96px] font-black leading-none tracking-[-3px] text-[#212121] flex items-start justify-center">
                <span>4.9</span>
                <span className="text-4xl -mt-1 font-bold text-[#212121]">*</span>
              </div>
              <p className="mt-4 text-base text-[#555]">
                Based on 65455 reviews on <strong className="text-[#212121]">Traveli</strong>
              </p>
            </div>
            <div className="w-52 h-52 rounded-full overflow-hidden mt-6 relative shadow-inner flex items-center justify-center">
              <img
                src="/images/figma/image_6a243e54.png"
                alt="Travel Stamp Badge"
                className="w-full h-full object-cover"
              />
              {/* Exact Centered White Passport / Document SVG Icon Overlay (205:7428 / 205:7440) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 80 80"
                  className="w-20 h-20 drop-shadow-lg"
                  fill="none"
                >
                  {/* Passport / Document Outer Body (52.5 x 77.5) */}
                  <rect
                    x="14"
                    y="5"
                    width="52"
                    height="70"
                    rx="7"
                    stroke="#FFFFFF"
                    strokeWidth="3.2"
                    fill="rgba(255,255,255,0.18)"
                  />
                  {/* Inner Photo Window */}
                  <rect
                    x="25"
                    y="17"
                    width="30"
                    height="24"
                    rx="3"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <circle cx="40" cy="26" r="4.5" stroke="#FFFFFF" strokeWidth="2" />
                  <path
                    d="M29 38c1.5-2.8 4.5-4.5 11-4.5s9.5 1.7 11 4.5"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Credential Lines */}
                  <line
                    x1="25"
                    y1="49"
                    x2="55"
                    y2="49"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="25"
                    y1="57"
                    x2="45"
                    y2="57"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Sebastian T. Langston Review (205:7445) */}
          <div className="bg-white rounded-[12px] border border-[#d9d9d9] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center gap-1 text-black mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-black text-xl">★</span>
                ))}
              </div>
              <p className="text-xl sm:text-2xl font-medium leading-[34px] tracking-[-0.72px] text-[#212121] text-balance">
                <WordWaveText
                  text="“ Booking our vacation was incredibly easy, and every detail was handled professionally. The itinerary was well organized, the accommodations were excellent, and the entire experience. ”"
                  delayOffset={0.15}
                />
              </p>
            </div>

            {/* Scenic author footer strip with dark gradient overlay and white text */}
            <div className="relative mt-8 h-[92px] rounded-[10px] overflow-hidden flex items-center justify-between px-5 shadow-sm">
              <img
                src="/images/figma/image_15e2c598.png"
                alt="Scenic Panorama"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
              <div className="relative z-10 flex flex-col text-left">
                <h5 className="font-['Satoshi'] font-medium text-[20px] text-white leading-tight tracking-[-0.4px]">
                  Sebastian T. Langston
                </h5>
                <p className="text-[14px] text-white/80 font-normal">Travel blogger</p>
              </div>
              <div className="relative z-10 w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white/70 shadow flex-shrink-0">
                <img
                  src="/images/figma/image_b21109b3.png"
                  alt="Sebastian T. Langston"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Oscar N. Winsley Review (205:7481) */}
          <div className="bg-white rounded-[12px] border border-[#d9d9d9] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center gap-1 text-black mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-black text-xl">★</span>
                ))}
              </div>
              <p className="text-xl sm:text-2xl font-medium leading-[34px] tracking-[-0.72px] text-[#212121] text-balance">
                <WordWaveText
                  text="“ We were impressed by the level of professionalism and care shown by the travel team. They listened to our preferences and designed a trip that matched our interests our perfectly. ”"
                  delayOffset={0.3}
                />
              </p>
            </div>

            {/* Scenic author footer strip with dark gradient overlay and white text */}
            <div className="relative mt-8 h-[92px] rounded-[10px] overflow-hidden flex items-center justify-between px-5 shadow-sm">
              <img
                src="/images/figma/image_e6bcb7c3.png"
                alt="Scenic Panorama"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
              <div className="relative z-10 flex flex-col text-left">
                <h5 className="font-['Satoshi'] font-medium text-[20px] text-white leading-tight tracking-[-0.4px]">
                  Oscar N. Winsley
                </h5>
                <p className="text-[14px] text-white/80 font-normal">Travel blogger</p>
              </div>
              <div className="relative z-10 w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white/70 shadow flex-shrink-0">
                <img
                  src="/images/figma/image_c4d9c2cd.png"
                  alt="Oscar N. Winsley"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. 3-STEP BOOKING FLOW WITH LINE-ART ILLUSTRATIONS (205:7517) ==================== */}
      <section id="how-it-works" className="py-20 lg:py-28 max-w-[1300px] mx-auto px-6 w-full text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#F3F3F3] text-xs font-semibold tracking-wide text-[#212121] mb-4">
          How It Works?
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#212121] tracking-tight mb-16">
          Create journeys with effortless booking flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Step 01: Choose destination (205:7525) */}
          <div className="p-8 rounded-[12px] border border-[#d9d9d9] bg-white h-[280px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="font-['Satoshi'] text-[16px] text-[#212121] font-medium">
                Step 01
              </span>
              <div className="h-px bg-[#dadada]/75 my-3 w-full" />
              <p className="font-['Satoshi'] text-[15px] sm:text-[16px] text-[#555555] leading-[26px]">
                Pick your dream travel location from a wide range of beautiful places around the world.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <LetterWaveHeading text="Choose destination" delayOffset={0.1} />
              {/* Exact Pin-on-Hand SVG Icon (205:7538) */}
              <div className="w-[60px] h-[60px] flex items-center justify-end shrink-0 opacity-90 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 40 60"
                  className="w-10 h-14"
                  fill="none"
                  stroke="#212121"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6a10 10 0 0 0-10 10c0 7.5 10 16 10 16s10-8.5 10-16a10 10 0 0 0-10-10z" />
                  <circle cx="20" cy="16" r="3.5" />
                  <path d="M6 46c4-3 9-4 14-4s10 1 14 4" />
                  <path d="M8 43v5a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Step 02: Package reservation (205:7540) */}
          <div className="p-8 rounded-[12px] border border-[#d9d9d9] bg-white h-[280px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="font-['Satoshi'] text-[16px] text-[#212121] font-medium">
                Step 02
              </span>
              <div className="h-px bg-[#dadada]/75 my-3 w-full" />
              <p className="font-['Satoshi'] text-[15px] sm:text-[16px] text-[#555555] leading-[26px]">
                Select the best travel package that fits your budget and preferences, then confirm.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <LetterWaveHeading text="Package reservation" delayOffset={0.2} />
              {/* Exact Credit-Card & Ticket SVG Icon (205:7553) */}
              <div className="w-[60px] h-[60px] flex items-center justify-end shrink-0 opacity-90 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 48 48"
                  className="w-12 h-12"
                  fill="none"
                  stroke="#212121"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="8" width="28" height="18" rx="2.5" />
                  <line x1="6" y1="13" x2="34" y2="13" />
                  <line x1="10" y1="20" x2="16" y2="20" />
                  <rect x="18" y="20" width="24" height="18" rx="2" strokeDasharray="3 3" />
                  <circle cx="18" cy="29" r="2.5" fill="white" />
                  <circle cx="42" cy="29" r="2.5" fill="white" />
                  <line x1="26" y1="26" x2="34" y2="26" />
                  <line x1="26" y1="31" x2="31" y2="31" />
                </svg>
              </div>
            </div>
          </div>

          {/* Step 03: Journey enjoyment (205:7555) */}
          <div className="p-8 rounded-[12px] border border-[#d9d9d9] bg-white h-[280px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="font-['Satoshi'] text-[16px] text-[#212121] font-medium">
                Step 03
              </span>
              <div className="h-px bg-[#dadada]/75 my-3 w-full" />
              <p className="font-['Satoshi'] text-[15px] sm:text-[16px] text-[#555555] leading-[26px]">
                Relax and enjoy your journey while we take care of everything, ensuring a smooth.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <LetterWaveHeading text="Journey enjoyment" delayOffset={0.3} />
              {/* Exact Teacup & Landscape SVG Icon (205:7569 / 205:7571) */}
              <div className="w-[60px] h-[60px] flex items-center justify-end shrink-0 opacity-90 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 52 52"
                  className="w-12 h-12"
                  fill="none"
                  stroke="#212121"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h22v10a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V20z" />
                  <path d="M34 23h4a4 4 0 0 1 0 8h-4" />
                  <line x1="8" y1="42" x2="38" y2="42" />
                  <path d="M18 14c0-3 2-4 2-6" />
                  <path d="M23 13c0-3 2-4 2-6" />
                  <path d="M28 14c0-3 2-4 2-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 10. PROMOTIONAL BANNER WITH 3 MINI CARDS (205:7574) ==================== */}
      <section
        ref={promoSectionRef}
        className="py-12 max-w-[1300px] mx-auto px-6 w-full"
      >
        <div className="relative rounded-[24px] overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col md:flex-row items-center justify-between p-8 sm:p-14 text-white shadow-2xl">
          {/* Terraced Rice Fields Background */}
          <img
            src="/images/figma/image_39db2210.png"
            alt="Terraced Fields"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Left Content (NO Book A Trip button, exact 2-line layout) */}
          <div className="relative z-10 max-w-lg mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Start your journey with<br />us today
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-200">
              Start your journey with us today and explore the world like never before. From carefully planned.
            </p>
          </div>

          {/* Right Content: 3 Tilted Overlapping Mini Travel Photo Cards + Magnetic 30% Badge */}
          <div
            onMouseMove={handlePromoMouseMove}
            onMouseLeave={handlePromoMouseLeave}
            className="relative z-10 w-[280px] sm:w-[340px] h-[220px] flex items-center justify-center cursor-pointer"
          >
            {/* Card 1 — scroll-linked fanning */}
            <motion.div
              style={{ rotate: promoCard1Rot }}
              className="absolute w-36 h-48 rounded-[14px] overflow-hidden shadow-xl border-2 border-white -left-2 top-0"
            >
              <img
                src="/images/figma/image_d8c5235d.png"
                alt="Travel Card 1"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Card 2 — scroll-linked fanning */}
            <motion.div
              style={{ rotate: promoCard2Rot }}
              className="absolute w-36 h-48 rounded-[14px] overflow-hidden shadow-2xl border-2 border-white left-16 top-2 z-10"
            >
              <img
                src="/images/figma/image_d2acc348.png"
                alt="Travel Card 2"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Card 3 — scroll-linked fanning */}
            <motion.div
              style={{ rotate: promoCard3Rot }}
              className="absolute w-36 h-48 rounded-[14px] overflow-hidden shadow-xl border-2 border-white right-0 top-4 z-15"
            >
              <img
                src="/images/figma/image_40ceb07b.png"
                alt="Travel Card 3"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating 30% SALE OFF Badge with Magnetic Cursor Tracking */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [0, 4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ x: promoBadgeMouse.x, y: promoBadgeMouse.y }}
              className="absolute -bottom-4 right-10 w-24 h-24 rounded-full bg-white text-black p-2 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-amber-400 z-30"
            >
              <span className="text-2xl font-black leading-none text-black">30%</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 mt-1">
                SALE OFF
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 11. 3D CURVED CYLINDRICAL INSTAGRAM CAROUSEL (211:11339 & 211:11353) ==================== */}
      <section className="py-16 max-w-[1440px] mx-auto px-6 w-full text-center relative overflow-hidden">
        {/* Title with Full-Color 44px x 44px Instagram Gradient Badge on the RIGHT */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12">
          <h3 className="text-3xl sm:text-[48px] font-bold font-['Satoshi'] tracking-[-1.2px] text-[#212121] leading-tight">
            TravelBid Instagram feed
          </h3>
          <div className="w-[44px] h-[44px] rounded-[12px] bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] p-[2.5px] shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[10px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3D Cylindrical Panoramic Carousel with Dynamic Cursor Scrubbing, Drag & Hover Speed */}
        <InteractiveInstagramCarousel images={instagramImages} />
      </section>

      {/* ==================== 12. GLASSMORHPISM FOOTER OVER TEA PLANTATION (211:11246) ==================== */}
      <footer className="relative bg-white pt-16 pb-12 overflow-hidden font-['Satoshi']">
        {/* Full-bleed Tea Plantation Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/figma/frame_14_16134d4b.png"
            className="w-full h-full object-cover object-center"
          >
            <source src="/Uploads/Tea_plantation_landscape_video_5d739df1.mp4" type="video/mp4" />
            <img
              src="/images/figma/frame_14_16134d4b.png"
              alt="Tea Plantation Backdrop"
              className="w-full h-full object-cover"
            />
          </video>
          <img
            src="/images/figma/frame_14_16134d4b.png"
            alt="Tea Plantation Backdrop"
            className="w-full h-full object-cover absolute inset-0 -z-10"
          />
        </div>

        {/* Centered Frosted Glass Container (205:7709) */}
        <div className="relative z-10 max-w-[1318px] mx-auto px-6 font-['Satoshi']">
          <div className="backdrop-blur-[20px] bg-white/15 border border-white/40 rounded-[24px] p-8 sm:p-14 shadow-2xl">
            {/* 3 Columns: Left Logo/Tagline/Contact, Middle Essential Link, Right Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/20">
              {/* Col 1: Logo & Mission Statement & Contact Info (205:7711) */}
              <div className="lg:col-span-6 flex flex-col font-['Satoshi']">
                <div className="flex items-center">
                  <img
                    src="/images/white.png"
                    alt="Vetri Vinayagar Travels"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <p className="mt-4 text-[16.2px] leading-[26.36px] font-normal text-white/95 max-w-sm font-['Satoshi']">
                  <WordWaveText text="Every journey we organize is built on trust, safety, and unforgettable views." />
                </p>

                <div className="mt-6 flex flex-col gap-2.5 text-sm text-neutral-200 font-['Satoshi']">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base">📞</span>
                    <span className="font-normal font-['Satoshi']">+123 (456) 789 00-6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base">✉️</span>
                    <span className="font-normal font-['Satoshi']">info@travel.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base">📍</span>
                    <span className="font-normal font-['Satoshi']">12/a, New bosoton tower, NYC, US 120002</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Title-Case Essential Link (205:7746) */}
              <div className="lg:col-span-3 font-['Satoshi']">
                <h5 className="font-['Satoshi'] text-[16px] font-bold text-white mb-4">
                  Essential Link
                </h5>
                <ul className="space-y-2 text-[14px] font-normal text-neutral-100 font-['Satoshi']">
                  <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">Blogs</a></li>
                  <li><a href="#quote" onClick={() => setQuoteModalOpen(true)} className="hover:text-white transition-colors">Get in</a></li>
                  <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonial</a></li>
                  <li><a href="#quote" onClick={() => setQuoteModalOpen(true)} className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>

              {/* Col 3: Title-Case Destinations (205:7771) */}
              <div className="lg:col-span-3 font-['Satoshi']">
                <h5 className="font-['Satoshi'] text-[16px] font-bold text-white mb-4">
                  Destinations
                </h5>
                <ul className="space-y-2 text-[14px] font-normal text-neutral-100 font-['Satoshi']">
                  <li><a href="#destinations" className="hover:text-white transition-colors">Al Arab</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Berlin</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Bangkok</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Seoul</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Lisbon</a></li>
                  <li><a href="#destinations" className="hover:text-white transition-colors">Cairo</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar: Copyright on left, 4 white social icons on right */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-200 gap-4 font-['Satoshi']">
              <p className="font-['Satoshi'] font-normal text-[13px]">Copyright &amp; design by @Template Munk - 2026</p>
              <div className="flex items-center gap-3 text-white">
                <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                  <FiTwitter className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                  <FiFacebook className="w-4 h-4" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                  <FiLinkedin className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                  <FiInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== GET A QUOTE MODAL ==================== */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-bold text-[#212121]">Get A Custom Quote</h3>
            <p className="mt-1 text-sm text-[#555555]">
              Tell us your dream vacation details and our travel curators will tailor a personalized package within 2 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Your quote request has been received. Our team will contact you shortly.");
                setQuoteModalOpen(false);
              }}
              className="mt-6 flex flex-col gap-4 text-left"
            >
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Target Destination &amp; Days
                </label>
                <input
                  type="text"
                  placeholder="e.g. Switzerland - 7 Days"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 rounded-2xl bg-[#212121] text-white font-bold text-sm tracking-wide uppercase hover:bg-black transition-all shadow-md active:scale-95"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
