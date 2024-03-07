import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { MessagesOverview } from "@/components/message-overview"
import { OpenAIForm } from "@/components/openai-config-form"
import CardHeading from '@/components/ui/CardHeading';

export const metadata = {
  title: `${siteConfig.name} - Dashboard`,
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const bots = await db.chatbot.count({
    where: {
      userId: user.id,
    },
  })

  const crawlers = await db.crawler.count({
    where: {
      userId: user.id,
    },
  })

  const files = await db.file.count({
    where: {
      userId: user.id,
    },
  })

  const messageCountLast30Days = await db.message.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }
  })

  const openaiConfig = await db.openAIConfig.findFirst({
    where: {
      userId: user.id,
    },
  })

  // get message for each day for the last 7 days
  const messages = await db.message.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    },
    select: {
      createdAt: true,
    },
  })

  const data: any = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    data.push({ name: formattedDate, total: 0 });
  }

  // Count messages for each day
  messages.forEach(message => {
    const messageDate = message.createdAt.toISOString().split('T')[0];
    const dataEntry = data.find(entry => entry.name === messageDate);
    if (dataEntry) {
      dataEntry.total++;
    }
  });

  // Reverse the data array to start from the oldest date
  data.reverse();

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" />
      
    <div className="card">
    <CardHeading title="Overview" />
        
        {
          !openaiConfig &&
          <div className="mb-4">
            <OpenAIForm />
          </div>
        }
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Chatbots
              </CardTitle>
              <div className="icon">
              <Icons.bot className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bots}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Crawlers
              </CardTitle>
              <div className="icon">
              <Icons.bot className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crawlers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="icon">
              <Icons.bot className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm font-medium">
                Total Files
              </CardTitle>
             
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Messages last 30 days
              </CardTitle>
              <div className="icon">
              <Icons.bot className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageCountLast30Days}</div>
            </CardContent>
          </Card>
          </div>
          </div>
         
      <Card>
        <CardHeader>
        <CardHeading title="Messages per day" className="blue" />

        </CardHeader>
        <CardContent className="pl-2" id="last">
          <MessagesOverview items={data} />
        </CardContent>
      </Card>
      
    </DashboardShell >
  )
}