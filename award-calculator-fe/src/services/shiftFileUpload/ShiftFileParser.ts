import { WorkerShiftRow } from 'models/inputs/table';
import { buildWorkerShiftRowParser } from './WorkerShiftRowParser';
import { EmptyShiftFileException, NotCsvContentTypeException } from './exceptions';

const csvContentType = /^text\/csv(\+.*)?$/;

export class ShiftFileParser {
  async parseFile(file: File): Promise<WorkerShiftRow[]> {
    if (!csvContentType.test(file.type)) {
      throw new NotCsvContentTypeException();
    }

    const { headerRow, contentRows } = this.splitRows(await this.readFileContent(file));

    const rowParser = buildWorkerShiftRowParser(headerRow);
    return contentRows.map((r) => rowParser.parseRow(r));
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
