import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { UserAvatar } from "@/components/user-avatar"
import { UserAccountNav } from "@/components/user-account-nav"
import { ChatbotCreateButton } from "@/components/chatbot-create-button"
import { UpgradePlanButton } from "@/components/upgrade-plan-button"
 // Add useState import at the top of your file

interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const user = await getCurrentUser()

    if (!user) {
        return notFound()
    }

    return (
        <div className="flex min-h-screen flex-col space-y-6">
           <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
            <MainNav />
            
            {/* This div acts as a flex container for all right-aligned items */}
            <div className="flex items-center">
               
                
                {/* Placeholder navigation items */}
                <a href="/link1" className="text-sm px-4 py-2 leading-none rounded text-color-primary hover:text-color-primary-hover focus:outline-none mr-4">
                    Documenation
                </a>
                 {/* UserAccountNav component */}
                 <UserAccountNav
                user={{
                    name: user.name,
                    image: user.image,
                    email: user.email,
                }}
            />
                {/* ChatbotCreateButton component */}
                <ChatbotCreateButton className="ml-8" />
            </div>
        </div>
    </header>
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
            
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav items={dashboardConfig.sidebarNav} />
                    <div className="upgrade">
                    <div className="sidebar__mail"><button className="sidebar__close"><svg className="icon icon-close">
                       
                    </svg></button>
                        <div className="sidebar__info">Unlock premium features.</div>
                    <UpgradePlanButton size="sm" id="upgrade" />
                    </div>
                    </div>

                    
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>

            </div>
        </div>
    )
}
