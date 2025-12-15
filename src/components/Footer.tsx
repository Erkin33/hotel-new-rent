export default function Footer() {
  const menu = [
    {
      Head: "About Us",
      links: [
        { link: "Company Overview", href: "#" },
        { link: "Our Mission & Values", href: "#" },
        { link: "Careers", href: "#" },
        { link: "Blog", href: "#" },
        { link: "Press Releases", href: "#" },
      ],
    },
    {
      Head: "Customer Service",
      links: [
        { link: "Contact Us", href: "#" },
        { link: "FAQs", href: "#" },
        { link: "Live Chat", href: "#" },
        { link: "Cancellation Policy", href: "#" },
        { link: "Booking Policies", href: "#" },
      ],
    },
    {
      Head: "Explore",
      links: [
        { link: "Destinations", href: "#" },
        { link: "Special Offers", href: "#" },
        { link: "Last-Minute Deals", href: "#" },
        { link: "Travel Guides", href: "#" },
        { link: "Blog & Travel Tips", href: "#" },
      ],
    },
    {
      Head: "Support",
      links: [
        { link: "Privacy Policy", href: "#" },
        { link: "Terms & Conditions", href: "#" },
        { link: "Accessibility", href: "#" },
        { link: "Feedback & Suggestions", href: "#" },
        { link: "Sitemap", href: "#" },
      ],
    },
    {
      Head: "Membership",
      links: [
        { link: "Loyalty Program", href: "#" },
        { link: "Unlock Exclusive Offers", href: "#" },
        { link: "Rewards & Benefits", href: "#" },
      ],
    },
  ];

  return (
    <footer className="mt-[96px] xl:mt-[128px] w-full bg-[#1A1E43] text-white">
      {/* уменьшаем внутренние отступы на lg, прежние — на xl */}
      <div className="px-4 sm:px-6 lg:px-10 xl:px-[150px] py-10 sm:py-12 xl:py-[66px] flex flex-col gap-y-10 xl:gap-y-[64px]">
        {/* TOP */}
        <div className="w-full grid grid-cols-1 gap-8 xl:grid-cols-[auto,1fr] xl:items-start">
          {/* logo */}
          <div className="flex items-center">
            <img
              src="/MainPage/Logo.svg"
              alt="Logo"
              className="w-[170px] sm:w-[190px] lg:w-[200px] xl:w-[220px] h-[34px] sm:h-[38px] xl:h-[40px]"
            />
          </div>

          {/* колонки ссылок: 1 → 2 → 3 → 4 (lg) → 5 (xl) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-8 xl:gap-x-[64px] w-full">
            {menu.map((group, idx) => (
              <div key={idx} className="min-w-0 xl:min-w-[160px]">
                <p className="text-white leading-[22px] xl:leading-[24px] text-[17px] lg:text-[18px] xl:text-[20px] font-bold mb-3 xl:mb-[32px]">
                  {group.Head}
                </p>
                <div className="flex flex-col gap-2.5 lg:gap-[14px] xl:gap-[16px]">
                  {group.links.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className="block text-white/90 hover:text-white transition leading-[18px] xl:leading-[19px] text-[13px] lg:text-[14px] xl:text-[16px] whitespace-normal break-words"
                    >
                      {item.link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/20" />

        {/* BOTTOM */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="text-white/90 leading-[18px] xl:leading-[19px] text-[13px] lg:text-[14px] xl:text-[16px]">
            © 2024 Ascenda. All rights reserved.
          </span>

          {/* иконки уменьшаем на lg, расширяем на xl; разрешаем перенос */}
          <div className="h-auto flex flex-wrap gap-3 sm:gap-4 items-center">
            <a href="#"><img src="/Icons/twitter.svg"  alt="X"         className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px]" /></a>
            <a href="#"><img src="/Icons/in.svg"       alt="LinkedIn"  className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px]" /></a>
            <a href="#"><img src="/Icons/watsapp.svg"  alt="WhatsApp"  className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px]" /></a>
            <a href="#"> <img src="/Icons/facebook.svg" alt="Facebook"  className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px]" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
