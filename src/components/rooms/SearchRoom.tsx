
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchRoom = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWikipedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(
          query
        )}`
      );
      
      if (!response.ok) {
        throw new Error("Wikipedia search failed");
      }
      
      const data = await response.json();
      setResults(data.query.search);
    } catch (err) {
      console.error("Error searching Wikipedia:", err);
      setError("Failed to search Wikipedia. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getWikipediaPageUrl = (pageId: number) => {
    return `https://en.wikipedia.org/?curid=${pageId}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Search className="h-6 w-6 text-grindos-purple" />
        Search Room
      </h1>
      
      <div className="mb-8">
        <form onSubmit={searchWikipedia} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : <Search className="mr-2" />}
            Search
          </Button>
        </form>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      <div className="space-y-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
        ) : results.length > 0 ? (
          results.map((result) => (
            <Card key={result.pageid}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">
                  <a
                    href={getWikipediaPageUrl(result.pageid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grindos-purple hover:underline"
                  >
                    {result.title}
                  </a>
                </h3>
                <p
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
                <div className="mt-2">
                  <a
                    href={getWikipediaPageUrl(result.pageid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-grindos-purple hover:underline"
                  >
                    Read more on Wikipedia
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        ) : query ? (
          <p className="text-center py-8 text-muted-foreground">
            No results found for "{query}"
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchRoom;
