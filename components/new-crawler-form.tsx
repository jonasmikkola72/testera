"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";


// Define the schema based on your GPT Crawler's config schema
const crawlerConfigSchema = z.object({
  url: z.string(),
  match: z.string().or(z.array(z.string())),
  exclude: z.string().or(z.array(z.string())).optional(),
  selector: z.string().optional().default("body"),
  maxPagesToCrawl: z.number().int().positive().optional().default(50),
  outputFileName: z.string().optional().default("output.json"),
  // Add other fields as necessary
});

type FormData = z.infer<typeof crawlerConfigSchema>;

export function NewCrawlerForm({ className, ...props }: {
    className?: string;
}) {

  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(crawlerConfigSchema),
    defaultValues: {
      url: '',
      match: '',
      exclude: '',
      selector: 'body',
      maxPagesToCrawl: 50,
      outputFileName: 'output.json',
    }
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

    async function onSubmit(data: FormData) {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/crawlers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const error = new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
                throw error;
            }

            const json = await response.json();
            toast({
                description: "Your crawler configuration has been saved.",
            });
            router.push(`/dashboard/crawlers/${json.id}/results`);
        } catch (error: any) {
            console.error("Submission error:", error);
            toast({
                title: "Something went wrong.",
                description: error.message || "Your crawler configuration was not saved. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }


    return (
      <Form {...form}>
        <form className={cn(className)} onSubmit={form.handleSubmit(onSubmit)} {...props}>
          {/* URL Input Field */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="url">Crawl URL</FormLabel>
                <Input id="url" {...field} />
                <FormDescription>URL to start the crawl from.</FormDescription>
              </FormItem>
            )}
          />
          {/* Match Input Field */}
          <FormField
            control={form.control}
            name="match"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="match">URL Match</FormLabel>
                <Input id="match" {...field} />
                <FormDescription>URL patterns to match during crawling.</FormDescription>
              </FormItem>
            )}
          />
          {/* Exclude Input Field */}
          <FormField
            control={form.control}
            name="exclude"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="exclude">Exclude URL Patterns</FormLabel>
                <Input id="exclude" {...field} />
                <FormDescription>URL patterns to exclude during crawling.</FormDescription>
              </FormItem>
            )}
          />
          {/* Selector Input Field */}
          <FormField
            control={form.control}
            name="selector"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="selector">Selector</FormLabel>
                <Input id="selector" {...field} />
                <FormDescription>DOM selector for content extraction.</FormDescription>
              </FormItem>
            )}
          />
          {/* Additional fields as necessary */}
          <CardFooter>
            <button
              type="submit"
              className={cn(buttonVariants(), className)}
              disabled={isSaving}
            >
              {isSaving ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
              <span>Start Crawling</span>
            </button>
          </CardFooter>
        </form>
      </Form>
    );
  
}