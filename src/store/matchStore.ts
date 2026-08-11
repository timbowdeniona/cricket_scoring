import { useState, useEffect } from 'react';
import { Match, Ball, ShotLocation, PitchLocation, Player, WicketInfo, ExtrasType, Innings, Over } from '@/types/cricket';
import { PlayCricketConfig } from '@/types/playCricket';
import { createSampleMatch } from '@/utils/sampleMatchData';

const MATCH_STORAGE_KEY = 'cricket_scoring_current_match';
const HISTORY_STORAGE_KEY = 'cricket_scoring_match_history';
const PC_CONFIG_KEY = 'cricket_scoring_pc_config';

export function useMatchEngine() {
  const [match, setMatch] = useState<Match | null>(() => createSampleMatch());
  const [savedMatches, setSavedMatches] = useState<Match[]>([]);
  const [pcConfig, setPcConfig] = useState<PlayCricketConfig>({
    siteId: '',
    apiToken: '',
    isDemoMode: true,
  });

  // Load state on initial mount from LocalStorage / IndexedDB
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedMatch = localStorage.getItem(MATCH_STORAGE_KEY);
        if (storedMatch) {
          setMatch(JSON.parse(storedMatch));
        }

        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          setSavedMatches(JSON.parse(storedHistory));
        }

        const storedPc = localStorage.getItem(PC_CONFIG_KEY);
        if (storedPc) {
          setPcConfig(JSON.parse(storedPc));
        }
      }
    } catch (e) {
      console.warn('Failed loading match state from local storage', e);
    }
  }, []);

  // Save current match whenever state updates
  useEffect(() => {
    if (match) {
      try {
        localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(match));
      } catch (e) {
        console.error('Failed saving match to local storage', e);
      }
    }
  }, [match]);

  const updatePlayCricketConfig = (config: Partial<PlayCricketConfig>) => {
    setPcConfig(prev => {
      const next = { ...prev, ...config };
      localStorage.setItem(PC_CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  };

  const loadSampleMatch = () => {
    const sample = createSampleMatch();
    setMatch(sample);
  };

  const recordBall = (
    runs: number,
    extras?: { type?: ExtrasType; runs: number },
    wicket?: WicketInfo,
    shotLocation?: ShotLocation,
    pitchLocation?: PitchLocation
  ) => {
    if (!match || match.status !== 'live') return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;
      const updatedMatch = JSON.parse(JSON.stringify(prevMatch)) as Match;
      const inn = updatedMatch.innings[updatedMatch.currentInningsIndex];
      if (!inn || inn.isCompleted) return prevMatch;

      const battingTeam = inn.battingTeamId === updatedMatch.homeTeam.id ? updatedMatch.homeTeam : updatedMatch.awayTeam;
      const bowlingTeam = inn.bowlingTeamId === updatedMatch.homeTeam.id ? updatedMatch.homeTeam : updatedMatch.awayTeam;

      let currentOver = inn.overs[inn.overs.length - 1];
      if (!currentOver || currentOver.isComplete) {
        currentOver = {
          overNumber: inn.overs.length + 1,
          bowlerId: inn.activeBowlerId,
          balls: [],
          runsConceded: 0,
          wicketsTaken: 0,
          isComplete: false,
        };
        inn.overs.push(currentOver);
      }

      const extraRuns = extras?.runs || 0;
      const totalBallRuns = runs + extraRuns;
      const isLegal = !extras?.type || (extras.type !== 'wide' && extras.type !== 'noBall');

      const legalBallsSoFar = currentOver.balls.filter(b => b.isLegal).length;
      const ballNum = isLegal ? legalBallsSoFar + 1 : legalBallsSoFar;

      const ball: Ball = {
        id: `ball_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        overNumber: currentOver.overNumber,
        ballNumberInOver: ballNum,
        strikerId: inn.activeStrikerId,
        nonStrikerId: inn.activeNonStrikerId,
        bowlerId: inn.activeBowlerId,
        runs,
        extras: extras || { runs: 0 },
        totalRuns: totalBallRuns,
        isLegal,
        wicket,
        shotLocation,
        pitchLocation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      currentOver.balls.push(ball);
      currentOver.runsConceded += totalBallRuns;
      inn.totalRuns += totalBallRuns;

      if (wicket) {
        currentOver.wicketsTaken += 1;
        inn.wickets += 1;

        // If bowler bowled out or all out (10 wickets)
        if (inn.wickets >= battingTeam.players.length - 1) {
          inn.isCompleted = true;
        }
      }

      // Check if over completed
      const newLegalCount = currentOver.balls.filter(b => b.isLegal).length;
      if (newLegalCount >= updatedMatch.settings.ballsPerOver) {
        currentOver.isComplete = true;
        inn.oversCompleted += 1;
        inn.ballsInCurrentOver = 0;
        // Swap strike at end of over
        const temp = inn.activeStrikerId;
        inn.activeStrikerId = inn.activeNonStrikerId;
        inn.activeNonStrikerId = temp;
      } else {
        inn.ballsInCurrentOver = newLegalCount;
        // Rotate strike on odd runs (if not wide/noBall extra odd runs)
        const batterRunsSwaps = (runs % 2 === 1);
        if (batterRunsSwaps) {
          const temp = inn.activeStrikerId;
          inn.activeStrikerId = inn.activeNonStrikerId;
          inn.activeNonStrikerId = temp;
        }
      }

      // Check if innings completed (overs reach max)
      if (inn.oversCompleted >= updatedMatch.settings.oversPerInnings) {
        inn.isCompleted = true;
      }

      return updatedMatch;
    });
  };

  const undoLastBall = () => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;
      const updatedMatch = JSON.parse(JSON.stringify(prevMatch)) as Match;
      const inn = updatedMatch.innings[updatedMatch.currentInningsIndex];
      if (!inn || inn.overs.length === 0) return prevMatch;

      let currentOver = inn.overs[inn.overs.length - 1];
      if (!currentOver || currentOver.balls.length === 0) {
        inn.overs.pop();
        currentOver = inn.overs[inn.overs.length - 1];
      }

      if (!currentOver || currentOver.balls.length === 0) return prevMatch;

      const removedBall = currentOver.balls.pop()!;
      currentOver.runsConceded -= removedBall.totalRuns;
      inn.totalRuns -= removedBall.totalRuns;

      if (removedBall.wicket) {
        currentOver.wicketsTaken -= 1;
        inn.wickets -= 1;
        inn.isCompleted = false;
      }

      const legalBallsLeft = currentOver.balls.filter(b => b.isLegal).length;
      currentOver.isComplete = legalBallsLeft >= updatedMatch.settings.ballsPerOver;
      inn.ballsInCurrentOver = legalBallsLeft;

      // Restore striker / non-striker
      inn.activeStrikerId = removedBall.strikerId;
      inn.activeNonStrikerId = removedBall.nonStrikerId;

      return updatedMatch;
    });
  };

  const swapStrike = () => {
    setMatch(prev => {
      if (!prev) return null;
      const copy = JSON.parse(JSON.stringify(prev)) as Match;
      const inn = copy.innings[copy.currentInningsIndex];
      if (inn) {
        const temp = inn.activeStrikerId;
        inn.activeStrikerId = inn.activeNonStrikerId;
        inn.activeNonStrikerId = temp;
      }
      return copy;
    });
  };

  const setStriker = (playerId: string) => {
    setMatch(prev => {
      if (!prev) return null;
      const copy = JSON.parse(JSON.stringify(prev)) as Match;
      const inn = copy.innings[copy.currentInningsIndex];
      if (inn) inn.activeStrikerId = playerId;
      return copy;
    });
  };

  const setNonStriker = (playerId: string) => {
    setMatch(prev => {
      if (!prev) return null;
      const copy = JSON.parse(JSON.stringify(prev)) as Match;
      const inn = copy.innings[copy.currentInningsIndex];
      if (inn) inn.activeNonStrikerId = playerId;
      return copy;
    });
  };

  const setBowler = (playerId: string) => {
    setMatch(prev => {
      if (!prev) return null;
      const copy = JSON.parse(JSON.stringify(prev)) as Match;
      const inn = copy.innings[copy.currentInningsIndex];
      if (inn) inn.activeBowlerId = playerId;
      return copy;
    });
  };

  const saveCurrentMatchToHistory = () => {
    if (!match) return;
    setSavedMatches(prev => {
      const filtered = prev.filter(m => m.id !== match.id);
      const next = [match, ...filtered];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const exportMatchJson = (): string => {
    return JSON.stringify(match, null, 2);
  };

  const importMatchJson = (jsonStr: string) => {
    try {
      const imported = JSON.parse(jsonStr) as Match;
      if (imported.id && imported.homeTeam && imported.awayTeam) {
        setMatch(imported);
        saveCurrentMatchToHistory();
      }
    } catch (e) {
      alert('Invalid Match JSON format');
    }
  };

  return {
    match,
    setMatch,
    pcConfig,
    updatePlayCricketConfig,
    savedMatches,
    loadSampleMatch,
    recordBall,
    undoLastBall,
    swapStrike,
    setStriker,
    setNonStriker,
    setBowler,
    saveCurrentMatchToHistory,
    exportMatchJson,
    importMatchJson,
  };
}
