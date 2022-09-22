import { Dialog, Transition } from '@headlessui/react';
import produce from 'immer';
import { Fragment, useState } from 'react';
import { NextPageWithLayout } from './_app';

enum Cell {
  Empty = '',
  Circle = 'O',
  Cross = 'X',
}

enum Player {
  First = 1,
  Second = 2,
}

type Board = [Cell[], Cell[], Cell[]];

const Offline: NextPageWithLayout = () => {
  const emptyBoard: Board = [
    [Cell.Empty, Cell.Empty, Cell.Empty],
    [Cell.Empty, Cell.Empty, Cell.Empty],
    [Cell.Empty, Cell.Empty, Cell.Empty],
  ];
  const [isGameWon, setIsGameWon] = useState(false);
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [activePlayer, setActivePlayer] = useState(Player.First);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    const cell = board[rowIndex][columnIndex];
    if (cell === Cell.Empty) {
      if (activePlayer === Player.First) {
        const newBoard = produce(board, (draft) => {
          draft[rowIndex][columnIndex] = Cell.Circle;
        });
        setBoard(newBoard);
        checkWinCondition(rowIndex, columnIndex, newBoard, Cell.Circle);
        setActivePlayer(Player.Second);
      }
      if (activePlayer === Player.Second) {
        const newBoard = produce(board, (draft) => {
          draft[rowIndex][columnIndex] = Cell.Cross;
        });
        setBoard(newBoard);
        checkWinCondition(rowIndex, columnIndex, newBoard, Cell.Cross);
        setActivePlayer(Player.First);
      }
    }
    return;
  };

  const borderStyle = (rowIndex: number, columnIndex: number) => {
    switch (columnIndex) {
      case 0:
        return `border-r-2  ${rowIndex <= 1 && 'border-b-2'}`;
      case 1:
        return `${rowIndex <= 1 && 'border-b-2'}`;
      default:
        return `border-l-2 ${rowIndex <= 1 && 'border-b-2'}`;
    }
  };

  const checkWinCondition = (
    rowIndex: number,
    columnIndex: number,
    board: Board,
    cell: Cell,
  ) => {
    const isRowWin = board[rowIndex].every((c) => c === cell);
    if (isRowWin) {
      setIsGameWon(true);
      return;
    }
    const col: string[] = [];
    board.forEach((row) => {
      col.push(row[columnIndex]);
    });
    const isColWin = col.every((c) => c === cell);
    if (isColWin) {
      setIsGameWon(true);
      return;
    }

    const diagSum = rowIndex + columnIndex;
    // Cell is in diagonal position
    if (diagSum % 2 === 0) {
      const leftDiag: string[] = [];
      const rightDiag: string[] = [];
      board.forEach((row, i) => {
        leftDiag.push(row[i]);
        rightDiag.push(row[row.length - 1 - i]);
      });
      const isLeftDiagWin = leftDiag.every((c) => c === cell);
      const isRightDiagWin = rightDiag.every((c) => c === cell);
      if (isLeftDiagWin || isRightDiagWin) {
        setIsGameWon(true);
        return;
      }
    }

    const isGameOver = !board.some((row) => row.includes(Cell.Empty));
    if (isGameOver) {
      setIsGameOver(true);
      return;
    }
  };

  const resetGame = () => {
    setActivePlayer(Player.First);
    setBoard(emptyBoard);
    setIsGameWon(false);
    setIsGameOver(false);
  };

  return (
    <>
      <div className="flex max-w-sm flex-col gap-24 rounded-lg bg-white p-8 text-center">
        <h2 className="text-2xl font-bold tracking-wide text-slate-800">
          Player {activePlayer} turn
        </h2>
        <div className="flex flex-col gap-6 text-start text-slate-800">
          <ul className="flex h-[240px] w-[240px] flex-col">
            {board.map((row, rowIndex) => {
              return (
                <li key={rowIndex} className="flex h-full w-full">
                  {row.map((cell, columnIndex) => {
                    return (
                      <button
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                        className={`${borderStyle(
                          rowIndex,
                          columnIndex,
                        )} h-[80px] w-1/3 border-slate-200/30 hover:bg-slate-900/50 sm:h-24`}
                        key={columnIndex}
                      >
                        <span
                          className={`${
                            cell === Cell.Circle
                              ? 'text-blue-300'
                              : 'text-yellow-200'
                          } font-regular text-6xl`}
                        >
                          {cell}
                        </span>
                      </button>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={() => resetGame()} className="text-red-500">
          Reset board
        </button>
      </div>
      <Transition appear show={isGameWon || isGameOver} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => resetGame()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[304px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Game over!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => resetGame()}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Offline;
