import { Card, CardContent, CardHeader, CardFooter } from './ui/card';
import { ExternalLink, BookOpen, Calendar, Building } from 'lucide-react';

export function CaseCard({ item }) {
  // Format date if available
  const formattedDate = item.date 
    ? new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;
    
  // Determine if the case has a URL to link to
  const hasLink = !!item.url;
  
  return (
    <Card className="hover:shadow-md transition-all duration-200 h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex-grow">
        {hasLink ? (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-base font-semibold text-brand-700 dark:text-brand-400 hover:underline hover:text-brand-800 dark:hover:text-brand-300 transition-colors flex items-start gap-1"
          >
            {item.caseName || 'Unnamed Case'}
            <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
          </a>
        ) : (
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {item.caseName || 'Unnamed Case'}
          </h3>
        )}
        
        <div className="mt-2 flex flex-wrap gap-2">
          {item.citation && (
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300">
              <BookOpen className="mr-1 h-3 w-3" />
              {item.citation}
            </span>
          )}
          
          {item.court && (
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
              <Building className="mr-1 h-3 w-3" />
              {item.court}
            </span>
          )}
          
          {formattedDate && (
            <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-xs text-green-700 dark:text-green-300">
              <Calendar className="mr-1 h-3 w-3" />
              {formattedDate}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {item.snippet ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {item.snippet}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No summary available.
          </p>
        )}
      </CardContent>
      
      {hasLink && (
        <CardFooter className="pt-0">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors flex items-center"
          >
            View full case
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
}