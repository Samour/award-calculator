export abstract class ShiftFileParsingException extends Error { }

export class EmptyShiftFileException extends ShiftFileParsingException { }

export class ShiftFileUpload {
  async uploadFile(file: File) {
    const rawRows = this.splitRows(await this.readFileContent(file));

    console.log(rawRows); // TODO continue
  }

  private readFileContent(file: File): Promise<string> {
    const reader = new FileReader();

    const result = new Promise<string>((res) => {
      reader.onload = (readEvent: ProgressEvent<FileReader>) => {
        if (typeof readEvent.target?.result === 'string') {
          res(readEvent.target.result as string);
        }
      };
    });

    reader.readAsText(file);

    return result;
  }

  private splitRows(textContent: string): { headerRow: string, contentRows: string[] } {
    const rows = textContent.split('\n').map((r) => r.trim());

    if (rows.length > 0 && rows[rows.length - 1].length === 0) {
      rows.pop();
    }

    if (!rows.length) {
      throw new EmptyShiftFileException();
    }

    return {
      headerRow: rows[0],
      contentRows: rows.slice(1),
    };
  }
}

export const useShiftFileUpload = () => {
  return new ShiftFileUpload();
};
