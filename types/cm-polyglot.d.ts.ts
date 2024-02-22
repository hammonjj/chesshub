declare module 'cm-polyglot' {
  interface BookEntry {
      get_from_col(): number;
      get_from_row(): number;
      get_to_col(): number;
      get_to_row(): number;
      get_promo_piece(): number;
      weight: number;
      isOOW(): boolean;
      isOOOW(): boolean;
      isOOB(): boolean;
      isOOOB(): boolean;
  }

  interface Move {
      from: string;
      to: string;
      promotion?: string;
      weight?: number;
      probability?: string;
  }

  export class Polyglot {
      constructor(url: string);

      entryToMove(bookEntry: BookEntry): Move;

      getMovesFromFen(fen: string, weightPower?: number): Promise<Move[]>;

      fetchBook(url: string): Promise<void>;
  }
}