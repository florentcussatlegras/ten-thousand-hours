// "use client";

// default function UserMenuClient({ session }: {session: any}) {
//   const { data, isPending } = useSession();

//   // On utilise la session client si disponible, sinon celle du serveur
//   const finalSession = data ?? session;

//   if (!finalSession && isPending) return null;

//   return finalSession ? (
//     <div>Bonjour {finalSession.user.name}</div>
//   ) : (
//     <div>Connexion</div>
//   );
// }

"use client";

import { SignOutButton } from "@/app/auth/sign-out/sign-out-button";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  Image,
} from "@heroui/react";
import { ThemeSwitch } from "../../components/theme-switch";
import { GithubIcon } from "../../components/icons";
import {
  Calendar,
  GraduationCap,
  HelpCircle,
  LogOut,
  Menu,
  Mail,
  Settings,
  User,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentStudySession } from "@/app/actions/actions";
import { CurrentStudySession } from "../../components/current-study-session";
import { useSession } from "@/app/lib/auth-client";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width = null,
  height = null,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const UserIcon = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user-icon lucide-user text-sky-500 border"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default function NavBarClient({ session }: { session: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isPending } = useSession();

  // On utilise la session client si disponible, sinon celle du serveur
  const finalSession = data ?? session;

  if (!finalSession && isPending) return null;

  return (
    <>
      <Navbar
        classNames={{
          base: "w-full px-2 2xl:px-0 my-2 md:my-4", // enleve padding du <nav>
          wrapper: "w-full px-2 2xl:px-0", // enleve padding du wrapper interne
        }}
        maxWidth="full" // IMPORTANT : sinon HeroUI remet un max-w + centrage
        className="bg-white dark:bg-dark-bg max-w-[1536px] mx-auto"
      >
        <NavbarContent className="md:hidden" justify="start">
          <button className="p-2" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </NavbarContent>

        <NavbarBrand className="hidden md:flex md:w-1/10 md:max-w-1/10 lg:w-1/4 lg:min-w-1/4">
          <Link href="/" className="text-default-600 hidden md:flex">
            {/* <Image src="/logo-10000.png" width={80} /> */}
            <p className="hidden lg:flex font-extrabold text-4xl text-sky-500 brand-title font-[Cabinet]">
              Ten Thousand Hours
            </p>
          </Link>
        </NavbarBrand>

        {finalSession?.user && (
          <NavbarContent justify="center">
            <NavbarContent className="flex-row flex-nowrap items-center bg-content2 dark:bg-content1 hidden h-12 w-full max-w-fit gap-4 rounded-full px-4 md:flex mr-4">
              <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
                <Link
                  className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                  href="/profile"
                  data-react-aria-pressable="true"
                  role="link"
                >
                  <LayoutDashboard className="text-gray-800 dark:text-gray-200" />
                  <span className="hidden xl:block text-sm">
                    Tableau de bord
                  </span>
                </Link>
              </NavbarItem>
              <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
                <Link
                  className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                  href="/studies"
                  data-react-aria-pressable="true"
                  role="link"
                >
                  <GraduationCap className="text-gray-800 dark:text-gray-200" />
                  <span className="hidden xl:block text-sm">
                    Apprentissages
                  </span>
                </Link>
              </NavbarItem>
              <NavbarItem
                className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary"
                // data-active="true"
              >
                <Link
                  className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                  href="/scheduler"
                  data-react-aria-pressable="true"
                  role="link"
                  aria-current="page"
                >
                  <Calendar className="text-gray-800 dark:text-gray-200" />
                  <span className="hidden xl:block text-sm">Calendrier</span>
                </Link>
              </NavbarItem>
              {/* <NavbarItem
                className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary"
                // data-active="true"
              >
                <Link
                  className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                  href="/about"
                  data-react-aria-pressable="true"
                  role="link"
                  aria-current="page"
                >
                  <HelpCircle className="text-gray-800" />
                  <span className="hidden 2xl:block text-sm">A propos</span>
                </Link>
              </NavbarItem>
              <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
                <Link
                  className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                  href="/contact"
                  data-react-aria-pressable="true"
                  role="link"
                >
                  <Mail className="text-gray-800" />
                  <span className="hidden 2xl:block text-sm">Contact</span>
                </Link>
              </NavbarItem> */}
            </NavbarContent>
          </NavbarContent>
        )}

        <NavbarContent justify="center">
          {finalSession?.user ? (
            <>
              <CurrentStudySession />
              <Link href="https://github.com/florentcussatlegras/tenthousandshours">
                <GithubIcon />
              </Link>
              <ThemeSwitch />
              <div className="hidden md:flex">
                <Dropdown
                  placement="bottom-end"
                  classNames={{
                    content:
                      "bg-white dark:bg-content1",
                  }}
                >
                  <DropdownTrigger>
                    {finalSession.user.image ? (
                      <Avatar
                        isBordered
                        as="button"
                        className="transition-transform cursor-pointer"
                        color="primary"
                        name="Florent Cussatlegras"
                        size="sm"
                        src={finalSession.user.image}
                      />
                    ) : (
                      <button className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500 text-white cursor-pointer uppercase">
                        {finalSession.user.firstname.slice(0, 2)}
                      </button>
                    )}
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="profil"
                    variant="flat"
                    classNames={{
                      base: "bg-white dark:bg-content1 border-none shadow-none ring-0 outline-none",
                      list: "border-none shadow-none ring-0 outline-none",
                    }}
                  >
                    <DropdownItem
                      key="profile"
                      className="gap-2 bg-default-200 flex flex-row"
                    >
                      <Link
                        href="/profile"
                        className="font-semibold text-sky-500 text-md items-center gap-1"
                      >
                        <User />
                        {finalSession.user.email}
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="settings">
                      <Link
                        href="/settings"
                        className="text-md gap-1 text-black dark:text-gray-200"
                      >
                        <Settings />
                        Mes paramètres
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="about">
                      <Link
                        href="/about"
                        className="text-md gap-1 text-black dark:text-gray-200"
                      >
                        <HelpCircle />A propos
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="contact">
                      <Link
                        href="/contact"
                        className="text-md gap-1 text-black dark:text-gray-200"
                      >
                        <Mail />
                        Contact
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger">
                      <SignOutButton />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              <Link href="https://github.com/florentcussatlegras/tenthousandshours">
                <GithubIcon />
              </Link>
              <ThemeSwitch />
              <div className="hidden md:flex gap-2">
                <NavbarItem>
                  <Button
                    as={Link}
                    className="border-2 border-sky-500 text-sky-500 font-bold dark:border-default-500 dark:text-white"
                    variant="bordered"
                    href="/auth/sign-in"
                    radius="sm"
                  >
                    CONNEXION
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={Link}
                    className="bg-sky-500 text-white font-bold dark:bg-default-500 dark:text-white"
                    href="/auth/sign-up"
                    radius="sm"
                  >
                    INSCRIPTION
                  </Button>
                </NavbarItem>
              </div>
            </>
          )}
        </NavbarContent>
      </Navbar>

      {/* ===== SIDEBAR MOBILE ===== */}
      <div
        className={`fixed inset-0 bg-white dark:bg-dark-bg backdrop-blur-sm z-40 transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white dark:bg-neutral-900 shadow-xl z-50 
          transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col justify-between items-center p-4">
          <button onClick={() => setSidebarOpen(false)} className="ml-auto">
            <X size={26} />
          </button>

          <Link href="/" className="text-default-600 flex">
            <Image src="/logo-10000.png" width="100" />
          </Link>
        </div>

        <nav className="flex flex-col py-4 gap-4 px-4 text-lg items-center">
          <div className="flex flex-col max-w-auto w-3/4 gap-2">
            {!finalSession ? (
              <>
                <Link href="/auth/sign-in" className="mt-4 font-semibold">
                  Connexion
                </Link>
                <Link href="/auth/sign-up" className="font-semibold">
                  Inscription
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/studies"
                  className="flex items-center gap-2 text-black text-sm"
                >
                  <LayoutDashboard className="text-gray-800" /> Tableau de bord
                </Link>

                <Link
                  href="/studies"
                  className="flex items-center gap-2 text-black text-sm"
                >
                  <GraduationCap className="text-gray-800" /> Apprentissages
                </Link>

                <Link
                  href="/scheduler"
                  className="flex items-center gap-2 text-black text-sm"
                >
                  <Calendar className="text-gray-800" /> Calendrier
                </Link>

                <Link
                  href="/settings"
                  className="text-md gap-2 text-black text-sm"
                >
                  <Settings />
                  Mes paramètres
                </Link>

                <Link
                  href="/about"
                  className="text-md gap-2 text-black text-sm"
                >
                  <HelpCircle />A propos
                </Link>

                <Link
                  href="/contact"
                  className="text-md gap-2 text-black text-sm"
                >
                  <Mail />
                  Contact
                </Link>

                <div className="mt-4">
                  <SignOutButton gap={2} charSize="sm" />
                </div>

                {/* <Link
                  href="/about"
                  className="flex items-center gap-2 text-black"
                >
                  <HelpCircle className="text-gray-800" /> A propos
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-black"
                >
                  <Mail className="text-gray-800" /> Contact
                </Link> */}
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
