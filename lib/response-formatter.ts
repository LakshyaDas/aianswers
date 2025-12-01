export interface FormattedResponse {
  title?: string;
  sections: Section[];
  summary?: string;
}

export interface Section {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'note' | 'highlight';
  content: string;
  level?: number;
  items?: string[];
}

export function formatAIResponse(text: string): FormattedResponse {
  const sections: Section[] = [];
  const lines = text.split('\n');

  let currentText = '';
  let i = 0;

  // Clean markdown symbols
  const clean = (str: string) => {
    return str
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .trim();
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Empty line = close current paragraph
    if (!trimmedLine) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }
      continue;
    }

    // H2 ##
    if (trimmedLine.startsWith('##')) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }

      sections.push({
        type: 'heading',
        content: clean(trimmedLine.replace(/^#+\s*/, '')),
        level: 2,
      });
      continue;
    }

    // H1 #
    if (trimmedLine.startsWith('#')) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }

      sections.push({
        type: 'heading',
        content: clean(trimmedLine.replace(/^#+\s*/, '')),
        level: 1,
      });
      continue;
    }

    // Bullet list
    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }

      const items: string[] = [];

      while (i < lines.length) {
        const bullet = lines[i].trim();

        if (!bullet || (!bullet.startsWith('-') && !bullet.startsWith('*'))) {
          i--;
          break;
        }

        items.push(clean(bullet.replace(/^[-*]\s*/, '')));
        i++;
      }

      if (items.length > 0) {
        sections.push({
          type: 'list',
          content: '',
          items,
        });
      }

      continue;
    }

    // Code block ```
    if (trimmedLine.startsWith('```')) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }

      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      sections.push({
        type: 'code',
        content: codeLines.join('\n'),
      });

      continue;
    }

    // Note / Blockquote >
    if (trimmedLine.startsWith('>')) {
      if (currentText.trim()) {
        sections.push({
          type: 'paragraph',
          content: clean(currentText.trim()),
        });
        currentText = '';
      }

      sections.push({
        type: 'note',
        content: clean(trimmedLine.replace(/^>\s*/, '')),
      });
      continue;
    }

    // Normal paragraph text
    if (currentText) currentText += ' ';
    currentText += trimmedLine;
  }

  // Add last paragraph
  if (currentText.trim()) {
    sections.push({
      type: 'paragraph',
      content: clean(currentText.trim()),
    });
  }

  return {
    sections,
  };
}
