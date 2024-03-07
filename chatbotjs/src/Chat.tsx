import React, { useEffect, useState } from 'react';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KeLSEuc92jy
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';

interface ChatbotConfig {
  id: number;
  welcomeMessage: string;
  displayBranding: boolean;
  chatTitle: string;
  chatMessagePlaceHolder: string;
}

export default function ChatBox() {
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()
  const [isChatVisible, setIsChatVisible] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({
      api: `${siteConfig.url}api/chatbots/${window.chatbotConfig.chatbotId}/chat`,
    });

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const init = async () => {
      const id = window.chatbotConfig.chatbotId
      setChatbotId(id)

      const config = await fetch(`${siteConfig.url}api/chatbots/${id}/config`)
      const chatbotConfig: ChatbotConfig = await config.json()
      setConfig(chatbotConfig)
    };
    init();
  }, [])

  const chatboxClassname = isMobile ? "fixed inset-0 flex flex-col" : "mr-4 flex flex-col max-w-md max-h-[80vh]";
  const inputContainerClassname = isMobile ? "fixed bottom-0 left-0 w-full bg-white" : "";
  const inputContainerHeight = 90; // Adjust this value based on your actual input container height


  return (
    <div className="fixed bottom-0 right-0 mb-4 z-50 flex items-end">
      {isChatVisible &&
        <Card className={chatboxClassname + " m-1 bg-white shadow-lg rounded-lg transform transition-transform duration-200 ease-in-out" + (isMobile ? " overflow-auto" : "")}>

          <div className="flex shadow justify-between items-center pt-2 pb-2 pl-4 pr-4">
            <h3 className="text-lg font-semibold">{config ? config!.chatTitle : ""}</h3>
            <div>
              <Button onClick={toggleChatVisibility} variant="ghost">
                <Icons.close className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4 flex-grow overflow-auto custom-scrollbar" style={{ marginBottom: isMobile ? `${inputContainerHeight}px` : '0' }}>

            <div className="space-y-4">
              <div key="0" className="flex items-end gap-2">
                <div className="rounded-lg bg-zinc-200 p-2">
                  <p className="text-sm">{config ? config!.welcomeMessage : ""}</p>
                </div>
              </div>
              {
                messages.map((message: Message) => {
                  if (message.role === "assistant") {
                    return (
                      <div key={message.id} className="flex items-end gap-2">
                        <div className="rounded-lg bg-zinc-200 p-2">
                          {message.content.replace(/\【\d+†source】/g, '') // Remove citation markers
                            .split('```').map((block, blockIdx) => {
                              // Check if the block is a code block or normal text
                              if (blockIdx % 2 === 1) {
                                // Render code block
                                return <pre key={blockIdx}><code>{block}</code></pre>;
                              } else {
                                // Process normal text for ** and \n
                                return block.split('\n').map((line, lineIndex, lineArray) => (
                                  <p key={`${blockIdx}-${lineIndex}`} className={`text-sm ${lineIndex < lineArray.length - 1 ? 'mb-4' : ''}`}>
                                    {line.split('**').map((segment, segmentIndex) => {
                                      // Render bold text for segments surrounded by **
                                      if (segmentIndex % 2 === 1) {
                                        return <strong key={segmentIndex}>{segment}</strong>;
                                      } else {
                                        // Render normal text for other segments
                                        return <span key={segmentIndex}>{segment}</span>;
                                      }
                                    })}
                                  </p>
                                ));
                              }
                            })}
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={message.id} className="flex items-end gap-2 justify-end">
                        <div className="rounded-lg bg-blue-500 text-white p-2">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    )
                  }
                })
              }

              {status === 'in_progress' && (
                <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
          <div className={inputContainerClassname}>
            {config?.displayBranding === true && (
              <div className="text-center text-zinc-400 text-sm mb-2">
                Powered by <a href="https://www.openassistantgpt.io/">{siteConfig.name}</a>
              </div>
            )}
            <div className="border-t border-gray-200 p-2">
              <div
                className='w-full flex items-center gap-2'
              >
                <form onSubmit={submitMessage}
                  className="flex align-right items-end w-full"
                >
                  <Input
                    disabled={status !== 'awaiting_message'}
                    className="w-full border-0"
                    value={input}
                    placeholder={config ? config!.chatMessagePlaceHolder : ""}
                    onChange={handleInputChange}
                  />
                  <Button type="submit"
                    disabled={status !== 'awaiting_message'}
                    className="flex-none w-1/6"
                  >
                    {status !== 'awaiting_message' && (
                      <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {status === 'awaiting_message' && (
                      <IconSend className="mr-2 h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div >
        </Card >
      }
      {
        !isChatVisible &&
        <button className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4"
          onClick={toggleChatVisibility}>
          {!isChatVisible && <Icons.message />}
          {isChatVisible && <Icons.close />}
        </button>

      }
      {
        isChatVisible && !isMobile &&
        <button className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4"
          onClick={toggleChatVisibility}>
          {!isChatVisible && <Icons.message />}
          {isChatVisible && <Icons.close />}
        </button>
      }
    </div >
  )
}

function IconSend(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
