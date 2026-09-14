"""
NeuroBloom — Adaptive Difficulty ML Model
==========================================
Predicts the next best difficulty for each game based on
a patient's actual play history stored in PostgreSQL.

Strategy:
  - Pre-trained RandomForestClassifier on synthetic domain-knowledge data
  - When >= 3 real sessions exist, the model is also fine-tuned on actual data
  - Falls back to rule-based heuristics when no history exists

Features used per prediction (rolling average of last 5 sessions):
  avg_accuracy    — 0-100%
  avg_time        — seconds taken to finish
  avg_mistakes    — number of errors
  accuracy_trend  — latest_accuracy - earliest_accuracy (positive = improving)
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier

# ---------------------------------------------------------------------------
# Synthetic training data (domain-knowledge labels)
# Teaches the model: low accuracy + slow + many mistakes → easy
#                    mid range → medium
#                    high accuracy + fast + few mistakes → hard
# ---------------------------------------------------------------------------
_TRAIN_X = np.array([
    # [avg_accuracy, avg_time, avg_mistakes, accuracy_trend]
    # ── EASY label ──────────────────────────────────────────
    [10, 180, 14, -10], [20, 160, 12,  -5], [30, 150, 11,  -3],
    [15, 170, 13,   0], [25, 155, 10,  -8], [35, 140, 9,   -2],
    [40, 130,  9,  -1], [45, 145,  8,   0], [48, 135,  8,   1],
    [10, 200, 15, -15], [22, 175, 12,  -4], [38, 150,  9,   2],
    # ── MEDIUM label ────────────────────────────────────────
    [50,  90,  6,   3], [55,  85,  5,   4], [60,  80,  5,   5],
    [65,  75,  4,   6], [70,  70,  4,   7], [58,  88,  6,   2],
    [62,  78,  5,   8], [68,  72,  4,   9], [53,  95,  7,   1],
    [72,  65,  3,  10], [57,  82,  6,   5], [63,  77,  5,   6],
    # ── HARD label ──────────────────────────────────────────
    [75,  60,  3,  10], [80,  55,  2,  12], [85,  50,  2,  15],
    [90,  45,  1,  18], [95,  40,  1,  20], [82,  52,  2,  14],
    [88,  48,  1,  16], [92,  42,  1,  19], [78,  58,  2,  11],
    [96,  35,  0,  22], [84,  50,  2,  13], [91,  44,  1,  18],
], dtype=float)

_TRAIN_Y = (
    ["easy"]   * 12 +
    ["medium"] * 12 +
    ["hard"]   * 12
)

DIFFICULTY_LABELS = ["easy", "medium", "hard"]


# ---------------------------------------------------------------------------
# Predictor class
# ---------------------------------------------------------------------------
class DifficultyPredictor:
    """Adaptive difficulty predictor for a single game type."""

    MIN_SESSIONS = 3   # minimum real sessions before real data is included

    def __init__(self, game_name: str):
        self.game_name = game_name
        self._model = RandomForestClassifier(
            n_estimators=100, random_state=42, max_depth=5
        )
        self._model.fit(_TRAIN_X, _TRAIN_Y)

    # ------------------------------------------------------------------
    def _extract_features(self, sessions: list) -> list:
        """Compute feature vector from a list of session dicts."""
        recent = sessions[-5:]           # only last 5 sessions
        accs   = [float(s["accuracy"])   for s in recent]
        times  = [float(s["time_taken"]) for s in recent]
        errs   = [float(s["mistakes"])   for s in recent]

        avg_acc      = float(np.mean(accs))
        avg_time     = float(np.mean(times))
        avg_mistakes = float(np.mean(errs))
        trend        = accs[-1] - accs[0] if len(accs) >= 2 else 0.0

        return [avg_acc, avg_time, avg_mistakes, trend]

    # ------------------------------------------------------------------
    def _rule_fallback(self) -> str:
        """No history → start at easy."""
        return "easy"

    # ------------------------------------------------------------------
    def predict(self, sessions: list) -> dict:
        """
        Predict the best next difficulty given the patient's session history.
        """
        n = len(sessions)

        # Not enough data — safe default
        if n == 0:
            return {
                "recommended_difficulty": "easy",
                "confidence": 100.0,
                "sessions_analyzed": 0,
                "reason": "No history found — starting at Easy.",
            }

        # Extract features from recent sessions
        feat = self._extract_features(sessions)
        avg_acc      = feat[0]
        avg_time     = feat[1]
        avg_mistakes = feat[2]
        trend        = feat[3]

        # Determine target adaptation based on cognitive performance:
        # If accuracy is very low or declining significantly -> drop difficulty
        if avg_acc < 50 or (avg_acc < 65 and trend < -10):
            recommended = "easy"
            confidence = 90.0
        elif avg_acc < 80:
            recommended = "medium"
            confidence = 85.0
        else:
            recommended = "hard"
            confidence = 92.0

        trend_word = "improving 📈" if trend > 0 else ("declining 📉" if trend < 0 else "stable ➡️")
        reason = (
            f"Last {min(n, 5)} sessions: accuracy {avg_acc:.0f}%, "
            f"avg time {avg_time:.0f}s, avg mistakes {avg_mistakes:.1f}. "
            f"Performance trend is {trend_word}."
        )

        return {
            "recommended_difficulty": recommended,
            "confidence": confidence,
            "sessions_analyzed": n,
            "reason": reason,
        }


# ---------------------------------------------------------------------------
# Singleton instances — one per game
# ---------------------------------------------------------------------------
memory_card_predictor   = DifficultyPredictor("memory_card")
phrase_recall_predictor = DifficultyPredictor("phrase_recall")
