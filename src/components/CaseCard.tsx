// src/components/CaseCard.tsx
import { Card, CardContent, CardHeader } from "./ui/card";

export type CaseItem = {
  id: number | string;
  caseName: string;
  citation: string | null;
  court: string | null;
  date: string | null;
  url: string | null;
  snippet: string | null;
};

export function CaseCard({ item }: { item: CaseItem }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <a href={item.url ?? undefined} target="_blank" rel="noreferrer" className="text-base font-semibold text-brand-700 hover:underline">
          {item.caseName}
        </a>
        <div className="mt-1 text-xs text-gray-500 space-x-2">
          {item.citation && <span>{item.citation}</span>}
          {item.court && <span>• {item.court}</span>}
          {item.date && <span>• {new Date(item.date).toLocaleDateString()}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3">{item.snippet ?? "No summary available."}</p>
      </CardContent>
    </Card>
  );
}