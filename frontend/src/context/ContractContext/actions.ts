import { BigNumber, ethers } from "ethers";
import { RPSGame } from "../../RPSGame";
import { GameStage, GameState, Player } from "./contractContext";
export enum StateActionType {
  UpdatePlayer,
  UpdateOpponent,
  UpdateGameStage,
  UpdateGameState,
}
export interface UpdatePlayer {
  type: StateActionType.UpdatePlayer;
  payload: Player;
}
export interface UpdateGameState {
  type: StateActionType.UpdateGameState;
  payload: GameState;
}
export interface UpdateOpponent {
  type: StateActionType.UpdateOpponent;
  payload: Player;
}
export interface UpdateGameStage {
  type: StateActionType.UpdateGameStage;
  payload: GameStage;
}

export type StateActions =
  | UpdatePlayer
  | UpdateOpponent
  | UpdateGameStage
  | UpdateGameState;

export enum ActionType {
  DepositFund,
  SubmitMove,
  RevealMove,
  WithdrawBalance,
}

export interface DepositBet {
  type: ActionType.DepositFund;
  payload: { amount: string; address?: string };
}
export interface SubmitMove {
  type: ActionType.SubmitMove;
  payload: { hashedMove: string; address?: string };
}
export interface RevealMove {
  type: ActionType.RevealMove;
  payload: { move: number; salt?: string; address?: string };
}
export interface WithdrawBalance {
  type: ActionType.WithdrawBalance;
}

export type GameActions =
  | DepositBet
  | SubmitMove
  | RevealMove
  | WithdrawBalance;

export interface PlayerFromContract {
  move: number;
  hashedMove: string;
  balance: BigNumber;
  addr: string;
  submitted: boolean;
  revealed: boolean;
  0: number;
  1: string;
  2: BigNumber;
  3: string;
  4: boolean;
  5: boolean;
}
export function getFormattedPlayer(_player: PlayerFromContract) {
  const player: Player = {
    move: _player.move,
    hashedMove: _player.hashedMove,
    balance: _player.balance.toString(),
    addr: _player.addr,
    submitted: _player.submitted,
    revealed: _player.revealed,
  };
  return player;
}

export async function fetchGameState(
  contract: RPSGame,
  connectedAddress: string = ""
): Promise<GameState> {
  const _playerA = await contract.playerA();
  const _playerB = await contract.playerB();
  const _betAmount = await contract.betAmount();
  const _gameStage = await contract.gameStage();
  const betAmount_ = ethers.utils.formatEther(_betAmount);
  const playerA: Player = getFormattedPlayer(_playerA);
  const playerB: Player = getFormattedPlayer(_playerB);
  let opponent: Player;
  let player: Player;
  if (playerA.addr === connectedAddress) {
    player = playerA;
    opponent = playerB;
  } else {
    player = playerB;
    opponent = playerA;
  }
  return {
    currentPlayer: player,
    opponent,
    betAmount: betAmount_,
    gameStage: _gameStage,
  };
}
