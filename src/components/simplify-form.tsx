"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wand2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { simplifyText } from "@/ai/flows/simplify-text";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  complexText: z.string().min(10, {
    message: "Please enter at least 10 characters to simplify.",
  }).max(2000, {
    message: "Text cannot be longer than 2000 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function SimplifyForm() {
  const [simplifiedText, setSimplifiedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complexText: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSimplifiedText("");
    try {
      const result = await simplifyText({ complexText: values.complexText });
      if (result?.simplifiedText) {
        setSimplifiedText(result.simplifiedText);
      } else {
        throw new Error("The simplified text was not returned.");
      }
    } catch (error) {
      console.error("Simplification error:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "We couldn't simplify your text. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-foreground/90">
          I am 5 years old
        </h1>
        <p className="text-muted-foreground mt-3 text-lg md:text-xl">
           Explain It Simply
        </p>
      </div>
      <Card className="w-full shadow-2xl rounded-2xl border-border/20 shadow-primary/10">
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="complexText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Photosynthesis is the process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy.'"
                        className="min-h-[150px] resize-none text-base rounded-lg bg-background/50 border-border focus-visible:ring-primary/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Simplifying...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Simplify
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || simplifiedText) && (
        <div className="mt-8">
            <Card className="w-full shadow-xl rounded-2xl border-accent/60 bg-gradient-to-br from-accent/20 to-accent/5 transition-all animate-in fade-in duration-500">
                <CardHeader className="flex-row items-start gap-4 space-y-0 p-6 sm:p-8">
                    <div className="bg-accent/30 p-3 rounded-full">
                        <Sparkles className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-semibold text-foreground/90">For the 5 year olds</CardTitle>
                        <CardDescription className="mt-1"></CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                    {isLoading ? (
                        <div className="space-y-3 pt-2">
                            <Skeleton className="h-6 w-4/5 rounded-md bg-accent/20" />
                            <Skeleton className="h-6 w-full rounded-md bg-accent/20" />
                            <Skeleton className="h-6 w-3/4 rounded-md bg-accent/20" />
                        </div>
                    ) : (
                        <p className="text-xl/relaxed text-foreground/80">
                            {simplifiedText}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
