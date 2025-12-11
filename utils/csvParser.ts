import { TripEvent } from '../types';

export const parseCSV = (csv: string): TripEvent[] => {
  // Split lines but respect newline inside quotes
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    }
    if (char === '\n' && !insideQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Regex to match CSV fields: "field",field,"field,with,comma"
  const re_value = /(?!\s*$)\s*(?:'([^']*(?:''[^']*)*)'|"([^"]*(?:""[^"]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  const events: TripEvent[] = [];

  // Skip header (index 0) and iterate
  // Note: Starting from index 1 assuming first line is header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(',,,')) continue; // Skip empty rows

    const matches = [];
    let match;
    // reset regex index
    re_value.lastIndex = 0;
    while ((match = re_value.exec(line)) !== null) {
       // match[2] is quoted value, match[3] is unquoted
       let val = match[2] || match[3] || '';
       val = val.replace(/""/g, '"').trim(); // Unescape double quotes
       matches.push(val);
    }
    
    // Sometimes regex misses empty fields at the start/middle if not careful,
    // simplistic split if complex regex fails or for simple lines:
    // But given the CSV complexity (quotes), we trust the regex loop or a simpler approach for known structure.
    
    // Alternative simpler split for this specific dataset structure:
    // This dataset has 7 columns: Name, Day, Link, Notes, Price, TimeFrame, Type
    
    // Let's refine the matching logic for array construction
    const columns: string[] = [];
    let inQuote = false;
    let field = '';
    for(let c = 0; c < line.length; c++) {
        const char = line[c];
        if(char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            columns.push(field.trim());
            field = '';
        } else {
            field += char;
        }
    }
    columns.push(field.trim()); // Push last field

    // Clean up quotes surrounding the field value if they exist
    const cleanColumns = columns.map(col => {
        if (col.startsWith('"') && col.endsWith('"')) {
            return col.slice(1, -1).replace(/""/g, '"');
        }
        return col;
    });

    if (cleanColumns.length >= 2 && cleanColumns[1].startsWith('Day')) {
      events.push({
        id: `event-${i}`,
        name: cleanColumns[0] || 'Unknown Activity',
        day: cleanColumns[1],
        link: cleanColumns[2] || '',
        notes: cleanColumns[3] || '',
        price: cleanColumns[4] || '',
        timeFrame: cleanColumns[5] || '',
        type: cleanColumns[6] || 'Unknown',
      });
    }
  }

  return events;
};