'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

import { JournalEntry } from '@/lib/db/schema';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function JournalPage() {
  const [englishText, setEnglishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!englishText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ englishText }),
      });

      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }

      const entry = await response.json();
      setEnglishText('');
      await fetchEntries(); // Refresh the list
      // TODO: Show success toast
    } catch (error) {
      console.error('Error creating journal entry:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Daily Journal</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Write about your day</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Write in English about your day, thoughts, or anything you'd like to express in Spanish..."
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                className="min-h-[200px] w-full"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !englishText.trim()}
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : entries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No journal entries yet. Start writing above!
              </p>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entry.createdAt), 'MMMM d, yyyy h:mm a')}
                        </p>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">English</h4>
                            <p className="text-sm">{entry.englishText}</p>
                          </div>
                          {entry.spanishText && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Spanish</h4>
                              <p className="text-sm">{entry.spanishText}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => router.push(`/dashboard/journal/${entry.id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
